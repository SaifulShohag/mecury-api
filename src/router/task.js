const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../model/task');

router.post('/task', auth, async (req, res) => {
    delete req.body._id;
    const task = new Task({
        ...req.body
    })

    try {
        await task.save()
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})
router.get('/admin/all-tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ });
        res.send(tasks);
    } catch(e) {
        res.status(500).send(e); 
    } 
})
router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e);
    } 
})
router.patch('/admin/task/:id', async (req, res) => {
    try{
        const task = await Task.findOne({_id: req.params.id});
        if(!task) {
            res.status(404).send();
        }

        task['assignedTo'] = req.body['assignedTo'];
        await task.save()
        res.send(task);
    }catch(e) {
        res.status(400).send(e);
    }
})
router.patch('/task/:id', auth, async (req, res) => {
    delete req.body._id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['orderType', 'orderItem', 'senderInfo', 'receiverInfo', 'locationInfo', 
    'uid', 'assignedTo']; 
    const isValid = updates.every((update) => allowedUpdates.includes(update));

    if(!isValid) {
        res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const task = await Task.findOne({_id: req.params.id, uid: req.body.uid});
        
        if(!task) {
            res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save()
        res.send(task);
    }catch(e) {
        res.status(400).send(e);
    }
})
router.delete('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, uid: req.user.userInfo.id});
        
        if(!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})

module.exports = router;