import express from "express";
import { addUser ,updateUser,deleteUser } from "../Controllers/UserController.js";

export const UserRouter = express.Router();

UserRouter.post("/register" , addUser);
UserRouter.put("/update/:id" , updateUser);
UserRouter.delete("/delete/:id" , deleteUser);

