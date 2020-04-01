const mongoose = require('mongoose');
const Task = require('../model/task');

const jobSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    orders: [],
    drivers: [],
    vehicles: [{
        carModel: {
            type: String,
            required: true,
            trim: true
        },
        carNumber: {
            type: String,
            required: true,
            trim: true
        }
    }],
    jobstatus: [{
        uid: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            trim: true
        },
    }],
    jobstatusMessage: {
        type: String,
        trim: true
    },
    statusMessage: {
        type: String,
        trim: true
    }, 
    accepted : {
        type: Boolean
    },
    rejected: {
        type: Boolean
    }
});
jobSchema.virtual('order', {
    ref: 'Task',
    localField: 'id',
    foreignField: 'jid'
});
jobSchema.virtual('driver', {
    ref: 'Driver',
    localField: 'id',
    foreignField: 'jid'
});


jobSchema.pre('remove', async function(next) {
    const job = this;
    const tasks = await Task.find({ jid: job.id });
    await Promise.all(tasks.map(async (task) => {
        task.jid = '';
        await task.save();
        return task;
    }));

    next()
})

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;