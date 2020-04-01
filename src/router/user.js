const express = require('express');
const router = new express.Router();
const User = require('../model/user');
const auth = require('../middleware/auth');

router.post('/user', async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        // const token = await user.generateAuthToken();

        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e);
    }
})
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(e) {
        res.status(400).send(e); 
    }
})
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(e){
        res.status(500).send(e);
    }
})
router.get('/user/me', auth, async (req, res) => {
    res.send(req.user);
})
router.get('/user/:id', auth, async (req, res) => { 
    try{
        const _id = req.params.id;
        const user = await User.findById(_id);
        if(!user) { 
            return res.status(404).send();
        }
        res.send(user);
    } catch(e) {
        res.status(500).send(e);
    }
})
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    }catch(e) {
        res.status(400).send(e)
    }
})
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }
})
router.post('/user/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = router;