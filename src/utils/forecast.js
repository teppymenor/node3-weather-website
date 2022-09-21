const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    // "http://api.weatherstack.com/current?access_key=4a9c095fce08e084031631bb13e3e76a&query=37.8267,-122.4233&units=f";
    // "http://api.weatherstack.com/current?access_key=4a9c095fce08e084031631bb13e3e76a&query=44.1545,-75.7088&units=f";
    "http://api.weatherstack.com/current?access_key=4a9c095fce08e084031631bb13e3e76a&query=" +
    longitude +
    "," +
    latitude +
    "&units=f";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". It is currently " +
          body.current.temperature +
          " degrees out. It feels like " +
          body.current.feelslike +
          " degrees out."
      );
    }
  });
};

module.exports = forecast;
