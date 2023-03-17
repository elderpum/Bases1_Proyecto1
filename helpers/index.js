

const dbValidators = require('./db-validators');
const encryption = require('./encryption');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFiles = require('./upload-files');
const getModel = require('./get-model');


module.exports = {
    ...dbValidators,
    ...encryption,
    ...generateJWT,
    ...googleVerify,
    ...uploadFiles,
    ...getModel
}