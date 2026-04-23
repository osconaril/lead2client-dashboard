// Vercel Serverless Function for Neon DB
// This keeps your DB credentials server-side

import {neon} from'@neondatabase/serverless';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    if (req.method === 'GET') {
      const prospects = await sql`
        SELECT * FROM prospects 
        ORDER BY created_at DESC 
        LIMIT 50
      `;
      return res.status(200).json({ prospects });
    }
    
    if (req.method === 'POST') {
      const { name, company, source, status, priority } = req.body;
      const result = await sql`
        INSERT INTO prospects (name, company, source, status, priority, found_by)
        VALUES (${name}, ${company}, ${source}, ${status}, ${priority}, 'va_manual')
        RETURNING *
      `;
      return res.status(201).json({ prospect: result[0] });
    }
    
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}
