// src/App.js
import React, { useState, useEffect } from 'react';
import { fetchCurrentWeather, fetchHistoricalWeather } from './services/api';
import WeatherChart from './elements/WeatherChart';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [unit, setUnit] = useState('metric');

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const current = await fetchCurrentWeather(city);
      setWeather(current);
      fetchHistorical(city);
    } catch (err) {
      alert('Error fetching weather. Check the city name.');
      console.error(err);
    }
  };

  const fetchHistorical = async (city) => {
    const daysToFetch = 5;
    const today = new Date();
    const promises = [];

    for (let i = 1; i <= daysToFetch; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formatted = date.toISOString().split('T')[0]; // yyyy-mm-dd
      promises.push(fetchHistoricalWeather(city, formatted));
    }

    try {
      const results = await Promise.all(promises);
      const formattedData = results.map((res) => ({
        dt: new Date(res.forecast.forecastday[0].date).getTime() / 1000,
        temp: res.forecast.forecastday[0].day.avgtemp_c,
      }));
      setHistoricalData(formattedData.reverse());
    } catch (err) {
      console.error('Error fetching historical data', err);
    }
  };

  const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toUTCString().split(' ')[4];
  };

  useEffect(() => {
    if (city) fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return (
    <div className="app-container">
      <h1>Weather App ⛅</h1>
      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={fetchWeather}>Search</button>
        <button onClick={toggleUnit}>
          {unit === 'metric' ? '°F' : '°C'}
        </button>
      </div>

      {weather && (
        <div className="weather-box">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="icon"
          />
          <p>{weather.weather[0].description}</p>
          <p>
            🌡 Temperature: {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}
          </p>
          <p>
            💨 Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}
          </p>
          <p>
            🌅 Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}
          </p>
          <p>
            🌇 Sunset: {formatTime(weather.sys.sunset, weather.timezone)}
          </p>
        </div>
      )}

      {historicalData.length > 0 && (
        <WeatherChart data={historicalData} unit={unit} />
      )}
    </div>
  );
}

export default App;
