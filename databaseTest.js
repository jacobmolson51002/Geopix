const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Jacob:geopixapp@cluster0.gu9cs.mongodb.net/users?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});

const messageSchema = {
    _partition: "string",
    message: "string",
    to: "string",
    from: "string",
    timestamp: "string"
}

const test = async () => {
    const Message = mongoose.Model('message', messageSchema);
    const findMessages = await Message.find();
    console.log(findMessages);
}

module.exports = test;