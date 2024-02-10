import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const generateToken = user=>{
    //how to make secret key in env 
    //on terminal write -> node
    //on entering write -> crypto.randomBytes(256).toString('base64')
    return jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET_KEY,{
        expiresIn:'30d',
    })
    
}

export const register = async (req,res) => {
    
    const {email,password,name,role,photo,gender} = req.body

    
    try {
        let user = null
        if(role==='patient'){
            user = await User.findOne({email})
        }
        else if(role==='doctor'){
            user = await Doctor.findOne({email})
        }
        //chk if user exist
        if(user){
            return res.status(400).json({message:"User already exist"})
        }
        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        if(role==='patient'){
            user = new User({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }
        if(role==='doctor'){
            user = new Doctor({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }

        await user.save()

        res.status(200).json({success:true,message:'User successfully created'})

    } catch (error) {
        res.status(500).json({success:false,message:'Internal server error, Try again'})
    }
}

export const login = async (req,res) => {
    
    const {email} = req.body;

    try {
        let user = null

        const patient = await User.findOne({email})
        const doctor = await Doctor.findOne({email})

        if(patient){
            user = patient
        }
        if(doctor){
            user = doctor
        }
        //chk if user exists or not
        if(!user){
            return res.status(404).json({message:"User not found"}); 
        }
        //if user found chk if provided password matches the hashedpassword
        const isPasswordMatch = await bcrypt.compare(req.body.password,user.password)

        if(!isPasswordMatch){
            return res.status(400).json({status:false,message:"Invalid Credentials"})
        }
        //if password matches we will generate authentication token
        const token = generateToken(user);

        const {password,role,appointments,...rest} = user._doc

        res.status(200).json({status:true,message:"Successfully loggedIn", token, data:{...rest}, role})

    } catch (error) {
        res.status(500).json({status:false,message:"Failed to login"})
    }
}