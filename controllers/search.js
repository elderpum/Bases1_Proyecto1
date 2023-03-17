const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Product, Category } = require('../models')

const allowedCollections = [
    'categories',
    'products',
    'roles',
    'users',
];

const searchUsers = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await User.findById(term);

        return res.status(200).json({
            total: user ? 1 : 0,
            results: user ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i');


    const query = {
        $or: [
            { name: regex },
            { email: regex }
        ],
        $and: [{ state: true }]
    };

    const [users, total] = await Promise.all([
        User.find(query),
        User.countDocuments(query)
    ])

    res.status(200).json({
        total,
        results: users
    });
}


const searchProducts = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const product = await Product.findById(term)
                                        .populate('category', 'user')
        return res.status(200).json({
            total: product ? 1 : 0,
            results: product ? [product] : []
        })
    }

    const regex = new RegExp(term, 'i');

    let query = {
        $and: [{ state: true }, {
            $or: [
                { name: regex },
                { email: regex }
            ]
        }]
    };

    // Searching by price
    if (parseFloat(term)) {
        query = {
            $and: [{ state: true }, { price: { $gt: Number(term) } }],
        }
    }


    const [products, total] = await Promise.all([
        Product.find(query).populate('category','name').populate('user'),
        Product.countDocuments(query),
    ])

    res.status(200).json({
        total,
        results: products
    });
}

const searchCategory = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const category = await Category.findById(term);

        return res.status(200).json({
            total: category ? 1 : 0,
            results: category ? [category] : []
        })
    }

    const regex = new RegExp(term, 'i');


    const query = {
        $and: [{ state: true }, {
            $or: [
                { name: regex }
            ]
        }]
    };

    const [categories, total] = await Promise.all([
        Category.find(query).populate('user'),
        Category.countDocuments(query)
    ])

    res.status(200).json({
        total,
        results: categories
    });
}

const search = (req, res = response) => {

    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection))
        return res.status(400).json({ msg: `Allowed collections are ${allowedCollections}` })

    switch (collection) {
        case 'categories':
            searchCategory(term, res)
            break;

        case 'products':
            searchProducts(term, res)
            break;

        case 'users':
            searchUsers(term, res);
            break;

        default:
            return res.status(500).json({ msg: 'Unhandled searching. ' })
    }
}

module.exports = {
    search
}