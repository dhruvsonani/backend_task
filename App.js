const { default: axios } = require('axios')
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoute');

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
    mongoose.connect('mongodb+srv://dhruvsonani:5dYA6Xfubw1kqiTo@cluster0.qhxovmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
})