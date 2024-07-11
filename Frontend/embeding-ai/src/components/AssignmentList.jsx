import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/assignments');
        setAssignments(res.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id}>
            <strong>{assignment.studentName}</strong>: {assignment.question} - {assignment.grade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
