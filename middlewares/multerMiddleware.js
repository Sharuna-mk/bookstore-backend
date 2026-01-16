//create multer
const multer = require('multer')

//create diskstorage and file name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //path to store files
        cb(null, './uploads')
    },
    //file name in which files should be stored

    filename :(req,file,cb)=>{
        cb(null,`IMG-${file.originalname}`)
    }
})

//file filtering - only png,jpg not pdf
const fileFilter = (req,file,cb)=>{
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'  ){
        cb(null,true)
    }
    else{
        cb(null,false)
        return cb(new Error('only accept png,jpg or jpeg format'))
    }
}
const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig