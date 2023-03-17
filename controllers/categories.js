const { response } = require("express");
const { Category } = require('../models');



const getCategories = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const query = { state: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query)
            .skip(Number(from))
            .limit(Number(limit)),
        Category.find(query)
            .populate('user')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        categories
    })
}

const getCategoryById = async (req, res = response) => {
    const id = req.params.id;

    const category = await Category.findById(id);

    res.status(200).json(category)
}

const createCategory = async (req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) return res.status(400).json({ msg: 'Category already exists' });

    const data = {
        name,
        user: req.user._id
    }

    const category = await new Category(data);
    await category.save();

    res.status(201).json(category)
}

const updateCategory = async (req, res = response) => {
    const { id } = req.params;

    const { _id, user, state, ...toModify } = req.body;

    toModify.name = toModify.name.toUpperCase();
    toModify.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, toModify, { new: true });

    res.status(200).json(category)
}

const deleteCategory = async (req, res = response) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true });

    res.status(200).json(category)
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}