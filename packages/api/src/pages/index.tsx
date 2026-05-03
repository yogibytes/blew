import React from 'react'

export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>🌬️ Blew - Solana Payment Widget</h1>
      <p>API is running. Status: <strong>OK</strong></p>
      <p>API Endpoints:</p>
      <ul>
        <li><code>GET /api/health</code> - Health check</li>
        <li><code>POST /api/merchants/register</code> - Register merchant (coming soon)</li>
        <li><code>POST /api/payments</code> - Create payment (coming soon)</li>
      </ul>
    </div>
  )
}
