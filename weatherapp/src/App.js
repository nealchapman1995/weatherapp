import React, { useEffect, useState } from 'react';
import './App.css';
const apiKey = process.env.REACT_APP_API_KEY;

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("Fetching data..."); // Debug log
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=denver&appid=${apiKey}&units=imperial`)
      .then(response => response.json())
      .then(data => {
        console.log("Data fetched:", data); // Debug log
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array ensures this runs only once after initial render

  if (!data) {
    return <p>Loading...</p>;
  }

  const city = data.city.name;

  const groupedData = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { count:0, totalPop: 0, temp_min: item.main.temp_min, temp_max: item.main.temp_max, icon: item.weather[0].icon};
    }
    acc[date].count += 1;
    acc[date].totalPop += item.pop;
    if (acc[date].temp_min > item.main.temp_min){
      acc[date].temp_min = item.main.temp_min
    }
    if (acc[date].temp_max < item.main.temp_max){
      acc[date].temp_max = item.main.temp_max
    }
    return acc
  }, {})

 const dates = Object.keys(groupedData).map(date => {
  const averagePop = (groupedData[date].totalPop / groupedData[date].count) * 100;
  return { date, averagePop: averagePop.toFixed(1), temp_min: groupedData[date].temp_min, temp_max: groupedData[date].temp_max, icon:groupedData[date].icon};
 })

  

  return (
    <div className="App">
      <h1>{city}</h1>
      {dates.map((item, index) => (
        <div key={index}>
        <h5>{item.date}</h5>
        <p>Rain Probability: {item.averagePop}%</p>
        <p>highest temp! {item.temp_max} Degrees F</p>
        <p>Lowest temp! {item.temp_min} Degrees F</p>
        </div>
      ))}
      <pre>{JSON.stringify(data.list, null, 2)}</pre>
    </div>
  );
}

export default App;


