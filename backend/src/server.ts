import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {prisma} from './lib/prisma';


const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({origin: process.env.CLIENT_ORIGIN}));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected'});
  } catch (error) {
    console.error('Health check failed', error);
    res.status(503).json({ status: 'error', database:'disconnected'})
  }

})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
})