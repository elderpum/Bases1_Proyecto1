const { User, Product } = require("../models");


const getModel = (collection, id) => {
    return new Promise(async(resolve, reject) => {
        switch (collection) {
            case 'users':
                model = await User.findById(id);

                if (!model) {
                    return reject({code:400, msg:`There isn't any user with id: ${id}`})
                }
                break;
    
            case 'products':
                model = await Product.findById(id);
    
                if (!model) {
                    return reject({code:400, msg:`There isn't any product with id: ${id}`})
                }
                break;
    
            default:
                reject({code:500, msg:'Collection not supported.'})
        }
        
        resolve(model)
    });

}

module.exports = {
    getModel
}