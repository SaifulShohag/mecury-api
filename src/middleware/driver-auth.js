const jwt = require('jsonwebtoken');
const Driver = require('../model/driver');

const driverAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'AWalkToRemember');
        const driver = await Driver.findOne({_id: decoded._id, 'tokens.token': token})

        if(!driver) {
            throw new Error();
        }

        req.token = token;
        req.driver = driver;
        next()
    }catch(e) {
        res.status(401).send({error: 'Please log in first!'});
    }
}

module.exports = driverAuth;