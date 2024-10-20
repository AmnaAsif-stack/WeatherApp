document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'a7f8aaf169ed6a5961a1ab8d07eed042'; 
  const geminiApiKey = 'AIzaSyAlK_NYmhoj2LQ17jHHSLfElOffYDC-wNI'; 
  const MODEL_NAME = 'gemini-1.5-flash'; 
  let forecastData = [];
  let tempUnit = 'metric';
  let selectedCity = 'London'; 

  const itemsPerPage = 10;

  const paginationContainer = document.querySelector('.pagination');
  const filterRainyBtn = document.getElementById('filter-rainy');
  const filterHighestBtn = document.getElementById('filter-highest');
  const filterDescendingBtn = document.getElementById('filter-descending');
  const filterAscendingBtn = document.getElementById('filter-ascending');

  document.getElementById('get-weather').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
      selectedCity = city; 
      fetchWeatherData(city);
    } else {
      alert('Please enter a city name.');
    }
  });
  document.getElementById('get-location-weather').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude); 
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  async function fetchWeatherDataByCoords(latitude, longitude) {
    showSpinner(true); 
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${tempUnit}&appid=${apiKey}`);
      const data = await response.json();

      if (data.cod !== '200') {
        throw new Error('Error fetching weather for your location.');
      }

      forecastData = data.list;
      updateWeatherWidget(data.city, forecastData[0]);

      renderCharts();
      render5DayForecast();
      updateForecastTable();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(error.message);
    } finally {
      showSpinner(false); 
    }
  }
  
  function showSpinner(visible) {
    document.getElementById('spinner').classList.toggle('hidden', !visible);
  }
  async function fetchWeatherDataByCoords(latitude, longitude) {
    showSpinner(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${tempUnit}&appid=${apiKey}`);
      const data = await response.json();

      if (data.cod !== '200') {
        throw new Error('Error fetching weather for your location.');
      }

      forecastData = data.list;
      updateWeatherWidget(data.city, forecastData[0]);
      renderCharts();
      render5DayForecast();
      updateForecastTable();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(error.message);
    } finally {
      showSpinner(false);
    }
  }

  async function fetchWeatherData(city) {
    showSpinner(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${tempUnit}&appid=${apiKey}`);
      const data = await response.json();

      if (data.cod !== '200') {
        throw new Error('City not found');
      }

      forecastData = data.list;
      updateWeatherWidget(data.city, forecastData[0]);
      renderCharts();
      render5DayForecast();
      updateForecastTable();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(error.message);
    } finally {
      showSpinner(false);
    }
  }

  async function fetchGeminiResponse(userInput) {
    const requestBody = {
      contents: [
        {
          parts: [{ text: userInput }],
        },
      ],
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch Gemini response');
      }

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I'm having trouble understanding that. Could you try asking again?";
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, I'm having trouble answering that right now.";
    }
  }

  document.getElementById('send-query').addEventListener('click', async () => {
    const userQuery = document.getElementById('user-query').value.trim();
    const chatbox = document.getElementById('chatbox');

    if (!userQuery) {
      chatbox.innerHTML += `<p>Bot: Please enter a query.</p>`;
      return;
    }

    chatbox.innerHTML += `<p>User: ${userQuery}</p>`;

    if (isWeatherQuery(userQuery)) {
      const cityToFetch = extractCityFromQuery(userQuery);
      chatbox.innerHTML += `<p>Bot: Fetching weather data for ${cityToFetch}...</p>`;
      showSpinner(true);

      try {
        await fetchWeatherData(cityToFetch);
        const weatherDescription = document.getElementById('description').textContent;
        const temperature = document.getElementById('temperature').textContent;
        chatbox.innerHTML += `<p>Bot: The weather in ${cityToFetch} is ${weatherDescription}, ${temperature}.</p>`;
      } catch (error) {
        chatbox.innerHTML += `<p>Bot: ${error.message}. Please reenter the city name.</p>`;
      } finally {
        showSpinner(false);
      }
    } else {
      chatbox.innerHTML += `<p>Bot: Fetching response from Gemini API...</p>`;
      showSpinner(true);

      try {
        const geminiResponse = await fetchGeminiResponse(userQuery);
        chatbox.innerHTML += `<p>Bot: ${geminiResponse}</p>`;
      } catch (error) {
        chatbox.innerHTML += `<p>Bot: ${error}</p>`;
      } finally {
        showSpinner(false);
      }
    }
  });

  function showSpinner(visible) {
    document.getElementById('spinner').classList.toggle('hidden', !visible);
  }

  function isWeatherQuery(query) {
    return query.toLowerCase().includes('weather');
  }

  function extractCityFromQuery(query) {
    const regex = /in\s+(\w+)/;
    const match = query.match(regex);
    return match ? match[1] : selectedCity;
  }

  function updateWeatherWidget(city, forecast) {
    document.getElementById('city-name').textContent = city.name;
    document.getElementById('description').textContent = forecast.weather[0].description;
    document.getElementById('temperature').textContent = `${forecast.main.temp} °${tempUnit === 'metric' ? 'C' : 'F'}`;
    document.getElementById('humidity').textContent = forecast.main.humidity;
    document.getElementById('wind-speed').textContent = forecast.wind.speed;

    const iconCode = forecast.weather[0].icon;
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    updateBackground(forecast.weather[0].main.toLowerCase());
  }

  function updateBackground(condition) {
    const weatherSection = document.getElementById('weather-section');
    weatherSection.className = 'weather-data';
    switch (condition) {
      case 'clear':
        weatherSection.classList.add('clear');
        break;
      case 'clouds':
        weatherSection.classList.add('cloudy');
        break;
      case 'rain':
        weatherSection.classList.add('rainy');
        break;
      case 'snow':
        weatherSection.classList.add('snowy');
        break;
      case 'thunderstorm':
        weatherSection.classList.add('thunderstorm');
        break;
      case 'drizzle':
        weatherSection.classList.add('drizzle');
        break;
      default:
        weatherSection.classList.add('clear');
    }
  }


  let currentPage = 0;

  function updateForecastTable() {
    const tbody = document.querySelector('#forecast-table tbody');
    tbody.innerHTML = ''; 

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const slicedData = forecastData.slice(start, end);

    slicedData.forEach(forecast => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border p-2">${new Date(forecast.dt * 1000).toLocaleDateString()}</td>
        <td class="border p-2">${forecast.main.temp} °${tempUnit === 'metric' ? 'C' : 'F'}</td>
        <td class="border p-2">${forecast.weather[0].description}</td>
        <td class="border p-2">${forecast.main.humidity}%</td>
      `;
      tbody.appendChild(row);
    });
  }

  document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      updateForecastTable();
    }
  });

  document.getElementById('next').addEventListener('click', () => {
    if ((currentPage + 1) * itemsPerPage < forecastData.length) {
      currentPage++;
      updateForecastTable();
    }
  });

  function render5DayForecast() {
    const forecastGrid = document.getElementById('forecast-grid');
    forecastGrid.innerHTML = ''; 

    const dailyForecast = [];
    for (let i = 0; i < forecastData.length; i += 8) {
      const day = forecastData[i];
      dailyForecast.push({
        date: new Date(day.dt * 1000).toLocaleDateString(),
        temp: day.main.temp,
        description: day.weather[0].description,
        icon: day.weather[0].icon,
      });
    }

    dailyForecast.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'forecast-day bg-white p-4 rounded-lg shadow-lg';
      dayElement.innerHTML = `
        <h3 class="text-lg font-semibold">${day.date}</h3>
        <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}" class="w-12 h-12 mx-auto">
        <p class="text-center">${day.temp} °${tempUnit === 'metric' ? 'C' : 'F'}</p>
        <p class="text-center">${day.description}</p>
      `;
      forecastGrid.appendChild(dayElement);
    });
  }

  let barChart, doughnutChart, lineChart; 

  function renderCharts() {
    if (!forecastData.length) {
      return; 
    }

    const temps = forecastData.map(forecast => forecast.main.temp);
    const dates = forecastData.map(forecast => new Date(forecast.dt * 1000).toLocaleTimeString());

    if (barChart) barChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();

    barChart = new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Temperature',
          data: temps,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      },
    });

    const weatherTypes = forecastData.reduce((acc, forecast) => {
      const main = forecast.weather[0].main;
      acc[main] = (acc[main] || 0) + 1;
      return acc;
    }, {});

    doughnutChart = new Chart(document.getElementById('doughnutChart'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(weatherTypes),
        datasets: [{
          data: Object.values(weatherTypes),
          backgroundColor: ['#87CEEB', '#B0C4DE', '#4F4F4F', '#E0FFFF', '#A9A9A9'],
        }],
      },
    });

    lineChart = new Chart(document.getElementById('lineChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Temperature',
          data: temps,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        }],
      },
    });
  }

  document.querySelectorAll('.page-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      const page = event.target.getAttribute('data-page');

      if (page === 'dashboard') {
        document.getElementById('charts-section').style.display = 'block';
        document.getElementById('tables-section').style.display = 'none';
      } else if (page === 'tables') {
        document.getElementById('charts-section').style.display = 'none';
        document.getElementById('tables-section').style.display = 'block';
      }
    });
  });

  window.addEventListener('resize', () => {
    if (barChart) barChart.update();
    if (doughnutChart) doughnutChart.update();
    if (lineChart) lineChart.update();
  });
 function renderPaginatedTable(data, page = 0) {
  const tbody = document.querySelector('#forecast-table tbody');
  tbody.innerHTML = '';

  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);

  paginatedData.forEach(forecast => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="border p-2">${new Date(forecast.dt * 1000).toLocaleDateString()}</td>
          <td class="border p-2">${forecast.main.temp} °${tempUnit === 'metric' ? 'C' : 'F'}</td>
          <td class="border p-2">${forecast.weather[0].description}</td>
          <td class="border p-2">${forecast.main.humidity}%</td>
      `;
      tbody.appendChild(row);
  });
}

function renderPaginationControls(data) {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(data.length / itemsPerPage);

  for (let i = 0; i < totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i + 1;
      button.className = `mx-1 px-4 py-2 rounded-lg ${
          i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-300'
      }`;

      button.addEventListener('click', () => {
          currentPage = i;
          renderPaginatedTable(data, currentPage);
      });

      paginationContainer.appendChild(button);
  }
}

function applyFilter(filterFn) {
  const filteredData = filterFn(forecastData);
  currentPage = 0;
  renderPaginatedTable(filteredData, currentPage);
  renderPaginationControls(filteredData);
}

filterRainyBtn.addEventListener('click', () => {
  applyFilter(data =>
      data.filter(forecast =>
          forecast.weather.some(condition => condition.main.toLowerCase().includes('rain'))
      )
  );
});

filterHighestBtn.addEventListener('click', () => {
  applyFilter(data => [
      data.reduce((max, forecast) =>
          forecast.main.temp > max.main.temp ? forecast : max, data[0]
      )
  ]);
});

filterDescendingBtn.addEventListener('click', () => {
  applyFilter(data => [...data].sort((a, b) => b.main.temp - a.main.temp));
});

filterAscendingBtn.addEventListener('click', () => {
  applyFilter(data => [...data].sort((a, b) => a.main.temp - b.main.temp));
});


document.getElementById('toggle-unit').addEventListener('click', () => {
  tempUnit = tempUnit === 'metric' ? 'imperial' : 'metric';
  document.getElementById('toggle-unit').textContent = tempUnit === 'metric' ? 'Switch to °F' : 'Switch to °C';
  
  const city = document.getElementById('city-name').textContent || 'London'; 
  fetchWeatherData(city); 
});


  
});
