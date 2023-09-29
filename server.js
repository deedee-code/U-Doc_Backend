const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const medicalProfessionalRoute = require('./routes/medicalProfessionalRoute');
const dbConnect = require('./config/database');

dbConnect();
const app = express();

const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/", medicalProfessionalRoute);




app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});