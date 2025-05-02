// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const cityInput = document.getElementById("city-input");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");

  // Function to fetch latitude and longitude using a geocoding API
  async function fetchCoordinates(city) {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude } = data.results[0];
        return { latitude, longitude };
      } else {
        throw new Error("City not found");
      }
    } catch (error) {
      alert(error.message);
      return null;
    }
  }

  // Function to fetch weather data using Open-Meteo API
  async function fetchWeather(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      if (!response.ok) {
        throw new Error("Weather data not found");
      }

      const data = await response.json();
      return data.current_weather;
    } catch (error) {
      alert(error.message);
      return null;
    }
  }

  // Function to update the weather information on the page
  function updateWeather(city, weather) {
    cityName.textContent = city;
    temperature.textContent = `Temperature: ${weather.temperature}°C`;
    description.textContent = `Condition: ${weather.weathercode === 0 ? "Clear" : "Cloudy/Rainy"}`;
  }

  // Event listener for the search button
  searchButton.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (city) {
      const coordinates = await fetchCoordinates(city);
      if (coordinates) {
        const weather = await fetchWeather(coordinates.latitude, coordinates.longitude);
        if (weather) {
          updateWeather(city, weather);
        }
      }
    } else {
      alert("Please enter a city name");
    }
  });
});
