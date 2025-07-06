import axios from 'axios';

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.SEARCH_ENGINE_ID;

function buildQueryVariants(site: string): string[] {
  return [
    `site:${site}`,
    `site:https://www.${site}`
  ];
}

function isValidImage(item: any, site: string): boolean {
  const displayLink = item.displayLink || '';
  return displayLink.includes(site);
}

export default async function fetchImages(site: string): Promise<any[]> {
  if (!API_KEY || !CX) {
    throw new Error('Missing GOOGLE_API_KEY or SEARCH_ENGINE_ID in environment');
  }

  const queries = buildQueryVariants(site);

  for (const query of queries) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&num=10&key=${API_KEY}&cx=${CX}`;

    try {
      const res = await axios.get(url);
      const items = res.data.items || [];

      const validImages = items.filter((item: any) => isValidImage(item, site));
      if (validImages.length >= 2) {
        return validImages.slice(0, 2);
      }
    } catch (err: any) {
      console.error(`Error querying \"${query}\":`, err.message);
    }
  }

  return [];
}
