import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const storage = multer.diskStorage({
    // Specify where files will be saved
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../uploads'));
    },
    filename: function(req,file,cb){
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() *1E9);
        cb(null, 'chat-image' + uniqueSuffix + path.extname(file.originalname));
    }
})
const fileFilter = (req, file, cb) => {
    // Check file extension
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});
