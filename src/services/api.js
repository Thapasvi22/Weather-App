// src/services/api.js
const OWM_API_KEY = "8d37cb848cfd73d99489bd079ec9a171";
const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";

const WAPI_KEY = "1865e4bddbfb46709e754627252505";
const WAPI_BASE_URL = "https://api.weatherapi.com/v1";

export async function fetchCurrentWeather(city) {
  const res = await fetch(
    `${OWM_BASE_URL}/weather?q=${city}&appid=${OWM_API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch current weather");
  return res.json();
}

export async function fetchHistoricalWeather(city, date) {
  const res = await fetch(
    `${WAPI_BASE_URL}/history.json?key=${WAPI_KEY}&q=${city}&dt=${date}`
  );
  if (!res.ok) throw new Error("Failed to fetch historical weather");
  return res.json();
}
