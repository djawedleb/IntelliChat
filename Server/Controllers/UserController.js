import { User } from "../Models/UserSchema.js";
import bcrypt from "bcryptjs";

export const addUser = async (req ,res)=>{
    try{
        const {name , email , password} = req.body;
        
        const extuser = await User.findOne({email});
        if(extuser){
            return res.status(400).json({
                message : "Email is Already registred"
            })
        };
        const HashPassword = await bcrypt.hash(password ,10);
        
        const user = await User.create({
            name,
            email,
            password:HashPassword
        });
        if(!user){
            console.log("No User Saved!!");
        }
        res.status(201).json({message:"User Saved Successfully! " , user})
    }catch(error){
        console.error(`error ${error}`);
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req,res)=>{
    try{
        const { id } = req.params;
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const NewUser = await User.findByIdAndUpdate(id , req.body );
        if (!NewUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({message:"User Updated Successfully! " , NewUser})
    }catch(error){
        console.error(`error ${error}`);
        res.status(500).json({ error: error.message });
    }
}
export const deleteUser = async (req,res)=>{
    try{
        const id = req.params.id;
        const OldUser = await User.findByIdAndDelete(id , req.body );
        if (!OldUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({message:"User Deleted Successfully! " , OldUser})
    }catch(error){
        console.error(`error ${error}`);
        res.status(500).json({ error: error.message });
    }
}

// --- LOGIN CONTROLLER ---
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }
        // You can generate a JWT here if needed and send it back
        res.status(200).json({ message: "Login successful!", user });
    } catch (error) {
        console.error(`error ${error}`);
        res.status(500).json({ error: error.message });
    }
};

// --- LOGOUT CONTROLLER ---
export const logoutUser = (req, res) => {
    // For JWT: just instruct client to delete token
    res.status(200).json({ message: "Logged out successfully" });
};