import Doctor from "../models/DoctorSchema.js"

export const updateDoctor = async(req,res)=>{
    const id = req.params.id
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id,{$set:req.body},{new:true})

        res.status(200).json({success:true,message:"Successfully updated",data:updatedDoctor})

    } catch (error) {
        res.status(500).json({success:false,message:"failed to update doctor"})
    }
}

export const deleteDoctor = async(req,res)=>{
    const id = req.params.id
    try {
         await Doctor.findByIdAndDelete(id);

        res.status(200).json({success:true,message:"Successfully deleted"})

    } catch (error) {
        res.status(500).json({success:false,message:"failed to delete doctor"})
    }
}

export const getSingleDoctor = async(req,res)=>{
    const id = req.params.id
    try {
        const doctor = await Doctor.findById(id).select('-password');

        res.status(200).json({success:true,message:"doctor found",data:doctor})

    } catch (error) {
        res.status(404).json({success:false,message:"No doctor found"})
    }
}

export const getAllDoctors = async(req,res)=>{
    
    try {
      const { query } = req.query; //for search filters based on name and specialization
      let doctors;

      if(query){
        doctors = await Doctor.find({
            isApproved:"approved",//get only approved doctors
            $or: [
                {name: {$regex: query, $options: "i"}},
                {specialization: {$regex: query,$options: "i"}},
            ],
        }).select('-password');
      }else{
        //if there is no search filter get all the doctors whose status is approved
        doctors = await Doctor.find({ isApproved:"approved"}).select('-password');
      }
      
      res.status(200).json({success:true,message:"Doctors found",data:doctors});


    } catch (error) {
        res.status(404).json({success:false,message:"All doctors not found"})
    }
}