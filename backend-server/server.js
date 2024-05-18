const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el paquete cors

const app = express();
const port = 3001;

app.use(cors()); // Habilita CORS para todas las rutas

app.get('/api/shopping', async (req, res) => {
  try {
    const query = req.query.q;
    const apiKey = '40ca2c911b2bf7d276df3e8b3bd7bdd92df25a349d5d91d3ff9e319e249ee91f';
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
