// Usamos el fetch nativo de Node.js 18+ disponible en Vercel
export default async function handler(req, res) {
  // Configurar cabeceras de CORS para permitir las peticiones del frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { resource_id, limit, offset, q } = req.query;
    
    // Construir la URL real hacia el INE
    const targetUrl = new URL('https://datos.ine.gob.gt/es/api/3/action/datastore_search');
    targetUrl.searchParams.append('resource_id', resource_id);
    targetUrl.searchParams.append('limit', limit);
    targetUrl.searchParams.append('offset', offset);
    if (q) targetUrl.searchParams.append('q', q);

    console.log(`Proxying request to: ${targetUrl.toString()}`);

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      // Vercel Serverless tiene sus propios límites, pero aquí le damos margen al INE
      timeout: 9000 
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `INE API responded with ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Error interno en el proxy', 
      details: error.message 
    });
  }
}
