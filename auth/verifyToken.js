import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

//ye middleware bana rahe h taki sirf jo loggedin user h vahi khudka info update kar sake koi bhi na kar sake jake

export const authenticate = (req,res,next) => {

    //get token from headers
    const authToken = req.headers.authorization

    //chk if token is exists
    if(!authToken || !authToken.startsWith('Bearer')){
        return res.status(401).json({success:false,message:"No token, authorization denied"})
    }
    try {
        const token = authToken.split(' ')[1];

        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

        req.userId = decoded.id;
        req.role = decoded.role;

        next();
    } catch (error) {

        if(error.name==='TokenExpiredError'){
           return res.status(401).json({message:"Token expires"})

        }
        return res.status(401).json({success:false,message:"Invalid Token"})

    }
}

///next jab /users pe jate h toh sab user mill jate h par sirf admin ko hi milne chiye sab users na hence ye middleware
export const restrict = roles => async(req,res,next)=>{
    const userId = req.userId
    
    let user;

    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if(patient){
        user=patient
    }
    if(doctor){
        user=doctor
    }
    if(!roles.includes(user.role)){
        return res.status(401).json({success:false,message:"You are not authorized"});
    }

    next();
}