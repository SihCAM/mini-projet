$(document).ready(function ($) {
const API_KEY = '011f35a3896b2ee1e0d4b4c075b3615b';

    function getCoordinates(city) {
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: geocodeUrl,
          method: 'GET',
          success: (response) => {
            if (response.length > 0) {
              const { lat, lon } = response[0];
              resolve({ lat, lon });
            } else {
              reject('Ville non trouvée');
            }
          },
          error: () => reject('Erreur de géolocalisation')
        });
      });
    }

    function getWeatherData(lat, lon) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: weatherUrl,
          method: 'GET',
          success: (data) => resolve(data),
          error: () => reject('Erreur lors de la récupération des données météo')
        });
      });
    }

    function setBackgroundColor(description) {
      const container = $('#weather-container');
      if (description.includes("orage")) {
          container.css('background-color', '#FFAB91'); // Orageux (Pale Coral)
      } else if (description.includes("pluie") || description.includes("shower")) {
          container.css('background-color', '#B2EBF2'); // Pluvieux (Pale Light Blue)
      } else if (description.includes("dégagé")) {
          container.css('background-color', '#B3E5FC'); // Ciel clair (Pale Sky Blue)
      } else if (description.includes("couvert") || description.includes("nuageux")) {
          container.css('background-color', '#CFD8DC'); // Nuageux or Couvert (Pale Grey)
      } else if (description.includes("neige")) {
          container.css('background-color', '#F0F4C3'); // Neigeux (Pale Light Yellow)
      } else {
          container.css('background-color', '#FFFFFF'); // Couleur par défaut (Default Color)
      }
    }
  
  
  

    $('#weather-form').on('submit', function (event) {
      event.preventDefault();
      const city = $('#city').val().trim();
      $('#weather-container').hide();
      $('#error-message').text('');

      if (!city) {
        $('#error-message').text("Veuillez entrer le nom d'une ville.");
        return;
      }

      getCoordinates(city)
        .then(({ lat, lon }) => getWeatherData(lat, lon))
        .then((data) => {
          $('#city-name').text(data.name);
          $('#temperature').text(Math.round(data.main.temp) + "°C");
          $('#feels-like').text(Math.round(data.main.feels_like));
          $('#humidity').text(data.main.humidity);
          $('#description').text(data.weather[0].description);
          $('#weather-icon').attr(
            'src',
            `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          );

          // Convertir les données supplémentaires
          $('#wind-speed').text(data.wind.speed);
          $('#wind-speed-kmh').text(Math.round(data.wind.speed * 3.6));
          $('#wind-deg').text(data.wind.deg);
          $('#sunrise').text(new Date(data.sys.sunrise * 1000).toLocaleTimeString("fr-FR"));
          $('#sunset').text(new Date(data.sys.sunset * 1000).toLocaleTimeString("fr-FR"));

          setBackgroundColor(data.weather[0].description);

          $('#weather-container').show();
        })
        .catch((error) => {
          $('#error-message').text(error);
        });
    });

    $('#toggle-extra-info').on('click', function () {
      $('#extra-info').toggle();
      const buttonText = $('#extra-info').is(':visible') ? 'Voir moins' : 'Voir plus';
      $(this).text(buttonText);
    });


});