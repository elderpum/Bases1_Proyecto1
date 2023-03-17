
const { response } = require('express');
const jwt = require('jsonwebtoken');
const { userExistsByID } = require('../helpers/db-validators');

const User = require('../models/user');

const validateJWT = async (req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No token in request.'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        req.uid = uid;

        const user = await User.findById(uid);

        if ( !userExistsByID(uid) ) {
            return res.status(401).json({
                msg: 'Not a valid token - user does not exist'
            })
        }

        // Verify if user is active

        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Not a valid token - not active user'
            })
        }
        // const { _id, ...userUID } = user;
        // userUID.uid = _id;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Not a valid token'
        })
    }

}

module.exports = {
    validateJWT
}