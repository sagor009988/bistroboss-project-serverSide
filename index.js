const express = require('express');
const app=express()
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;

// middleWere
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okjp9zn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const usersCollections=client.db("bistoDB").collection("users")
    const menuCollections=client.db("bistoDB").collection("menu")
    const cartCollections=client.db("bistoDB").collection("carts")

    // users get related api
    app.get('/users',async(req,res)=>{
      const result=await usersCollections.find().toArray()
      res.send(result)

    })

    // users insert related api
    app.post('/users',async(req,res)=>{
      const body=req.body;
      // insert user email if dose not exit 
      // check it 
      const query={email:body.email}
      const isexistUser=await usersCollections.findOne(query)
      if(isexistUser){
        return res.send({message:'already user this email',insertedId:null})
      }
      const result=await usersCollections.insertOne(body)
      res.send(result)
    })

    // get the value
    app.get('/menu',async(req,res)=>{
        const result=await menuCollections.find().toArray()
        res.send(result)
    })

    // send data of add to cart from server
    app.get('/cartsInfo',async(req,res)=>{
      const email=req.query.email;
      console.log(email);
      const query={email:email}
      const result=await cartCollections.find(query).toArray()
      res.send(result)
    })

    // inset data to data base from atto to cart
    app.post('/carts',async(req,res)=>{
      const cart=req.body;
      const result=await cartCollections.insertOne(cart)
      res.send(result)
    })
    // delete cart oder
    app.delete('/carts/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id : new ObjectId(id)}
      const result= await cartCollections.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("bisto boss is running")
})
app.listen(port,()=>{
    console.log(`bisto boss is running on ${port}`);
})