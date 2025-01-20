const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    picture: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

    },

}, {
    timestamps: true,
    versionKey: false
})


UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;