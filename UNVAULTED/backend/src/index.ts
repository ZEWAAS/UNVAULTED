import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import likesRoutes from './routes/likes';
import searchRoutes from './routes/search';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/likes', likesRoutes);

app.use('/api/search', searchRoutes)


app.get('/', (req, res) => {
  res.send('UNVAULTED Backend is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
