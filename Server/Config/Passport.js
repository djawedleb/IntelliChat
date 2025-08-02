import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { User } from "../Models/UserSchema.js";


passport.use(new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'password'
    },
    async(email , password , done) =>{
        try{
        const ExtUser = await User.findOne({email});
        if(!ExtUser){
            return done(null, false, { message: 'User not found' });
        };
        const isMatch = await bcrypt.compare(password, ExtUser.password);
        return isMatch
        ? done(null, ExtUser)
        : done(null, false, { message: "Password Incorrect" });

        }catch(error){
            console.error({message : error});
            return done(error);
        }
    }
));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: "google-auth" // You might want to handle this differently
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);  // Store only the user ID in session
});
passport.deserializeUser(async (id,done)=>{
    try {
        const user = await User.findById(id);  // ✅ CORRECT
        done(null, user);
    } catch (error) {
        done(error);
    }
});