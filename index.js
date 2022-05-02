const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

//
app.use(cors());
app.use(express.json());

//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i3j1g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  //
  try {
    await client.connect();
    const database = client.db("assigenment_12");
    const productsCollection = database.collection("products");
    const orderCollection = database.collection("order");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    // get api all
    app.get("/products", async (req, res) => {
      const query = req.query.home;
      const cursor = productsCollection.find({});

      let result;
      if (query === "home") {
        result = await cursor.limit(6).toArray();
      } else {
        result = await cursor.toArray();
      }

      res.json(result);
    });

    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    //   get all reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get api by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      let isAdmin = false;

      if (result?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // get api by email
    app.get("/orders/email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    //   post api

    app.post("/products", async (req, res) => {
      const doc = req.body;
      const result = await productsCollection.insertOne(doc);
      res.json(result);
    });

    app.post("/orders", async (req, res) => {
      let doc = req.body;
      const result = await orderCollection.insertOne(doc);
      res.json(result);
    });
    //   reviews post api
    app.post("/reviews", async (req, res) => {
      let doc = req.body;
      const result = await reviewsCollection.insertOne(doc);
      res.json(result);
    });
    //   user post api
    app.post("/users", async (req, res) => {
      let doc = req.body;
      const result = await usersCollection.insertOne(doc);
      res.json(result);
    });
    //   update role or making admin

    app.put("/users", async (req, res) => {
      const user = req.body.user;
      const filter = { email: user };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    app.put("/orders", async (req, res) => {
      const id = req.body.productId;
      const filter = { product_Id: id };
      const updateDoc = { $set: { order: "shipped" } };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // delete api
    app.delete("/orders", async (req, res) => {
      const id = req.body.id;
      const query = { product_Id: id };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    app.delete("/products", async (req, res) => {
      const id = req.body.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("assigenment 12");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
