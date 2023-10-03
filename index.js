const express = require("express");
const app = express();
const mongoose = require('mongoose');
const patients = require("./routes/patientRoutes");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const mongoConn = process.env.MONGO_CONN;


// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/", patients);

mongoose.connect(mongoConn, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });




app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
