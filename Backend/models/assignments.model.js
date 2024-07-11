const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  studentName: String,
  question: String,
  submissionType: { type: String, enum: ['text', 'file', 'link'], required: true },
  answerText: String,
  filePath: String,
  link: String,
  grade: String
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
