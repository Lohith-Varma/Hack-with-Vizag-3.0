// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const rateLimit = require('express-rate-limit');

// const rateLimit = require('express-rate-limit');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const registrationLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 10, // Limit each IP to 10 requests per windowMs
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: 'Too many registration attempts from this IP, please try again after 15 minutes',
// });
// app.use('/register', registrationLimiter);

// // --- CONNECTING TO MONGODB ---
// const MONGO_URI = "mongodb+srv://siddu_0426:lohith2006@hackathoncluster.k1xp9kp.mongodb.net/hackathon?retryWrites=true&w=majority&appName=HackathonCluster";

// mongoose.connect(MONGO_URI)
//     .then(() => console.log("✅ Connected to MongoDB"))
//     .catch((err) => console.error("❌ MongoDB connection error:", err));

// // --- DEFINING THE DATA STRUCTURE (SCHEMA & MODEL) ---

// const  memberSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     roll: { type: String, required: true },
// });

// const LeaderSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     roll: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String, required: true },
// });

// const teamSchema = new mongoose.Schema({
//     teamName: { type: String, required: true },
//     collegeName : { type: String, required: true },
//     leader : { type: LeaderSchema, required: true },
//     members : [memberSchema],
// },{ timestamps : true });

// const Team = mongoose.model("Team", teamSchema);

// app.get("/ping", (req, res) => {
//     console.log("✅ Ping route was hit!");
//     res.json({ message: "Pong! The server is alive." });
// });

// app.post("/register", async (req, res) => {
//     try{
//         console.log("Received registration request with body:", req.body);

//         const { teamName, collegeName, leader, members } = req.body;

//         const existingTeam = await Team.findOne({ 'leader.email': leader.email });
//         if (existingTeam) {
//             console.log("Found duplicate entry based on leader's email.");
//             return res.status(409).json({ message: "A team with this leader's email is already registered!" });
//         }

//         console.log("📝 Attempting to save new registration...");
//         const newTeam = new Team({
//             teamName,
//             collegeName,
//             leader,
//             members
//         });

//         await newTeam.save();
//         console.log("Registration saved successfully!");

//         res.status(201).json({ message: "Registration Successful! Good luck in the hackathon! 🚀" });
//     }
//     catch (error) {

//         if (error.code === 11000) {
//         console.error("Duplicate key error:", error.keyValue);
//         return res.status(409).json({ message: `A team with this leader's Email or Phone is already registered!` });
//     }

//         console.error("Registration FAILED: ", error);
//         res.status(500).json({
//             message: "Something went wrong on the server. Please try again after some time!",
//             error: error.message
//         });
//     }
// });


// // --- STARTING THE SERVER ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));








const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Replace with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://lohithvarma:Lohith@hackwithvizag-3.dycbmhy.mongodb.net/?retryWrites=true&w=majority&appName=HackWithVizag-3'; 

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas connected...'))
    .catch(err => console.log(err));

// Define the Registration Schema
const registrationSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true },
    collegeName: { type: String, required: true },
    teamSize: { type: Number, required: true },
    leaderName: { type: String, required: true },
    leaderEmail: { type: String, required: true, unique: true },
    leaderPhone: { type: String, required: true, unique: true },
    leaderStudentId: { type: String, required: true, unique: true },
    teamMembers: [{
        name: { type: String, required: true },
        studentId: { type: String, required: true },
    }],
    paymentId: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// API Endpoint to check for duplicates
app.post('/api/check-duplicates', async (req, res) => {
    try {
        const { teamName, leaderEmail, leaderPhone, leaderStudentId } = req.body;
        
        const existingRegistration = await Registration.findOne({
            $or: [
                { teamName: teamName },
                { leaderEmail: leaderEmail },
                { leaderPhone: leaderPhone },
                { leaderStudentId: leaderStudentId }
            ]
        });

        if (existingRegistration) {
            return res.json({ isDuplicate: true, message: "A user with this team name, email, phone, or student ID is already registered." });
        }
        res.json({ isDuplicate: false });
    } catch (error) {
        console.error('Error checking for duplicates:', error);
        res.status(500).json({ isDuplicate: false, message: 'Server error during duplicate check.' });
    }
});

// API Endpoint to save registration data
app.post('/api/register', async (req, res) => {
    try {
        const newRegistration = new Registration(req.body);
        await newRegistration.save();
        res.status(201).json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ success: false, message: 'Failed to save registration.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
