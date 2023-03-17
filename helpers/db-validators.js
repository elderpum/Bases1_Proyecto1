
const {Role, User, Category, Product } = require('../models');

const isValidRole = async (role = '') => { 
    const existentRole = await Role.findOne({role})
    if (!existentRole) {
        throw new Error(`${role} role is not registered. `);
    }
}

const emailExists = async(email) => {
    
    const existentEmail = await User.findOne({email});

    if ( existentEmail ) {
        throw new Error(`Email: ${email} is already registered.`);
    }
}

const userExistsByID = async(id) => {
    
    const existentEmail = await User.findById(id);

    if ( !existentEmail ) {
        throw new Error(`Id: ${id} does not exist.`);
    }
}

const categoryExistsByID = async(id) => {
    
    const existentCategory = await Category.findById(id);

    if ( !existentCategory ) {
        throw new Error(`Id: ${id} does not exist.`);
    }
}

const categoryExistsByName = async(name='') => {
    
    const existentCategory = await Category.findOne({name});

    if ( !existentCategory ) {
        throw new Error(`Name: ${name} does not exist.`);
    }
}


const productExistsByID = async(id) => {
    
    const existentCategory = await Product.findById(id);

    if ( !existentCategory ) {
        throw new Error(`Id: ${id} does not exist.`);
    }
}

/**
 * Validate allowerd collections
 */
const allowedCollections = (collection = '', collections = []) => {
    const included = collections.includes(collection);

    if( !included ){
        throw new Error(`Collection ${collection} is not allowed. Allowed collections: ${collections}`)
    }

    return true;
}

module.exports = {
    isValidRole,
    emailExists,
    userExistsByID,
    categoryExistsByID,
    categoryExistsByName,
    productExistsByID,
    allowedCollections
}