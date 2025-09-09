const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());
app.use(express.json());

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many registration attempts from this IP, please try again after 15 minutes',
});
app.use('/register', registrationLimiter);

// Replace with your MongoDB Atlas connection string
const mongoURI = "mongodb+srv://siddu_0426:lohith2006@hackathoncluster.k1xp9kp.mongodb.net/hackathon?retryWrites=true&w=majority&appName=HackathonCluster"; 

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
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
    paymentId: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", registrationSchema);

app.get("/ping", (req, res) => {
    console.log("✅ Ping route was hit!");
    res.json({ message: "Pong! The server is alive." });
})


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
