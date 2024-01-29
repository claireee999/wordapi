const express = require('express');

const app = express();

// Update the following with your MongoDB Atlas connection details

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const db = client.db(dbName);
const wordsCollection = db.collection(collectionName);

async function run(res) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    const count = await wordsCollection.countDocuments();

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);

    // Find a document at the random index
    const randomWordDocument = await wordsCollection.findOne({}, { skip: randomIndex });

    // Send the word as JSON response
    res.json({ word: randomWordDocument.word });

    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


  // Endpoint to get a random word
  app.get('/random-word', async (req, res) => {
    try {
        run(res).catch(console.dir);
    } catch (error) {
      console.error('Error fetching random word from MongoDB Atlas:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Start the server
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
