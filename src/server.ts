// 1. Load env variables immediately
import dotenv from 'dotenv';
dotenv.config();

// 2. Import app (which will cascade-import Prisma safely!)
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Job Tracker API running on http://localhost:${PORT}`);
});
