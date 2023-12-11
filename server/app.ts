import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import like Router
import likeRouter from './routes/like.router';

dotenv.config();

const username = process.env.MONGODB_USERNAME;
const encodedPassword = encodeURIComponent(process.env.MONGODB_PASS!);
const connectionString = `mongodb+srv://${username}:${encodedPassword}@cluster0.10vnscl.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
   .then(() => console.log("Database connected successfully!"))
   .catch(err => console.error("Could not connect to database", err));

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

// Use like Router to handle requests to "/likes" route
app.use("/likes", likeRouter);

app.listen(PORT, () => {
   console.log('Server started on port', PORT);
});
