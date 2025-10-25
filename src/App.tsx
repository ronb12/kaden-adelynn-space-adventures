import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('App mounted');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Kaden & Adelynn Space Adventures</h1>
        <p>Epic 2D Space Shooter</p>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </header>
    </div>
  );
};

export default App;