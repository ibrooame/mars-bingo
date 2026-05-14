const express = require('express');
const { validateTelegram } = require('../middleware/validateTelegram');
const { publicUser } = require('../utils/helpers');
const router = express.Router();
router.post('/telegram', validateTelegram, (req,res)=>res.json({user:publicUser(req.user)}));
router.get('/me', validateTelegram, (req,res)=>res.json({user:publicUser(req.user)}));
module.exports = router;
