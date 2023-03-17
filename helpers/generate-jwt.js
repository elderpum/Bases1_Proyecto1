
const jwt = require('jsonwebtoken');
const { User } = require('../models')


const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '1h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('Token was not generated');
            } else {
                resolve(token);
            }
        });
    })
}

const verifyJWT = async( token = '') => {
    try{
        if( token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);
        if( user && user.state ) {
            return user
        } 
        return null;

    } catch (error) {
        return null;
    }
}


module.exports = {
    generateJWT,
    verifyJWT
};