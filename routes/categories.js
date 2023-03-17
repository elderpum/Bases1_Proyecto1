
const { Router } = require('express');
const { check, query } = require('express-validator');

const { 
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

const { categoryExistsByID } = require('../helpers/db-validators');


const {
    validateAtributes,
    validateJWT,
    isAdmin
} = require('../middlewares');

const router = Router();

// Get all categories
router.get('/', [
    query('limit', 'Limit must be a number.').isNumeric().optional(),
    query('from', 'From must be a number.').isNumeric().optional(),
    validateAtributes
], getCategories)

// Get a single category
router.get('/:id', [
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(categoryExistsByID),
    validateAtributes
], getCategoryById)

// Create a new category - valid JWT token
router.post('/', [
    validateJWT,
    check('name', 'Name is mandatory').not().isEmpty(),
    validateAtributes
], createCategory);

// Update a register
router.put('/:id', [
    validateJWT,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(categoryExistsByID),
    validateAtributes
], updateCategory)

// Delete a category - Admin

router.delete('/:id', [
    validateJWT,
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom(categoryExistsByID),
    isAdmin,
    validateAtributes
], deleteCategory)


module.exports = router;