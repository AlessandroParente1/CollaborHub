const mongoose =require('mongoose');

const UserSchema= new mongoose.Schema({
    username: {
        type:String,
        unique:true
    }, //2 user non possono avere lo stesso username
    password: String,
},
    {timestamps:true}
);

const UserModel= mongoose.model('User',UserSchema);
module.exports=UserModel;