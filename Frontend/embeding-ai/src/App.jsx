import React from 'react';
import AssignmentForm from './components/AssignmentForm';
import AssignmentList from './components/AssignmentList';

function App() {
  return (
    <div className="App">
      <h1>Assignment Portal</h1>
      <AssignmentForm />
      <AssignmentList />
    </div>
  );
}

export default App;
