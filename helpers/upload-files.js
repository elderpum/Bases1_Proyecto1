const path = require('path');
const { v4: uuidv4 } = require('uuid')

const uploadFiles = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
    return new Promise((resolve, reject) => {

        const { file } = files;

        const splittedName = file.name.split('.');
        const extension = splittedName[splittedName.length - 1];

        if (!allowedExtensions.includes(extension)) {
            return reject(`${extension} is not allowed. Allowed extensions are: ${allowedExtensions}`);
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(tempName)
        });
    });
}


module.exports = {
    uploadFiles
}