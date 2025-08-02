import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Database = async ()=> {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongo Connected ${connect.connection.host}`);
    }catch(error){
        console.error(`Error :${error.message}`);
        process.exit(1);
    }
}

export default Database;