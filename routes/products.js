
const { Router } = require('express');
const { check, query } = require('express-validator');


const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

const {
    categoryExistsByName,
    productExistsByID
} = require('../helpers/db-validators');

const {
    validateJWT,
    validateAtributes,
    isAdmin
} = require('../middlewares');


const router = Router();

// Get all products
router.get('/', [
    query('limit', 'Limit must be a number.').isNumeric().optional(),
    query('from', 'From must be a number.').isNumeric().optional(),
    validateAtributes
], getProducts);

// Get a single product
router.get('/:id', [
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(productExistsByID),
    validateAtributes
], getProductById)

// Create product
router.post('/', [
    validateJWT,
    check('name', 'Name is mandatory').not().isEmpty(),
    check('category', 'Category is mandatory').not().isEmpty(),
    check('category').custom(categoryExistsByName),
    validateAtributes
], createProduct)

// Update a register
router.put('/:id', [
    validateJWT,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(productExistsByID),
    validateAtributes
], updateProduct)


// Delete a category - Admin

router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(productExistsByID),
    validateAtributes
], deleteProduct)


module.exports = router;