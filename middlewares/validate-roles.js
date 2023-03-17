const { response } = require("express");


const isAdmin = (req, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({
            msg: 'Trying to verify role, without a valid token.'
        });
    }

    const { role, name } = req.user;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not an administrator.`
        })
    }

    next();
}

const hasRole = (...roles) => {

    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Trying to verify role, without a valid token.'
            });
        }

        if ( !roles.includes(req.user.role)){
            return res.status(401).json({
                msg: 'Service requires a role.'
            })
        }
        
        next();
    }
}


module.exports = {
    isAdmin,
    hasRole
};