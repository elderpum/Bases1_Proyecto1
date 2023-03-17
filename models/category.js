
const { Schema, model } = require('mongoose');


const CategorySchema = Schema({
    name : {
        type: String,
        required: [true, 'Name is mandatory.'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'State is mandatory.']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


CategorySchema.methods.toJSON = function() {
    const { __v, _id, ...category } = this.toObject();
    
    const { __v: v, password, _id:id, ...user } = category.user;
    category.user = { uid: id, ...user};

    return { uid: _id, ...category};
}


module.exports = model('Category', CategorySchema)