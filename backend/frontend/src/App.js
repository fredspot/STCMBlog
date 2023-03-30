import React, { useState, useEffect } from 'react';
import Article from './Article';

const App = () => {
  const [latestIds, setLatestIds] = useState([]);

  useEffect(() => {
    const fetchLatestIds = async () => {
      const response = await fetch('http://localhost:8080/api/articles/latest?count=10');
      const data = await response.json();
      setLatestIds(data);
    };
    fetchLatestIds();
  }, []);

  return (
    <div>
      <div className="main-content">
        {latestIds.map(id => (
          <Article key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default App;