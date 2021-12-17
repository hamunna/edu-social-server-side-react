const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
	res.send('EduSocial Server is running...');
});

app.listen(port, () => {
	console.log('Server is running on: ', port)
});