const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//this is midleware
app.use(cors());
app.use(express.json());

// chondo-admin
// xG7EGniNCRpoQAoV

// this code came from database
const uri =
  "mongodb+srv://chondo-admin:xG7EGniNCRpoQAoV@cluster0.nyv6uci.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    console.log("Database connected");

    const userCollection = client.db("chondo").collection("users");
    const blogcollection = client.db("chondo").collection("blogs");

    //get all user
    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });
    // this is for user collection
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);

      res.send(result);
    });

    // this is make admin
    app.put("/user/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // limit dashboard access
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";
      res.send({ admin: isAdmin });
    });

    // get all blogs from database
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogcollection.find(query);
      const result = await cursor.toArray();
      const reverseBlog = result.reverse();
      res.send(reverseBlog);
    });

    //find one using id from database
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await blogcollection.findOne(query);
      res.send(blog);
    });

    // add new furniture
    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;
      const result = await blogcollection.insertOne(newBlog);
      res.send(result);
    });

    //this is for delete tool
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await blogcollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
// basic setup code
app.get("/", (req, res) => {
  res.send("Hello from Chondo blogs!");
});

app.listen(port, () => {
  console.log(`Chondo blogs listening on port ${port}`);
});
