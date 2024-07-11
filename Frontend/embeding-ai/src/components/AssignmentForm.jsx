// import React, { useState } from 'react';
// import axios from 'axios';

// function AssignmentChecker() {
//   const [assignmentText, setAssignmentText] = useState('');
//   const [feedback, setFeedback] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/api/check-assignment', { assignmentText });
//       setFeedback(response.data.feedback);
//     } catch (error) {
//       console.error('Error checking the assignment', error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={assignmentText}
//           onChange={(e) => setAssignmentText(e.target.value)}
//           rows="10"
//           cols="50"
//           placeholder="Paste assignment text here"
//         />
//         <button type="submit">Check Assignment</button>
//       </form>
//       {feedback && (
//         <div>
//           <h2>Feedback:</h2>
//           <p>{feedback}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AssignmentChecker;
import React, { useState } from 'react';
import axios from 'axios';

const AssignmentForm = () => {
  const [studentName, setStudentName] = useState('');
  const [question, setQuestion] = useState('');
  const [submissionType, setSubmissionType] = useState('text');
  const [answerText, setAnswerText] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('studentName', studentName);
    formData.append('question', question);
    formData.append('submissionType', submissionType);

    if (submissionType === 'text') {
      formData.append('answerText', answerText);
    } else if (submissionType === 'file') {
      formData.append('file', file);
    } else if (submissionType === 'link') {
      formData.append('link', link);
    }

    try {
      const res = await axios.post('http://localhost:3000/api/assignments/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResponse(res.data);
    } catch (error) {
      console.error('Error submitting the assignment:', error);
    }
  };

  return (
    <div>
      <h2>Submit Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Name:</label>
          <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
        </div>
        <div>
          <label>Question:</label>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </div>
        <div>
          <label>Submission Type:</label>
          <select value={submissionType} onChange={(e) => setSubmissionType(e.target.value)} required>
            <option value="text">Text</option>
            <option value="file">File</option>
            <option value="link">Link</option>
          </select>
        </div>
        {submissionType === 'text' && (
          <div>
            <label>Answer:</label>
            <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} required></textarea>
          </div>
        )}
        {submissionType === 'file' && (
          <div>
            <label>File:</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
        )}
        {submissionType === 'link' && (
          <div>
            <label>Link:</label>
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <h3>Response:</h3>
          <p>Grade: {response.grade}</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentForm;
