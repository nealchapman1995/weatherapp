import React from 'react';

const DetailedView = ({data, onClose}) => {
    if (!data || !data.details) {
        return <div>Loading...</div>; // or handle the loading state as per your UI requirements
      }
    return (
        <div className='detailedView'>
            <button onClick={onClose}> X </button>
            <h2>{data.date}</h2>
            {data.details.map((item, index) => (
                <div key={index}>
                    <p>{new Date(item.dt * 1000).toLocaleTimeString()}</p>
                    <p>Will Feel Like: {item.main.feels_like}°F</p>
                    <p>Probability of Percipitation: {item.pop * 100}%</p>
                    <p>Weather: {item.weather[0].description}</p>
                    <p><img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="weather icon" /></p>
                </div>
            ))}
        </div>
    );
};

export default DetailedView;