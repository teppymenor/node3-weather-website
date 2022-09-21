const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// console.log(__dirname);
// console.log(path.join(__dirname, "../public"));

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views"); //rename views to templates
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlerbars engine and views location
app.set("view engine", "hbs"); // set up handlebars
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath)); //find match

//handle the render value
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Andrew Mead",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Andrew Mead",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Andrew Mead",
  });
});

// req = request, res = response
// app.com route
app.get("", (req, res) => {
  //   res.send("Hello express!");
  res.send("<h1>Weather</h1>"); //serving up html
});

// app.com/help route
// app.get("/help", (req, res) => {
//   //   res.send("Help page");
//   //   res.send({
//   //     name: "Andrew",
//   //     age: 27,
//   //   });  // serving up JSON
//   res.send([
//     {
//       name: "Andrew",
//     },
//     {
//       name: "Sarah",
//     },
//   ]); // serving up JSON
// });

// // app.com/about route
// app.get("/about", (req, res) => {
//   //   res.send("About");
//   res.send("<h1>About</h1>"); // serving up html
// });

// app.com/weather route
app.get("/weather", (req, res) => {
  //   res.send("Your weather");
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );

  // res.send({
  //   forecast: "It is snowing",
  //   location: "Philadelphia",
  //   address: req.query.address,
  // }); // serving up JSON
});

// express route handler
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

// app.com/help route
app.get("/help/*", (req, res) => {
  // res.send("Help article not found");
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Help article not found.",
  });
});

// * = match everything that didn't have match
app.get("*", (req, res) => {
  // res.send("My 404 page");
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Page not found",
  });
});

// server app
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
