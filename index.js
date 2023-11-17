const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5555;

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