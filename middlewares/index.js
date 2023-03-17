

const validateJWT = require('./validate-jwt');
const validateAtributes = require('./validate-attributes');
const validateRoles = require('./validate-roles');
const validateUploadedFile = require('./validate-file');


module.exports = {
    validateAtributes,
    ...validateJWT,
    ...validateRoles,
    ...validateUploadedFile
}

