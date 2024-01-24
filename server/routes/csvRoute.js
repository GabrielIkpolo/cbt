import express, {Router} from 'express';
import csvUploadController from "../controller/csvUploadController.js";
import multer from 'multer' ;

// initialise the router 
const router = express.Router();


// Configuring multer for storage of file in the app "disk storage"
// const storage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         cb(null, 'fileStorage/'); // this specifies the upload directory
//     },
//     filename: (req, file, cb)=>{
//         // cb(null, file.fieldname + '-' + Date.now());
//         cb(null, file.fieldname + '.csv') // this somehow used a directory out of the routes directory
//     }
// });

// Use in-memory storage
const storage = multer.memoryStorage();


const upload = multer({storage: storage});


// router.post('/upload', upload.single('questionsFile'), async (req, res)=>{
//     const filePath = req.file.path;
//     const questionsFromFile = await csvUploadController.parseCSV(filePath);
//     await csvUploadController.createQuestionFromCSV(req, res);
// });

router.post('/upload', upload.single('questionsFile'), async (req, res) => {
    try {
      // Access file properties directly from req.file
      const originalFileName = req.file.originalname; // Get the original file name
      const questionsBuffer = req.file.buffer;
  
      console.log('Parsed questions (before create):', await csvUploadController.parseCSV(questionsBuffer));
      console.log('Original file name:', originalFileName); // Log the file name for reference
  
      await csvUploadController.createQuestionFromCSV(req, res);
    } catch (err) {
      console.error('Error in route:', err);
      res.status(500).json({ err: 'Failed to upload CSV' });
    }
  });


export default router;