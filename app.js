const path = require("path");

const express = require("express");

const blogRoutes = require("./routes/blog");

const db = require("./data/database");

const app = express();

// Activate EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static("public")); // Serve static files (e.g. CSS files)

app.use(blogRoutes);

app.use(function (req, res) {
  res.status(404).render("404");
});

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.error(error);
  res.status(500).render("500");
});

db.connectToDatabase()
  .then(function () {
    const port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log(`Server is listening on port ${port}.`);
    });
  })
  .catch(function (error) {
    console.error("Failed to connect to the database.", error);
    process.exit(1);
  });
