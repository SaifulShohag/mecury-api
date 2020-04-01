const express = require('express');
const router = new express.Router();
const Driver = require('../model/driver');
const driverAuth = require('../middleware/driver-auth');

router.post('/driver', async (req, res) => {
    try{
        const driver = new Driver(req.body);
        await driver.save();
        // const token = await user.generateAuthToken();

        res.status(201).send(driver)
    } catch (e) {
        res.status(400).send(e);
    }
})
router.post('/driver/login', async (req, res) => {
    try {
        const driver = await Driver.findByCredential(req.body.username, req.body.password);
        const token = await driver.generateAuthToken();
        res.send({driver, token});
    }catch(e) {
        res.status(400).send(e);
    }
})
router.get('/admin/driver', async (req, res) => {
    try {
        const driver = await Driver.find({});
        res.send(driver);
    } catch(e){
        res.status(500).send(e);
    }
})
router.get('/driver/me', driverAuth, async (req, res) => {
    res.send(req.driver);
})
router.patch('/admin/driver', async (req, res) => {
    const _id = req.body._id;
    try {
        const driver = await Driver.findOne({ _id });
        if(!driver) {
            res.status(404).send('Driver is not found');
        }

        driver['assignedTo'] = req.body['assignedTo'];
        await driver.save();
        res.send(driver);
    } catch(e) {
        res.status(400).send(e);
    }
})
// router.delete('/driver/me', driverAuth, async (req, res) => {
//     try {
//         await req.driver.remove();
//         res.send(req.driver);
//     }catch(e) {
//         res.status(400).send(e)
//     }
// })
router.post('/driver/logout', driverAuth, async (req, res) => {
    try {
        req.driver.tokens = req.driver.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.driver.save();
        res.send(req.driver);
    } catch(e) {
        res.status(500).send(e);
    }
})
router.post('/driver/logout-all', driverAuth, async (req, res) => {
    try {
        req.driver.tokens = [];

        await req.driver.save();
        res.send();
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = router;