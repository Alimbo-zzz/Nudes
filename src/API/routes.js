const express = require('express');
const router = express.Router();
const app = express();
app.use(express.urlencoded({extended: false})); // middle var - позволяет принимать body в запросах
const createPath = require('../helpers/createPath.js');
// ___________

// _____routes

router.get('/', (req, res)=>{
	res.sendfile(createPath('index'))
})

router.get('/about', (req, res)=>{
	res.sendfile(createPath('about'))
})

router.get('/create', (req, res)=>{
	res.sendfile(createPath('create'))
})

router.get('/deposit', (req, res)=>{
	res.sendfile(createPath('deposit'))
})

router.get('/myPhotos', (req, res)=>{
	res.sendfile(createPath('myPhotos'))
})

router.get('/failed_pay', (req, res)=>{
	res.sendfile(createPath('failedpay'))
})

router.get('/success_pay', (req, res)=>{
	res.sendfile(createPath('successpay'))
})




module.exports = router;
