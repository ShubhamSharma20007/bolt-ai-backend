const express = require('express');
const authRoute = express.Router();
const { auth: userAuth, verifyUser, handleLogout } = require('../controllers/auth.controller.js')
const { auth } = require('../middleware/auth.middleware.js');
authRoute.post('/auth', userAuth);
authRoute.get('/verify-user', auth, verifyUser)
authRoute.get('/logout', auth, handleLogout)


module.exports = authRoute; 
