const express = require('express');
const path = require('path');
const mongoose = require("mongoose")
require('dotenv').config();
const cors = require("cors")

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors())
app.use(express.json());


app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});
