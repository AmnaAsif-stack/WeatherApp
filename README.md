Weather and Chatbot Application
This is a weather application, which integrates OpenWeather API for the implementation of weather functionalities and Gemini API for general functionalities. The application displays weather data; it filters for specific conditions of weather and has a chatbot interface answering questions whether the questions are about the weather or not.

Features
Weather Forecast: Get the current weather situation as well as a 5-day forecast for any given city or location you reside in.
The chatbot can answer weather-related questions with the OpenWeather API and non-weather-related questions with the Gemini API.
Interactive UI: The interfaces are modern, user friendly, and are created with background animations and color transitions on the basis of weather changes.
Filters: Filter the weather data either on rainy days or highest temperatures or just sort temperatures in ascending and descending order.
Responsive Design: The app is fully responsive and adjusts with different screen sizes.
Technologies Used
HTML/CSS: This includes app structure, themes with video background, and condition-based themes for the weather.
JavaScript: It is here that API interaction takes place, chatbot behavior, and data filtering.
OpenWeather API: This fetches the weather data of different locations.
Gemini API: This is used for questions other than those having to do with the weather by the chatbot.
Project Files
FrontedLayout.html: This is the main HTML file containing general structure for the chatbot, display for the weather, and also UI elements.
script.js: This is the JavaScript file containing API calls, chatbot logics, and rendering of the weather data.
style.css: The stylesheet styling and customizing the app's look and feel, to include background images, animations and transitions.
Setup Instructions
To get it set up and running locally, I will assume you have these:
A modern web browser (Chrome, Firefox, Safari, etc.)
A text editor or IDE (VSCode, Sublime, etc.)
2. OpenWeather API Key
Sign up at OpenWeather.
Retrieve your API key from your dashboard.
Replace the value placeholder in script.js with your OpenWeather API key:
javascript
Copy code
var apiKey = 'a7f8aaf169ed6a5961a1ab8d07eed042'; // OpenWeather API key
3. Gemini API Key
Find how to get an API key from Gemini.
Replace the placeholder in script.js with your Gemini API key:
javascript
Copy code
var geminiApiKey = 'AIzaSyAlK_NYmhoj2LQ17jHHSLfElOffYDC-wNI'; // Gemini API key
4. Running the App
Download all files from the project: FrontedLayout.html, script.js, style.css
Open the FrontedLayout.html file on your web browser.
5. Using the App
Weather Queries: Write questions like "How is it in London?" or "Is raining at Paris?".
General Queries: Ask questions unrelated to the weather, for example, "What is the capital of France?".
Troubleshooting
Always ensure that your API keys are correctly placed in the script.js
If the weather data or the chatbot responses do not come well, you can inspect for any errors on the browser console.
Always ensure that you have internet connectivity when making your request from the APIs
Future Enhancements
Add more functionalities regarding conversations in the chatbot.
That is to say, make the design even more immersive for the user.
