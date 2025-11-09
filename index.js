const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 3000;

// middle were
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Assignment server is running");
});


const uri = `mongodb+srv://${process.env.ASSIGNMENT_USER}:${process.env.ASSIGNMENT_PASS}@cluster0.v3p8d1j.mongodb.net/?appName=Cluster0`;

// assignment10_DB
// QQUhER80ArUMX372

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running success on port: ${port}`);
});
