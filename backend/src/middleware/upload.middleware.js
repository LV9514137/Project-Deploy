import multer from "multer";

const upload = multer({storage: multer.memoryStorage(),

    limits : {
        fileSize : 5 * 1024 * 1024,
    },

    fileFilter: (req,file,cb)=>{
        if(file.originalname.toLocaleLowerCase().endsWith(".csv"))
        {
            return cb(null, true)
        }

        cb(new Error("Only csv file is allowed"))
    }
})

export default upload

