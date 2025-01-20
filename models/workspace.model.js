const mongoose = require('mongoose');
const WorkspaceSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: [
        {
            role: String,
            content: String
        }

    ],
    fileData: {
        type: Object,
        default: null
    }

}, {
    timestamps: true,
    versionKey: false
})


const WorkspaceModel = mongoose.model('Workspace', WorkspaceSchema);
module.exports = WorkspaceModel;