const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://127.0.0.1:27017/3dviewer_final');

const Config = mongoose.model('Config', new mongoose.Schema({
    modelUrl: String, bgColor: String, wireframe: Boolean, matColor: String, hdri: String
}));

const upload = multer({ dest: 'uploads/' });
app.get("/test", (req, res) => {
    res.send("3D Viewer API");
});
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({ url: `https://mern-3dviewer.onrender.com/uploads/${req.file.filename}` });
});

app.post('/api/settings', async (req, res) => {
    await Config.findOneAndUpdate({}, req.body, { upsert: true });
    res.json({ message: "Saved!" });
});

app.get('/api/settings', async (req, res) => {
    const data = await Config.findOne().sort({ _id: -1 });
    res.json(data || {});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;