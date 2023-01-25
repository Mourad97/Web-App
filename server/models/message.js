const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
    sedner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    seen:{
        type: Boolean,
        default: false,
    },
    data:{
        type: Date,
        default: Date.now
    }
});

const Model = mongoose.model('Message', ModelSchema);

module.exports = Model;