import React, { useEffect, useState } from 'react';
import './App.css';
const apiKey = process.env.REACT_APP_API_KEY;



function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=denver&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array ensures this runs only once after initial render

  return (
    <div className="App">
      <h1>Hello World!</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;

