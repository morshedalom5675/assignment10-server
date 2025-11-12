const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  },
});
async function run() {
  try {
    await client.connect();

    const db = client.db("assignment10_DB");
    const issueCollection = db.collection("issue");
    const contributesCollection = db.collection("contributes");

    // all issue get
    // app.get("/issue", async (req, res) => {
    //   const result = await issueCollection.find().sort({ date: -1 }).toArray();
    //   res.send(result);
    // });

    // logged user report issue get
    // app.get("/issue", async (req, res) => {
    //   const email = req.query.email;
    //   const query = { email: email };
    //   const result = await issueCollection.find(query).toArray();
    //   res.send(result);
    // });

    // all issue and logged user issue
    app.get("/issue", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const result = await issueCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(result);
    });

    // latest issue get
    app.get("/latest-issue", async (req, res) => {
      const result = await issueCollection
        .find()
        .limit(6)
        .sort({ date: -1 })
        .toArray();
      res.send(result);
    });

    // single issue get
    app.get("/issue/:id", async (req, res) => {
      const id = req.params.id;
      const objectId = new ObjectId(id);
      const result = await issueCollection.findOne({ _id: objectId });
      res.send(result);
    });

    // single issue post
    app.post("/issue", async (req, res) => {
      const data = req.body;
      const result = await issueCollection.insertOne(data);
      res.send(result);
    });

    // update issue
    app.put("/issue/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(id);
      console.log(data);
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };
      const result = await issueCollection.updateOne(filter, update);
      res.send({
        success: true ,
        result
      });
    });

    // delete issue
    app.delete("/issue/:id", async (req, res) => {
      const id = req.params.id;
      const objectId = new ObjectId(id);
      const result = await issueCollection.deleteOne({ _id: objectId });
      res.send(result);
    });

    // contribute collection api

    // single contribute post
    app.post("/contributes", async (req, res) => {
      const data = req.body;
      const result = await contributesCollection.insertOne(data);
      res.send(result);
    });

    // issue contribution table
    app.get("/issue/contributes/:issueId", async (req, res) => {
      const issueId = req.params.issueId;
      const query = { issue: issueId };
      const cursor = contributesCollection.find(query).sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // logged user issues contribution
    app.get("/contributes", async (req, res) => {
      const email = req.query.email;

      let query = {};
      if (email) {
        query = { contributor_email: email };
      }

      const result = await contributesCollection.find(query).toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running success on port: ${port}`);
});
