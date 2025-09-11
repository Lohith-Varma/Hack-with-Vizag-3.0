const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require('dotenv').config(); //for loading environment variables from .env file
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

if(!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in the .env file.");
    process.exit(1);
}      
// const rateLimit = require('express-rate-limit');

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many registration attempts from this IP, please try again after 15 minutes',
});
app.use('/api/register', registrationLimiter);

// Replace with your MongoDB Atlas connection string
const MONGO_URI = process.env.MONGO_URI;

// --- CONNECTING TO MONGODB ---
// const MONGO_URI = "mongodb+srv://siddu_0426:lohith2006@hackathoncluster.k1xp9kp.mongodb.net/hackathon?retryWrites=true&w=majority&appName=HackathonCluster";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}


// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ MongoDB connection error:", err));



// --- DEFINING THE DATA STRUCTURE (SCHEMA & MODEL) ---

const RegistrationSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true },
    collegeName : { type: String, required: true},
    teamSize: { type: Number, required: true, min: 3, max: 4 },

    //schema for leader
    leaderName: { type: String, required: true },
    leaderRoll: { type: String, required: true, unique: true },
    leaderEmail: { type: String, required: true, unique: true },
    leaderPhone: { type: String, required: true, unique: true },

    //schema for members
    teamMembers: [{
        name: { type: String, required: true},
        StudentId: { type: String, required: true},
    }],

    //transaction id
    transactionId: { type: String, required: true, unique: true },

}, { timestamps: true });

const Registration = mongoose.model("Registration", RegistrationSchema);

(async () => {
    try {
        await Registration.syncIndexes();
        console.log("✅ Indexes synced with schema.");
    } catch (err) {
        console.error("❌ Failed to sync indexes:", err);
    }
})();


// await Registration.syncIndexes(); 


app.get("/ping", (req, res) => {
    console.log("✅ Ping route was hit!");
    res.json({ message: "Pong! The server is alive." });
});

app.post("/register", async (req, res) => {
    try{
        console.log("Received registration request with body:", req.body);

        const { teamName, collegeName, leader, teamMembers = [], transactionId } = req.body;

        if (!leader || !leader.name || !leader.roll || !leader.email || !leader.phone) {
            return res.status(400).json({ message: "Leader details are missing or incomplete." });
        }

        console.log("DEBUG Incoming Request Body:", req.body);

        const existingTeam = await Registration.findOne({
            $or: [
                { teamName },
                { leaderEmail: leader.email },
                { leaderPhone: leader.phone },
                { leaderRoll: leader.roll },
                { transactionId }
            ]
        });

        const allRollNumbers = [leader.roll, ...teamMembers.map(member => member.StudentId)];

        const duplicateRoll = await Registration.findOne({
        $or: [
        { roll: { $in: allRollNumbers } }, // check against leader roll
        { "teamMembers.StudentId": { $in: allRollNumbers } } // check against members roll
        ]
});
if (duplicateRoll) {
    return res.status(409).json({
        message: "One or more roll numbers are already registered with another team."
    });
}
        


        //old one

        if (existingTeam) {
    if (existingTeam.teamName === teamName) {
        return res.status(409).json({ message: "This team name is already taken. Please choose a different name." });
    }

    if (existingTeam.email === leader.email) {
        return res.status(409).json({ message: "A team with this leader's email is already registered!" });
    }

    if (existingTeam.phone === leader.phone) {
        return res.status(409).json({ message: "A team with this leader's phone number is already registered!" });
    }

    if (existingTeam.roll === leader.roll) {
        return res.status(409).json({ message: "A team with this leader's roll number is already registered!" });
    }

    if (existingTeam.transactionId === transactionId) {
        return res.status(409).json({ message: "This transaction ID has already been used for registration." });
    }

    // fallback
    return res.status(409).json({ message: "Duplicate registration detected. Please check your details." });
}

        console.log("📝 Attempting to save new registration...");
        const newTeam = new Registration({
            teamName,
            collegeName,
            teamSize: teamMembers.length + 1, // +1 for the leader
            leaderName: leader.name,
            leaderRoll: leader.roll,
            leaderEmail: leader.email,
            leaderPhone: leader.phone,
            teamMembers,
            transactionId,
        });

        await newTeam.save();
        console.log("Registration saved successfully!");

        res.status(201).json({ message: "Registration Successful! Good luck in the hackathon! 🚀" });
    }
    catch (error) {

        if (error.code === 11000) {
        console.error("Duplicate key error:", error.keyValue);
        return res.status(409).json({ message: "A team with this leader's Email or Phone is already registered!" });
    }

        console.error("Registration FAILED: ", error);
        res.status(500).json({
            message: "Something went wrong on the server. Please try again after some time!",
            error: error.message,
            stack: error.stack
        });
    }
});


// --- STARTING THE SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));