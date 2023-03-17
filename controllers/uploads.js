
const path = require('path')
const fs = require('fs')
const { response } = require("express");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFiles, getModel } = require("../helpers");


const uploadFile = async (req, res = response) => {

    // Images
    try {
        const name = await uploadFiles(req.files, ['txt', 'md'], 'texts');

        res.json({
            name: name
        })
    } catch (err) {
        return res.status(400).json({ msg: err })
    }

}

// const updateImage = async (req, res = response) => {

//     const { id, collection } = req.params;
//     let model;
//     try {
//         model = await getModel(collection, id);
//     } catch (error) {
//         return res.status(error.code).json({ msg: error.msg })
//     }


//     // Clean previous images
//     if (model.img) {
//         const imgPath = path.join(__dirname, '..', 'uploads', collection, model.img);
//         if (fs.existsSync(imgPath)) {
//             fs.unlinkSync(imgPath);
//         }
//     }

//     model.img = await uploadFiles(req.files, undefined, collection);
//     await model.save();

//     res.json(model);

// }

const updateImageClodinary = async (req, res = response) => {

    const { id, collection } = req.params;
    let model;
    try {
        model = await getModel(collection, id);
    } catch (error) {
        return res.status(error.code).json({ msg: error.msg })
    }

    // Clean previous images
    if (model.img) {
        const arrName = model.img.split('/');
        const name = arrName[arrName.length -1 ];
        const [ public_id ] = name.split('.');

        cloudinary.uploader.destroy(public_id)
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    model.img = secure_url;
    await model.save();

    res.json(model);

}

// const showImage = async (req, res = response) => {


//     const { id, collection } = req.params;

//     let model;
//     try {
//         model = await getModel(collection, id);
//     } catch (error) {
//         return res.status(error.code).json({ msg: error.msg })
//     }

//     if (model.img) {
//         const imgPath = path.join(__dirname, '..', 'uploads', collection, model.img);
//         if (fs.existsSync(imgPath)) {
//             return res.sendFile(imgPath)
//         }
//     }

//     const imgPath = path.join(__dirname, '..', 'assets', 'no-image.jpg');
//     if (fs.existsSync(imgPath)) {
//         return res.sendFile(imgPath)
//     } else {
//         return res.status(500).json({msg:'Placeholder not found.'})
//     }
// }


const showImageCloudinary = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;
    try {
        model = await getModel(collection, id);
    } catch (error) {
        return res.status(error.code).json({ msg: error.msg })
    }

    if (model.img) {
        return res.redirect(model.img)
    }

    const imgPath = path.join(__dirname, '..', 'assets', 'no-image.jpg');
    if (fs.existsSync(imgPath)) {
        return res.sendFile(imgPath)
    } else {
        return res.status(500).json({msg:'Placeholder not found.'})
    }
}

module.exports = {
    uploadFile,
    showImageCloudinary,
    updateImageClodinary
}