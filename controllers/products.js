const { response } = require("express");
const { Product, Category } = require('../models');



const getProducts = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query)
            .skip(Number(from))
            .limit(Number(limit)),
        Product.find(query)
            .populate('user')
            .populate('category')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        products
    })
}

const getProductById = async (req, res = response) => {
    const id = req.params.id;

    const product = await Product.findById(id)
                                    .populate('category')
                                    .populate('user')

    res.status(200).json(product)
}

const createProduct = async (req, res = response) => {

    let { state, user, ...body } = req.body;

    const name = body.name.toUpperCase();
    const category = body.category.toUpperCase();

    const [productDB, categoryDB] = await Promise.all([
        Product.findOne({ name }),
        Category.findOne({ name: category })
    ]);

    if (productDB) return res.status(400).json({ msg: 'Product already exists' });

    const data = {
        ...body,
        name,
        category: categoryDB._id,
        user: req.user._id
    }

    const product = await new Product(data);
    await product.save();

    res.status(201).json(product)
}

const updateProduct = async (req, res = response) => {
    const { id } = req.params;

    const { _id, user, state, ...toModify } = req.body;

    if( toModify.name ){
        toModify.name = toModify.name.toUpperCase();
    }

    toModify.user = req.user._id;

    const newCategory = await Category.findOne({name: toModify.category});
    toModify.category = newCategory;

    const product = await Product.findByIdAndUpdate(id, toModify, { new: true });

    res.status(200).json(product);
}

const deleteProduct = async (req, res = response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    res.status(200).json(product)
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}