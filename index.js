require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');



const app = express();
const port = process.env.PORT || 5000;


// Optional: Colors for only better console.
const colors = require('colors');

// Middleware
app.use(cors())
app.use(express.json())


// MongoDB database
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASSWORD }@cluster0.s9x13go.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});







app.get('/', (req, res) => {
    res.send("Genius Car Server is working!")
})

app.listen(port, () => {
    console.log(`Genius Car server is working on Port ${ port }`.rainbow.italic);
})
