
const { Router } = require('express')
const { check } = require('express-validator');

const { uploadFile, updateImageClodinary, showImageCloudinary } = require('../controllers/uploads');

const { allowedCollections } = require('../helpers');

const { validateUploadedFile, validateAtributes } = require('../middlewares');

const router = Router();

router.post('/', validateUploadedFile, uploadFile);

router.put('/:collection/:id', [
    validateUploadedFile,
    check('id', 'Not a valid id').isMongoId(),
    check('collection').custom( c => allowedCollections(c, ['users', 'products'])),
    validateAtributes
], updateImageClodinary);

router.get('/:collection/:id', [
    check('id', 'Not a valid id').isMongoId(),
    check('collection').custom( c => allowedCollections(c, ['users', 'products'])),
    validateAtributes
], showImageCloudinary);

module.exports = router; 