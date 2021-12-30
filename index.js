const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xribv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		const database = client.db('eduSocialDB');
		const usersCollection = database.collection('users');
		const statusesCollection = database.collection('statuses');


		//==========================================================================
		// GET API
		//==========================================================================

		// GET Users
		app.get('/users', async (req, res) => {
			const cursor = usersCollection.find({});
			const users = await cursor.toArray();
			res.json(users);
			// console.log(users)
		});

		// GET Statuses
		app.get('/statuses', async (req, res) => {
			const cursor = statusesCollection.find({});
			const statuses = await cursor.toArray();
			res.json(statuses);
			// console.log(statuses)
		});

		//==========================================================================
		// POST API
		//==========================================================================

		// POST Users Data
		app.post('/users', async (req, res) => {
			const newUser = req.body;
			const result = await usersCollection.insertOne(newUser);
			res.json(result);
		});

		// POST Status Data
		app.post('/statuses', async (req, res) => {
			const newStatus = req.body;
			const result = await statusesCollection.insertOne(newStatus);
			res.json(result);
		})

		//==========================================================================
		// PUT API
		//==========================================================================

		// PUT API Status Comments
		app.put('/statuses/comment', async (req, res) => {
			// const statusComment = req.body;
			const statusUpdate = req.body;

			const id = statusUpdate._id;

			const statusCollections = statusUpdate.statusCollections;

			const filter = { _id: ObjectId(id) };

			// console.log('put: ', statusUpdate);
			// console.log('Filter: ', filter);

			// const options = { upsert: true };

			const updateDoc = { $set: { statusCollections } };


			console.log('updateDoc: ', updateDoc);

			const result = await statusesCollection.updateOne(filter, updateDoc);
			res.json(result);
		});

		// PUT API Love Reacts Calculate
		app.put('/statuses/love', async (req, res) => {
			// const statusComment = req.body;
			const status = req.body;

			const id = status._id;

			const statusCollections = status.statusCollections;

			const filter = { _id: ObjectId(id) };

			// console.log('put: ', status);
			// console.log('Filter: ', filter);

			const options = { upsert: true };

			const updateDoc = { $set: { statusCollections } };


			// console.log('updateDoc: ', updateDoc);

			const result = await statusesCollection.updateOne(filter, updateDoc, options);
			res.json(result);
		});

		// PUT API Pending Friend Request in frReqTo
		app.put('/users/frReqTo', async (req, res) => {
			const requestReceiver = req.body;

			const id = requestReceiver._id;

			const activityData = requestReceiver?.activityData;

			const filter = { _id: ObjectId(id) };

			const options = { upsert: true };

			// console.log('put: ', activityData);
			// console.log('Filter: ', filter);

			const updateDoc = { $set: { activityData } };

			// console.log('updateDoc: ', updateDoc);

			const result = await usersCollection.updateOne(filter, updateDoc, options);
			res.json(result);
		});

		// PUT API Sent Friend Request in frReqTo
		app.put('/users/frReqFrom', async (req, res) => {
			const currentUser = req.body;
			console.log(currentUser);

			const id = currentUser._id;

			const activityData = currentUser?.activityData;

			const filter = { _id: ObjectId(id) };

			const options = { upsert: true };

			const updateDoc = { $set: { activityData } };

			console.log('updateDoc: ', updateDoc);

			const result = await usersCollection.updateOne(filter, updateDoc, options);
			res.json(result);
		});

	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('EduSocial Server is running...');
});

app.listen(port, () => {
	console.log('Server is running on port: ', port)
});