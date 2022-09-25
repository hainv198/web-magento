// const fs = require("fs");
// const router = require('express').Router()
// const cloudinary = require('cloudinary').v2
//
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// })
//
// router.post('/upload_avatar', (req, res) => {
//     try {
//         console.log(req.files)
//         if(!req.files || Object.keys(req.files).length === 0)
//            return res.status(400).json({msg: "No files were uploaded."})
//
//         const file = req.files.file;
//         if(file.size > 1024*1024){
//             removeTmp(file.tempFilePath)
//             return (400).json({msg:'Size too large'})
//         }
//         if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
//             removeTmp(file.tempFilePath)
//             return res.status(400).json({msg:'File format is incorrect.'})
//         }
//
//         cloudinary.uploader.upload(file.tempFilePath, {folder:'test'}, async (err, result) => {
//
//             if (err) throw  err;
//             removeTmp(file.tempFilePath)
//
//             res.json({result})
//         })
//         // res.json('test-dm upload anh k dc')
//     }catch (err) {
//         res.status(500).json({msg:err.message})
//     }
// })
// const removeTmp = (path) => {
//     fs.unlink(path, err => {
//         if (err) throw  err;
//     })
// }
// module.exports = router

const router = require('express').Router()
const uploadImage = require('../middleware/uploadImage')
const uploadCtrl = require('../controllers/uploadCtrl')
const auth = require('../middleware/auth')

router.post('/upload_avatar',uploadCtrl.uploadAvatar, uploadImage, auth )

module.exports = router