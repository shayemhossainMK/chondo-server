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

    const blogcollection = client.db("chondo").collection("blogs");

    // get all blogs from database
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogcollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
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
