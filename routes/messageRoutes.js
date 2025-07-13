const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const authenticate = require('../middleware/authMiddleware');

router.post('/send', authenticate, sendMessage);
router.get('/', authenticate, getMessages);

module.exports = router;
