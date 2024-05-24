const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el paquete cors

const app = express();
const port = 3001;

app.use(cors()); // Habilita CORS para todas las rutas

app.get('/api/shopping', async (req, res) => {
  try {
    const query = req.query.q;
    const apiKey = '630601098a35b70b6ac6dc9b802d0ed7394bd7a534da0a397ab17ea5acfa5245';
    const response = await axios.get(`https://serpapi.com/search.json`, {
      params: {
        engine: 'google_shopping',
        q: query,
        api_key: apiKey,
        google_domain: 'google.es',
        gl: 'es',
        hl: 'es',
        location:'Spain',
        num: '1'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
