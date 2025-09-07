const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require('express-rate-limit');

const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many registration attempts from this IP, please try again after 15 minutes',
});
app.use('/register', registrationLimiter);

// --- CONNECTING TO MONGODB ---
const MONGO_URI = "mongodb+srv://siddu_0426:lohith2006@hackathoncluster.k1xp9kp.mongodb.net/hackathon?retryWrites=true&w=majority&appName=HackathonCluster";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- DEFINING THE DATA STRUCTURE (SCHEMA & MODEL) ---

const  memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true },
});

const LeaderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
});

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    collegeName : { type: String, required: true },
    leader : { type: LeaderSchema, required: true },
    members : [memberSchema],
},{ timestamps : true });

const Team = mongoose.model("Team", teamSchema);

app.get("/ping", (req, res) => {
    console.log("✅ Ping route was hit!");
    res.json({ message: "Pong! The server is alive." });
});

app.post("/register", async (req, res) => {
    try{
        console.log("Received registration request with body:", req.body);

        const { teamName, collegeName, leader, members } = req.body;

        const existingTeam = await Team.findOne({ 'leader.email': leader.email });
        if (existingTeam) {
            console.log("Found duplicate entry based on leader's email.");
            return res.status(409).json({ message: "A team with this leader's email is already registered!" });
        }

        console.log("📝 Attempting to save new registration...");
        const newTeam = new Team({
            teamName,
            collegeName,
            leader,
            members
        });

        await newTeam.save();
        console.log("Registration saved successfully!");

        res.status(201).json({ message: "Registration Successful! Good luck in the hackathon! 🚀" });
    }
    catch (error) {

        if (error.code === 11000) {
        console.error("Duplicate key error:", error.keyValue);
        return res.status(409).json({ message: `A team with this leader's Email or Phone is already registered!` });
    }

        console.error("Registration FAILED: ", error);
        res.status(500).json({
            message: "Something went wrong on the server. Please try again after some time!",
            error: error.message
        });
    }
});


// --- STARTING THE SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));