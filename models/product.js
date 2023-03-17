
const { Schema, model } = require('mongoose');


const ProductSchema = Schema({
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
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
    },
    availabre: {
        type: Boolean,
        default: true
    },
    img: { type: String}
});


ProductSchema.methods.toJSON = function() {
    const { __v, _id, ...product } = this.toObject();
    
    const { __v: v, password, _id:id, ...user } = product.user;
    product.user = { uid: id, ...user};

    const { __v: v2, _id:id2, ...category } = product.category;
    product.category = { uid: id, ...category};

    return { uid: _id, ...product};
}


module.exports = model('Product', ProductSchema)