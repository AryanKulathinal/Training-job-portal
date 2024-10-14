const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios'); // Import Axios

router.get('/',async(req,res)=> {
try{
    const users = await User.find();
    res.status(200).json(users);
}
catch(err){
    res.status(500).json({message:err})
}
});

router.post('/',async(req,res)=>{

    const {userId,userName,userEmail,userPhone,userAddress,userHighestDegree,userExperience,userSkills}=req.body;
    const newUser = new User({
        userId,
        userName,
        userEmail,
        userPhone,
        userAddress,
        userHighestDegree,
        userExperience,
        userSkills
    });
    try{
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch(err){
        res.status(400).json({message:err});
    }
    
    

});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters

    try {
        const user = await User.findOne({ userId }); // Find the user by userId
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If not found, return 404
        }

        res.status(200).json(user); // Return the user details
    } catch (err) {
        res.status(500).json({ message: "Error fetching user details", error: err.message });
    }
});



router.post('/apply-job', async (req, res) => {
    const {  userId,jobId } = req.body;

    try {
        // Fetch job data from the other application (optional)
        const jobResponse = await axios.get(`http://localhost:3001/jobs/${jobId}`);
        const jobData = jobResponse.data;

        // Check if the job exists
        if (!jobData) {
            return res.status(404).json({ message: "Job not found" });
        }

        await User.findOneAndUpdate(
            { userId: userId },
            { $addToSet: { appliedJobs: jobId } },);

        // Update the number of applicants for the job
        await axios.patch(`http:/localhost:3001/jobs/${jobId}/apply`, {});

        res.status(200).json({
            message: "Application submitted successfully!",
            job: jobData
        });
    } catch (err) {
        res.status(500).json({ message: "Error applying for job", error: err.message });
    }
});

router.get('/jobs', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/jobs'); // URL of the other application
        const jobs = response.data; // Assuming the response contains job data
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching jobs", error: err.message });
    }
});


module.exports = router;