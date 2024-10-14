const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jobUserRoutes = require('./routes/jobUserRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/user', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=> console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api/v1/jobuserRoutes',jobUserRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});