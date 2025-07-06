import express from 'express';
import dotenv from 'dotenv';
import fetchImages from './utils/fetchImages';

// Load env vars only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/images', async (req: any, res: any) => {
  const site = req.query.site as string;
  if (!site) {
    return res.status(400).json({ error: 'Missing site parameter' });
  }

  try {
    const images = await fetchImages(site);
    return res.json({ site, images });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 