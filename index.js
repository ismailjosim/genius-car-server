require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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



const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized Access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'Forbidden Access' })
        }
        req.decoded = decoded;
        next();
    })
}



const run = async () => {
    try {
        const Services = client.db('geniusCar').collection('services');
        const Orders = client.db('geniusCar').collection('orders');


        // jwt validation
        app.post('/jwt', (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })


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
        app.get('/orders', verifyJWT, async (req, res) => {

            const decoded = req.decoded;
            // console.log('inside orders api', decoded);

            if (decoded.email !== req.query.email) {
                req.status(403).send({ message: "Unauthorized Access" })
            }
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
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


        // Update data
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                // Here $set we set and item
                $set: {
                    status: status
                }
            }
            const result = await Orders.updateOne(query, updatedDoc);
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
