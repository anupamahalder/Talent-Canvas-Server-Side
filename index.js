const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5050;

//parsers to parser data
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
}))

app.get('/',(req, res)=>{
    res.send('Talent canvas server is running...');
})
app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5hsri61.mongodb.net/?retryWrites=true&w=majority`;

// Mongodb connect
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db('talentDatabase').collection('userDB');
    const jobCollection = client.db('talentDatabase').collection('jobDB');
    const appliedJobCollection = client.db('talentDatabase').collection('appliedJobDB');

    //display all jobs 
    app.get('/alljobs', async(req, res)=>{
        const cursor = jobCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    //post a job 
    app.post('/alljobs', async(req, res)=>{
      const data = req.body;
      const result = await jobCollection.insertOne(data);
      res.send(result);
    })
    // get my jobs where passing email as parameter 
    app.get('/myjobs', async(req, res)=>{
      console.log(req.query.userEmail);
      let query = {};
      if(req.query?.userEmail){
        query = {userEmail: req.query.userEmail};
        const result = await jobCollection.find(query).toArray();
        res.send(result);
      }
      else{
        res.send({message:"Unauthorized!"});
      }
    })
    // get single job 
    app.get('/job-detail/:id',async(req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await jobCollection.findOne(query);
      res.send(result);
    })
    // get jobs by category name 
    app.get('/jobs', async(req, res)=>{
      console.log(req.query.category_key);
      let query={};
      if(req.query?.category_key){
        query = {category_key: req.query.category_key};
        const result = await jobCollection.find(query).toArray();
        res.send(result);
      }
      else
        res.send({message:"Unauthorized!"});
    })
    // get jobs by category name hybrid and id 
    app.get('/jobs/:id1/:id2',async(req, res)=>{
      const id1 = req.params.id1;
      const id2 = req.params.id2;
      console.log(id1, id2);
      res.send('Hello');
    })
    // post user data from client side 
    app.post('/users-data', async(req, res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    })
    // display user data based on email
    app.get('/users', async(req, res)=>{
        // console.log(req.query.email);
        let query = {};
        if(req.query?.email){
          query = {email: req.query.email};
          const result = await userCollection.find(query).toArray();
          res.send(result);
        }
        else{
          res.status(401).send({message: "Unauthorized access"});
        }
    })
    // applied job data post 
    app.post('/appliedjob', async(req, res)=>{
      const job = req.body;
      const result = await appliedJobCollection.insertOne(job);
      res.send(result);
    })

    // get all applied jobs 
    app.get('/appliedjob', async(req, res)=>{
      const result = await appliedJobCollection.find().toArray();
      res.send(result);
    })
    // get all appliedjob data by passing email and job id 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);
