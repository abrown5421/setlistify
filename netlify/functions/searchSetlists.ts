import { Handler } from '@netlify/functions';
import axios from 'axios';

const handler: Handler = async (event) => {
  const { artist, venue, tour, year } = event.queryStringParameters || {};

  if (!artist && !venue && !tour && !year) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'At least one search parameter is required.' }),
    };
  }

  const apiKey = process.env.SETLIST_API_KEY; 
  const headers = {
    Accept: 'application/json',
    'x-api-key': apiKey || '',
  };

  const params = new URLSearchParams();
  if (artist) params.append('artistName', artist);
  if (venue) params.append('venueName', venue);
  if (tour) params.append('tourName', tour);
  if (year) params.append('year', year);

  try {
    const res = await axios.get(`https://api.setlist.fm/rest/1.0/search/setlists?${params.toString()}`, {
      headers,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.data),
    };
  } catch (err: any) {
    return {
      statusCode: err.response?.status || 500,
      body: JSON.stringify({ error: err.response?.data || 'Unknown error' }),
    };
  }
};

export { handler };
