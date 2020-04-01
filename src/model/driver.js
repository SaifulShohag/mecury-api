const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const Job = require('./jobs');

const driverSchema = new mongoose.Schema({
    jid: [{
        type: String,
        trim: true,
        ref: 'Job'
    }],
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
    birthDate:{
        type: String,
        required: true,
        trim: true
    },
    licenseNumber: {
        type: String,
        required: true,
        trim: true
    }, 
    carModel: {
        type: String,
        required: true,
        trim: true
    },
    imagePath: {
        type: String,
        required: true,
        trim: true
    },
    assignedTo: [{
        type: String,
        required: true,
        trim: true
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//Accessible through instance
driverSchema.methods.generateAuthToken = async function () {
    const driver = this;
    const token = await jwt.sign({_id: driver._id.toString() }, 'AWalkToRemember');

    driver.tokens = driver.tokens.concat({ token })
    await driver.save();
    return token;
}
driverSchema.methods.toJSON = function() {
    const driver = this.toObject();
    driver.userInfo.password = "";
    delete driver.tokens;

    return driver;
}

//Accessible through Model
driverSchema.statics.findByCredential = async (username, password) => {
    const driver = await Driver.findOne({ 'userInfo.username': username });
    if(!driver) {
        throw new Error("Username or password is Invalid");
    }

    isMatch = await bcrypt.compare(password, driver.userInfo.password);
    if(!isMatch) {
        throw new Error("Username or password is Invalid"); 
    }

    return driver;
}

//hash plain text password
driverSchema.pre('save', async function(next) {
    const driver = this;
    if(driver.isModified('userInfo.password')){
        driver.userInfo.password = await bcrypt.hash(driver.userInfo.password, 9)
    }

    next();
})
driverSchema.pre('remove', async function(next) {
    const driver = this;
    await Job.deleteMany({ 'jobStatus.uid': driver.userInfo.id });

    next()
})

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver; 