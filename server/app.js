const express = require('express');
const mongoose = require("mongoose")
require('dotenv').config();
const cors = require("cors")

const MONG0_URL = process.env.MONGODB_ATLAS_URL

mongoose.connect(MONG0_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
   .then(() => console.log("Database connected successfully!"));

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors())
app.use(express.json());

app.listen(PORT, () => {
   console.log('Server started on port', PORT);
});
