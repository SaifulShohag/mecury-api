const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const Task  = require('../model/task');

const userSchema = new mongoose.Schema({
    userInfo: {
        id: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if(!validator.isEmail(value)){
                    throw new Error('Provided email is Invalid!');
                }
            }
        },
        phone: {
            type: Number,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            validate(value) {
                if(value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"');
                }
            }
        },
    },
    order: [],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: 'userInfo.id',
    foreignField: 'uid'
})

//Accessible through instance
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id.toString() }, 'AWalkToRemember');

    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;
}
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    user.userInfo.password = "";
    delete user.tokens;

    return user;
}

//Accessible through Model
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ 'userInfo.username': username });
    if(!user) {
        throw new Error("Username or password is Invalid");
    }

    isMatch = await bcrypt.compare(password, user.userInfo.password);
    if(!isMatch) {
        throw new Error("Username or password is Invalid"); 
    }

    return user;
}

//hash plain text password
userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('userInfo.password')){
        user.userInfo.password = await bcrypt.hash(user.userInfo.password, 9)
    }

    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User