// Vercel Serverless Function for metrics

import {neon} from'@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    // Today's prospects
    const [{ count: todayProspects }] = await sql`
      SELECT COUNT(*) as count FROM prospects 
      WHERE created_at::date = ${today}
    `;
    
    // Week metrics
    const weekMetrics = await sql`
      SELECT 
        SUM(meetings_booked) as meetings,
        SUM(new_clients) as clients,
        SUM(ad_spend) as spend
      FROM daily_metrics 
      WHERE date >= ${weekStart.toISOString().split('T')[0]}
    `;
    
    const metrics = {
      todayProspects: parseInt(todayProspects) || 0,
      weekMeetings: parseInt(weekMetrics[0]?.meetings) || 0,
      weekClients: parseInt(weekMetrics[0]?.clients) || 0,
      weekSpend: parseFloat(weekMetrics[0]?.spend) || 0,
      cac: 0
    };
    
    if (metrics.weekClients > 0) {
      metrics.cac = Math.round(metrics.weekSpend / metrics.weekClients);
    }
    
    return res.status(200).json({ metrics });
    
  } catch (error) {
    console.error('Metrics error:', error);
    return res.status(500).json({ error: error.message });
  }
}
