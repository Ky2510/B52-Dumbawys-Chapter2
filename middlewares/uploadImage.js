const multer = require('multer')
const bcrypt = require('bcrypt')
const path = require('path')

const salt = 10

const fileName = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets/image")
    },
    filename: async (req, file, cb) => {
        const originalName = path.parse(file.originalname).name
        const hashedName = await bcrypt.hash(originalName, salt)
        const fileName = `${hashedName}` 
        cb(null, fileName)
    }
})

const uploadImage = multer({
    storage: fileName
})
  
module.exports = uploadImage