const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require('dotenv').config(); //for loading environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

if(!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in the .env file.");
    process.exit(1);
}      

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

console.log("DEBUG: The value of MONGO_URI is:", MONGO_URI);

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ MongoDB connection error:", err));



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
    transactionId: { type: String, required: true, unique: true},
    registeredAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", registrationSchema);

// app.get("/ping", (req, res) => {
//     console.log("✅ Ping route was hit!");
//     res.json({ message: "Pong! The server is alive." });
// })

// API Endpoint to check for duplicates before final submission
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

app.get("/", (req, res) => {
    res.send("Backend is running ✅");
});


app.post('/api/register', async (req, res) => {
    try {
        const newRegistration = new Registration(req.body);
        await newRegistration.save();
        res.status(201).json({ success: true, message: 'Registration successful! Your submission is pending verification.' });
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            const message = duplicateField === 'transactionId'
                ? 'This Transaction ID has already been used.'
                : `A team with this ${duplicateField} is already registered.`;
            return res.status(409).json({ success: false, message });
        }
        console.error('Error saving registration:', error);
        res.status(500).json({ success: false, message: 'Failed to save registration due to a server error.' });
    }
});

app.get("/ping", (req, res) => {
    console.log("✅ Ping route hit");
    res.json({ message: "Server is alive!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));