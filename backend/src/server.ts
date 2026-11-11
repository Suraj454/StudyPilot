import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {prisma} from './lib/prisma';
import authRoutes from './modules/auth/auth.routes'
import goalsRoutes from './modules/goals/goals.routes'
import diagnosticRoutes from './modules/diagnostic/diagnostic.routes'

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

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/diagnostic', diagnosticRoutes);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
})