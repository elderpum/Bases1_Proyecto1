
const { Schema, model } = require('mongoose');


const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is mandatory']
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

userSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    return { uid: _id, ...user};
}

module.exports = model( 'User', userSchema );