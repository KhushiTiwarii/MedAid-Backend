import express from "express";
import { deleteDoctor, getAllDoctors, getSingleDoctor, updateDoctor } from "../Controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const doctorRouter = express.Router()

//nested route
doctorRouter.use('/:doctorId/reviews',reviewRouter)

doctorRouter.get("/:id",authenticate,restrict(['doctor']),getSingleDoctor);
doctorRouter.get("/",getAllDoctors);
doctorRouter.put("/:id",authenticate,restrict(['doctor']),updateDoctor);
doctorRouter.delete("/:id",authenticate,restrict(['doctor']),deleteDoctor);

export default doctorRouter