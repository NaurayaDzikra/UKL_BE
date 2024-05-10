const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "./image")
    },
    filename: (req,file,cb) => {
        cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req,file,cb) => {
        const acceptedType = ["image/jpg","image/jpeg","image/png"]
        if(!acceptedType.includes(file.mimetype)) {
            cb(null, false)
            return cb(`Invalid file type (${file.mimetype})`)
        }

        const fileSize = req.headers['content-length']
        const maxSize = (100 * 1920 * 1080)
        if (fileSize > maxSize){
            return cb("False size too large")
        }
        cb(null, true)
    }
})
module.exports = upload