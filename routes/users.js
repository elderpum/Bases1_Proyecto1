
const { Router } = require('express');
const { check, query } = require('express-validator');


const {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers,
    patchUsers
} = require('../controllers/users');

const { isValidRole, emailExists, userExistsByID } = require('../helpers/db-validators');

// const validateAtributes = require('../middlewares/validate-attirbutes');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdmin, hasRole } = require('../middlewares/validate-roles');

const { 
    validateAtributes,
    validateJWT,
    isAdmin,
    hasRole
} = require('../middlewares');

const router = Router();


router.get('/',[
    query('limit', 'Limit must be a number.').isNumeric().optional(),
    query('from', 'From must be a number.').isNumeric().optional(),
    validateAtributes
],
getUsers);

router.put('/:id', [
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom( userExistsByID ),
    check('role').custom( isValidRole ),
    validateAtributes
], putUsers);

router.post('/', [
    check('name', 'Name is mandatory.').not().isEmpty(),
    check('password', 'Password needs to be at least 6 letters long.').isLength(6),
    check('email', 'Email is not valid.').isEmail(),
    // check('role', 'Not a valid role.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isValidRole ),
    check('email').custom( emailExists ),
    validateAtributes
] ,postUsers);

router.delete('/:id',[
    validateJWT,
    isAdmin,
    // hasRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
    check('id', 'Not a valid id').isMongoId(),
    check('id').custom( userExistsByID ),
    validateAtributes
], deleteUsers);

router.patch('/', patchUsers);


module.exports = router;