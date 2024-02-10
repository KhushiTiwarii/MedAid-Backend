import express from "express";
import { createReview, getAllReviews } from "../Controllers/reveiwController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const reviewRouter = express.Router({mergeParams:true})

//but it should be /doctor/:doctorid/reviews => make nested routing in doctor route
reviewRouter.route('/').get(getAllReviews).post(authenticate,restrict(["patient"]),createReview)

export default reviewRouter