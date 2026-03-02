const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    modelUrl: String,
    bgColor: { type: String, default: '#ffffff' },
    wireframe: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', SettingsSchema);