const mongoose =require("mongoose");

const messageSchema = new mongoose.Schema({

    message: {
        type: String
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,

    },
    image:{
        type:String,
    },

    }, {
        timestamps: true,
    })


module.exports = mongoose.model("Message", messageSchema);