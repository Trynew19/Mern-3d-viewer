const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// --- CORS FIX START ---
app.use(cors({
    origin: "https://mern-3d-viewer-1.onrender.com", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// --- CORS FIX END ---

app.use(express.json());

// Ensure 'uploads' folder exists on Render
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection
mongoose.connect('mongodb+srv://chauhankrishana42_db_user:3w4QJV0YkkpP8597@qullep3d.mkfmok2.mongodb.net/QULEEP3dviewer?retryWrites=true&w=majority&appName=QULLEP3D');

const Config = mongoose.model('Config', new mongoose.Schema({
    modelUrl: String,
    bgColor: String,
    wireframe: Boolean,
    matColor: String,
    hdri: String,
    timestamp: { type: Date, default: Date.now }
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("3D Viewer API is Running...");
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const fileUrl = `https://mern-3dviewer.onrender.com/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.post('/api/settings', async (req, res) => {
    try {
        await Config.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json({ message: "Saved!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/settings', async (req, res) => {
    try {
        const data = await Config.findOne().sort({ timestamp: -1 });
        res.json(data || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;