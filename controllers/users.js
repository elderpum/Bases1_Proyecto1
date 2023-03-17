
const { response, request } = require('express');
const { encrypt } = require('../helpers/encryption');

const User = require('../models/user');


const getUsers = async (req = request, res = response) => {

    // const { q, name, apiKey, page = 1, limit = 100} = req.query;

    const { limit = 5, from = 0 } = req.query;

    const query = { state: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query)
            .skip(Number(from))
            .limit(Number(limit)),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit)),
    ]);

    res.json({
        total,
        users
    });
}

const putUsers = async (req = request, res = response) => {

    const id = req.params.id;

    const { _id, password, google, ...toModify } = req.body;


    if (password) {
        toModify.password = encrypt(password)
    }

    const user = await User.findByIdAndUpdate(id, toModify, { new: true });

    res.status(200).json(user);
}

const postUsers = async (req = request, res = response) => {

    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });

    // Encrypt password
    user.password = encrypt(password)

    // Save on DB
    await user.save();

    res.status(201).json({
        msg: 'post api',
        user
    });
}

const deleteUsers = async (req = request, res = response) => {

    const { id } = req.params;

    // Delete physically 
    //const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate(id, { state: false });

    res.status(200).json(user);
}

const patchUsers = (req = request, res = response) => {
    res.json({
        msg: 'patch api',
    });
}

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers,
    patchUsers
}
