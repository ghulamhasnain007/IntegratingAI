// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const Assignment = require('../models/assignments.model');
// const {config} = require('../config/server.config')

// const genAI = new GoogleGenerativeAI(config.appKey);

// async function gradeAssignment(question, answer) {
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   const prompt = `Grade the following assignment based on the question: "${question}" and answer: "${answer}"`;
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = await response.text();
//   return text;
// }

// router.post('/submit', async (req, res) => {
//   const { studentName, question, answer } = req.body;
//   if (!studentName || !question || !answer) {
//     return res.status(400).send('All fields are required.');
//   }

//   try {
//     const grade = await gradeAssignment(question, answer);
//     const newAssignment = new Assignment({ studentName, question, answer, grade });
//     await newAssignment.save();
//     res.json(newAssignment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while grading the assignment.');
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     const assignments = await Assignment.find();
//     res.json(assignments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while fetching the assignments.');
//   }
// });

// module.exports = router;

const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Assignment = require('../models/assignments.model');
const {config} = require('../config/server.config')

const genAI = new GoogleGenerativeAI(config.appKey);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

async function gradeAssignment(question, answer) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Grade the following assignment in percentage based on the question: "${question}" and answer: "${answer}",
   give response only grade in percenatge, do not comment and give feedback"`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

async function extractTextFromPDF(filePath) {
  const data = await pdfParse(filePath);
  return data.text;
}

async function extractTextFromWord(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function fetchContentFromLink(link) {
  const response = await axios.get(link);
  return response.data; // This might need to be further processed based on the structure of the fetched content
}

router.post('/submit', upload.single('file'), async (req, res) => {
  const { studentName, question, answerText, link, submissionType } = req.body;

  if (!studentName || !question || !submissionType) {
    return res.status(400).send('Student name, question, and submission type are required.');
  }

  try {
    let contentToGrade = '';
    if (submissionType === 'text') {
      contentToGrade = answerText;
    } else if (submissionType === 'file') {
      if (req.file.mimetype === 'application/pdf') {
        contentToGrade = await extractTextFromPDF(req.file.path);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        contentToGrade = await extractTextFromWord(req.file.path);
      } else {
        return res.status(400).send('Unsupported file type.');
      }
    } else if (submissionType === 'link') {
      contentToGrade = await fetchContentFromLink(link);
    }

    const grade = await gradeAssignment(question, contentToGrade);
    const newAssignment = new Assignment({
      studentName,
      question,
      submissionType,
      answerText: submissionType === 'text' ? answerText : null,
      filePath: submissionType === 'file' ? req.file.path : null,
      link: submissionType === 'link' ? link : null,
      grade
    });

    await newAssignment.save();
    res.json(newAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while submitting the assignment.');
  }
});

router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the assignments.');
  }
});

module.exports = router;
