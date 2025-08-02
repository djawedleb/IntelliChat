import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import Database from "./Config/Db.js";
import session from "express-session";
import passport from "passport";
import "./Config/Passport.js";
import  {UserRouter}  from "./Routes/UserRoutes.js";
import { AuthRouter } from "./Routes/AuthenticationRoutes.js";
import { upload } from "./Config/multer.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const Api_Key = process.env.GROQ_API;

//Middleware
app.use(express.json());
app.use(cors({
  origin: `${process.env.FRONT_URL}`,
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    httpOnly: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//DataBase Connection
Database();

//Routes
app.use('/api', AuthRouter);
app.use('/api', UserRouter);

//Ai Route with image support
app.post("/chat", upload.single('image'), async (req, res) => {
  try {
    console.log("Received request:", req.body);
    console.log("Uploaded file:", req.file);
    
    // Handle messages whether it's a string or object
    let Message;
    if (typeof req.body.messages === 'string') {
      Message = JSON.parse(req.body.messages);
    } else {
      Message = req.body.messages;
    }
    const uploadedImage = req.file;
    
    console.log("Parsed messages:", Message);
    
    if(!Array.isArray(Message) || Message.length ===0 ){
     return res.status(400).json({error:"Messages array required"})
    }

    let messagesToSend = [...Message];
    
    // Clean messages to remove unsupported properties for Groq
    messagesToSend = messagesToSend.map(msg => {
      const cleanMsg = {
        role: msg.role,
        content: msg.content
      };
      return cleanMsg;
    });
    
    // If an image was uploaded, add it to the last user message
    if (uploadedImage) {
      try {
        // Read the original image
        const originalBuffer = fs.readFileSync(uploadedImage.path);
        const originalSizeMB = (originalBuffer.length / (1024 * 1024)).toFixed(2);
        console.log(`Original image size: ${originalSizeMB}MB`);
        
        // Always compress images to very small size
        console.log("Compressing image to small size...");
        let imageBuffer = await sharp(originalBuffer)
          .resize(400, 300, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ 
            quality: 60,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();
        
        // If still too large, compress more aggressively
        if (imageBuffer.length > 100 * 1024) { // 100KB
          console.log("Further compressing...");
          imageBuffer = await sharp(imageBuffer)
            .resize(300, 225, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ 
              quality: 40,
              progressive: true,
              mozjpeg: true
            })
            .toBuffer();
        }
        
        const compressedSizeKB = (imageBuffer.length / 1024).toFixed(2);
        console.log(`Compressed image size: ${compressedSizeKB}KB`);
        
        // Check final size
        if (imageBuffer.length > 4 * 1024 * 1024) {
          return res.status(413).json({ 
            error: `Image too large (${(imageBuffer.length / (1024 * 1024)).toFixed(2)}MB). Please try a smaller image.` 
          });
        }
        
        const base64Image = imageBuffer.toString('base64');
        const mimeType = 'image/jpeg'; // Use JPEG for compressed images
        
        // Find the last user message and add the image
        const lastUserMessageIndex = messagesToSend.findIndex(msg => msg.role === 'user');
        if (lastUserMessageIndex !== -1) {
          // Create a new message object without imageUrl property
          const userMessage = messagesToSend[lastUserMessageIndex];
          messagesToSend[lastUserMessageIndex] = {
            role: userMessage.role,
            content: [
              {
                type: "text",
                text: userMessage.content || "What's in this image?"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          };
        }
      } catch (error) {
        console.error("Image processing error:", error);
        return res.status(500).json({ error: "Failed to process image" });
      }
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: messagesToSend,
        max_tokens: 1000
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Api_Key}`,
        },
      }
    );

    res.json({ 
      reply: response.data.choices[0].message.content,
      imageUrl: uploadedImage ? `${process.env.BACK_URL}/uploads/${uploadedImage.filename}` : null
    });
  } catch (err) {
    console.error("Server error:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Something went wrong." });
  }
});

//Port
app.listen(PORT , () =>{
    console.log(`Server is running on port ${PORT}`)
})
