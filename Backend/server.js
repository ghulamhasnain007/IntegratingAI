// const express = require('express');
// // const { openai } = require('openai');
// const {config} = require('./config/server.config');
// const bodyParser = require('body-parser');
// const app = express();

// // Initialize OpenAI instance
// const { OpenAIApi } = require('openai');

// // Middleware for JSON body parsing
// app.use(express.json());

// const port = config.appPort
// const apiKey = config.API_KEY

// // Initialize OpenAI client
// // const configuration = new Configuration({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });
// const openai = new OpenAIApi(apiKey);

// // Endpoint to check assignment
// app.post('/check-assignment', async (req, res) => {
//   const { assignmentText } = req.body;

//   try {
//     const response = await openai.createCompletion({
//       model: 'text-davinci-003',
//       prompt: `Check the following assignment:\n\n${assignmentText}\n\nProvide feedback and a grade:`,
//       max_tokens: 150,
//     });

//     const feedback = response.data.choices[0].text.trim();
//     res.json({ feedback });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// const {config} = require('./config/server.config')
// const {corsConfig} = require('./config/cors.config')
// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: config.API_KEY// This is also the default, can be omitted
// });

// // const configure = new Configuration({
// //   apiKey: config.API_KEY
// // })

// // const openai = new OpenAIApi({
// //   apiKey: config.API_KEY
// // })

// const runPrompt = async()=>{
//   // const prompt = 'Tell me a joke about cat eating pasta';

//   const chatCompletion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{"role": "user", "content": "Hello!"}],
//   });
//   console.log(chatCompletion.choices[0].message);
// }

// runPrompt()


// const express = require('express');
// const axios = require('axios');
// const {config} = require('./config/server.config')


// const app = express();
// const port = config.appPort

// app.use(express.json());

// app.post('/api/check-assignment', async (req, res) => {
//     const { assignment } = req.body;
//     try {
//         const response = await axios.post('https://api.gemini.com/check', {
//             assignment,
//             apiKey: config.appKey
//         });

//         const gradingResult = response.data;
//         res.json(gradingResult);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const {config} = require('./config/server.config')

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(config.appKey);

// async function run() {
//   // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

//   const prompt = "Write a story about a magic backpack."

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = response.text();
//   console.log(text);
// }

// run();

// const express = require('express');
// const bodyParser = require('body-parser');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const {config} = require('./config/server.config')

// const app = express();
// const port = config.appPort;

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Access your API key from the environment variables
// const genAI = new GoogleGenerativeAI(config.appKey);

// async function gradeAssignment(assignmentText) {
//   // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//   const prompt = `Grade the following assignment: "${assignmentText}"`;
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = await response.text();
//   return text;
// }

// app.post('/grade-assignment', async (req, res) => {
//   const assignmentText = req.body.assignmentText;
//   if (!assignmentText) {
//     return res.status(400).send('Assignment text is required.');
//   }
//   try {
//     const grade = await gradeAssignment(assignmentText);
//     res.json({ grade });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while grading the assignment.');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const {config} = require('./config/server.config')
const {corsConfig} = require('./config/cors.config')

const app = express();
const port = config.appPort;
async function connectToDB() {
  try {
      console.log("Establishing DB connection....")
      await mongoose.connect(config.mongoUri)
      console.log("DB connected")
  } catch (error) {
      console.log("Something went wrong", error);
  }
}
app.use(bodyParser.json());
app.use(cors(corsConfig))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


connectToDB()
    .then(res => console.log("Connected"))
    .catch(err => console.log("DB NOT Connected"))


const assignmentRoutes = require('./routes/assignment.routes');
app.use('/api/assignments', assignmentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
