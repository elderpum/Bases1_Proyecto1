const { response } = require("express");
const { compareEncrypted, googleVerify, generateJWT } = require("../helpers");
const User = require('../models/user');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verify if email exists

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: 'User / Password are not correct - email'
            })
        }

        // User is active

        if (!user.state) {
            return res.status(400).json({
                msg: 'User / Password are not correct - state: false'
            })
        }

        // Verify password
        if (!compareEncrypted(password, user.password)) {
            return res.status(400).json({
                msg: 'User / Password are not correct - password'
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong, talk to your administrator'
        });
    }


}


const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            // Create user
            const data = {
                name,
                email,
                password: 'PLACEHOLDER',
                img,
                role: 'USER_ROLE',
                google: true
            }

            user = new User(data);
            await user.save();
        }

        if (!user.state) {
            return res.status(401).json({
                msg: `User not active, talk to the platform's administrator`
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Cannot verify with google sing in'
        })
    }


}

const renewToken = async(req, res) => {
    const { user } = req;

    // Generate JWT
    const token = await generateJWT(user.id);
    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}