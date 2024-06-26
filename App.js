const { default: axios } = require('axios')
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoute');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
  
    next();
  });

app.use(express.json());

app.get('/',(req,res,next) => {
    res.json({message: 'Hi this is products API, you might want to go to /api to receive data!'});
})

app.use('/api',productRoutes);

app.use('/*', (req,res,next)=> {
    res.json({error: "404 Not found! Sure you got the right address?"})
})

app.listen(3000, () => {
    console.log("Server started at 3000 port")
    mongoose.connect(`${process.env.MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
})
