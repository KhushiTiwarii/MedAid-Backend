import express from "express";
import { deleteUser, getAllUser, getSingleUser, updateUser } from "../Controllers/UserController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const userRouter = express.Router()

userRouter.get("/:id",authenticate,restrict(['patient']),getSingleUser);
userRouter.get("/",authenticate,restrict(['admin']),getAllUser);
userRouter.put("/:id",authenticate,restrict(['patient']),updateUser);
userRouter.delete("/:id",authenticate,restrict(['patient']),deleteUser);

export default userRouter