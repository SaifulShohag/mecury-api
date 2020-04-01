const express = require('express');
const router = new express.Router();
const Job = require('../model/jobs');
const Task = require('../model/task');
const Driver = require('../model/driver');
const driverAuth = require('../middleware/driver-auth');

router.get('/driver-jobs', driverAuth, async (req, res) => {
    try {
        const data = [];
        let jobs = await Promise.all(req.driver.jid.map(async (id) => {
            let job = await Job.findOne({ id });
            data.push(job);
            await job.populate('order').execPopulate();
            await job.populate('driver').execPopulate(); 
            job.orders = job.order;
            job.drivers = job.driver;
            return job;
        }));
        res.send(jobs);
    } catch(e) {
        res.status(500).send(e);
    } 
})

router.post('/admin/job', async (req, res) => {
    const job = new Job({ ...req.body });

    try {
        job.orders.map(async (order) => {
            await Task.findOneAndUpdate({_id: order._id}, order, {new: true, useFindAndModify: false});
        });
        job.drivers.map(async (driver) => {
            delete driver.userInfo;
            await Driver.findOneAndUpdate({_id: driver._id}, driver, {new: true, useFindAndModify: false})
        })

        job.orders = [];
        job.drivers = [];
        await job.save()
        res.status(201).send(job);
    } catch (e) {
        res.status(400).send(e);
    }
})
router.get('/admin/job', async (req, res) => {
    const jobs = await Job.find({ });
    try {
        let data = await Promise.all(jobs.map(async (job) => {
            await job.populate('order').execPopulate();
            await job.populate('driver').execPopulate(); 
            job.orders = job.order;
            job.drivers = job.driver;
            return job;
        }));
        res.send(data);
    } catch(e) {
        res.status(500).send(e);
    }
})
router.patch('/admin/job', async (req, res) => {
    delete req.body.orders;
    delete req.body.drivers;
    console.log(req.body);

    const updates = ['jobstatus', 'jobstatusMessage', 'statusMessage', 'accepted', 'rejected']; 

    try {
        const job = await Job.findOne({ id: req.body.id });
        
        if(!job) {
            res.status(404).send();
        }

        updates.forEach((update) => job[update] = req.body[update]);
        await job.save()
        res.send(job);
    }catch(e) {
        res.status(400).send(e);
    }
})
router.delete('/admin/job/:id', async (req, res) => {
    try {
        const job = await Job.findOne({id: req.params.id});
        
        if(!job) {
            res.status(404).send()
        }
        const drivers = await Driver.find({ jid: job.id });
        drivers.map(async (driver) => {
            driver.jid = driver.jid.filter((id) => {
                return id !== job.id;
            })
            await driver.save();
        })

        await job.remove();
        res.send(job);
    } catch(e) {
        res.status(400).send(e);
    }
})
module.exports = router;