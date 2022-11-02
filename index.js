require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



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

const run = async () => {
    try {
        const Services = client.db('geniusCar').collection('services');
        const Orders = client.db('geniusCar').collection('orders');

        // CRUD ====> Read Data (R)
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = Services.find(query);
            const servicesData = await cursor.toArray();
            res.send(servicesData);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const serviceData = await Services.findOne(query);
            res.send(serviceData)

        })

        // CRUD ====> Create data (C) use "POST"
        // ORDERS API
        app.post('/orders', async (req, res) => {
            const orderData = req.body;
            const result = await Orders.insertOne(orderData);
            res.send(result)
        })

        // read orders
        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            // http://localhost:5000/orders?email=ismailjosim@gmail.com (query search)

            const cursor = Orders.find(query);
            const ordersData = await cursor.toArray();
            res.send(ordersData);
        })

        // Delete Orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await Orders.deleteOne(query);
            res.send(result);
        })



    } finally {

    }


}
run();


app.get('/', (req, res) => {
    res.send("Genius Car Server is working!")
})

app.listen(port, () => {
    console.log(`Genius Car server is working on Port ${ port }`.yellow.italic);
})
