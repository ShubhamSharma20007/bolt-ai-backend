const express = require('express');
const workspaceRoute = express.Router();
const auth = require('../middleware/auth.middleware.js')
const { addWorkspace, validatePrompt, getMessageById, chatWithAI, findWorkUserWise, pushMessages, generateCode, updateGenerateCode, findWorkSpaceById } = require('../controllers/workspace.controller.js')

workspaceRoute.post('/add-workspace', addWorkspace);
workspaceRoute.get('/get-workspace/:id', getMessageById);
workspaceRoute.post('/ai-chat', chatWithAI);
workspaceRoute.put('/add-message', pushMessages);

//  genrate code request
workspaceRoute.post('/generate-code-request', generateCode)
workspaceRoute.put('/generate-code', updateGenerateCode)
workspaceRoute.get('/find-workspace', findWorkSpaceById) // :id
workspaceRoute.get('/find-work-user-wise', findWorkUserWise) // :id
workspaceRoute.get('/validate-prompt', validatePrompt)
module.exports = workspaceRoute; 
