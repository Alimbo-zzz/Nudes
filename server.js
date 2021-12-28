const express = require('express');
const path = require('path');
const morgan = require('morgan');
const createPath = require('./src/helpers/createPath.js');
const API = require('./src/API/API.js');
const router = require('./src/API/routes.js');

require('dotenv').config(); // безопасность


const app = express();
const PORT = 3030;


// __________

app.listen(PORT, (err)=>{ //sever
	err ? console.log(err) : console.log(`PORT: ${PORT}`);
})

app.use('/', express.static('Front-end')); // путь для всех элементов
app.use(morgan(':method :url :status :res[content-length] :response-time ms')); // выведение в консоль всех запросов
app.use(express.json());  // позволяет получать json-files
app.use(express.urlencoded({extended: false})); // middle var - позволяет принимать body в запросах
// app.use(API); // API
app.use(router); // roter
