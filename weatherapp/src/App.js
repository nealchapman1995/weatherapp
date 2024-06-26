import React, { useEffect, useState } from 'react';
import './App.css';
import DetailedView from './detailedView';
const apiKey = process.env.REACT_APP_API_KEY;


function App() {
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Denver');
  const [selectedDay, setSelectedDay] = useState(null); // Track selected day

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  const fetchWeatherData = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
      .then(response => response.json())
      .then(data => {
        console.log("Data fetched:", data); // Debug log
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }; // Empty dependency array ensures this runs only once after initial render

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDay(null);
  };

  const handleDayClick = (dayData) => {
    const filteredData = data.list.filter(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      return date == dayData.date;
    });
    setSelectedDay({...dayData, details: filteredData});
    
  };

  const handleCloseDetailedView = () => {
    setSelectedDay(null);
  };

  if (!data) {
    return <p>Loading...</p>;
  }

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
  }, {});

 const dates = Object.keys(groupedData).map(date => {
  const averagePop = (groupedData[date].totalPop / groupedData[date].count) * 100;
  return { date, averagePop: averagePop.toFixed(1), temp_min: groupedData[date].temp_min.toFixed(0), temp_max: groupedData[date].temp_max.toFixed(0), icon:groupedData[date].icon};
 })

  

  return (
    <div className="App">
      <h1>What's the Forecast Looking Like?</h1>
      <div className='citySelector'>
        <label htmlFor='citySelect'>Pick a City! </label>
        <select id='citySelect' value={selectedCity} onChange={handleCityChange}>
          <option value="Denver">Denver</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
        </select>

      </div>

      <div className='dayContainer'>
      {dates.map((item, index) => (
        <div className='daybox' onClick={() => handleDayClick(item)}>
        <h5>{item.date}</h5>
        <div className='tempContainer'>
        <div >

        <h5 className='tempBox'>highest temp!</h5>
        <p>{item.temp_max}°F</p>
        </div>
        <div >
        <h5 className='tempBox'>Lowest temp!</h5>
        <p>{item.temp_min}°F</p>
        </div>
        </div>
        <p>Rain Probability: {item.averagePop}%</p>

        </div>
      ))}
       <div>
         {selectedDay && <DetailedView data={selectedDay} onClose={handleCloseDetailedView} />}
      </div>
      </div>
    </div>
  );
}

export default App;


