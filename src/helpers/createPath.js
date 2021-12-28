const path = require('path');

const createPath = (page)=> path.resolve(__dirname, '../../Front-end', `${page}.html`)

module.exports = createPath;
