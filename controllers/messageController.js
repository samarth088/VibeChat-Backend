const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
    const { recipientUsername, content } = req.body;
    try {
        const sender = req.user._id;
        const recipient = await User.findOne({ username: recipientUsername });
        if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

        const message = new Message({ sender, recipientUsername, content });
        await message.save();
        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message', details: err.message });
    }
};

exports.getMessages = async (req, res) => {
    const username = req.user._id;
    const user = await User.findById(username);

    const messages = await Message.find({
        $or: [
            { sender: user._id },
            { recipientUsername: user.username }
        ]
    }).populate('sender', 'username');
    res.json(messages);
};
