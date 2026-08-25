
import React from 'react'
import BlewWidget from './BlewWidget'

/**
 * Example usage of the Blew Payment Widget
 * 
 * The widget can be embedded on any merchant website to accept payments
 */

export default function WidgetDemo() {
  const handlePaymentSuccess = (data: {
    paymentId: string
    signature?: string
    amount: number
    token: string
  }) => {
    console.log('✅ Payment successful:', data)
    // Handle success - could redirect to order confirmation page
    alert(`Payment of ${data.amount} ${data.token} confirmed!\nPayment ID: ${data.paymentId}`)
  }
console.log()
  const handlePaymentError = (error: Error) => {
    console.error('❌ Payment failed:', error)
    // Handle error - show to user or retry logic
    alert(`Payment failed: ${error.message}`)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🌬️ Blew Payment Widget Demo</h1>
      <p>
        This demo shows how to embed the Blew payment widget on your website.
      </p>

      <div style={{ marginTop: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h2>Checkout</h2>
        <BlewWidget
          merchantId="merchant_123"
          amount={1.5}
          token="SOL"
          apiKey="blew_883145bd9bb9a6ff41426a46a0f40ae4441afdcb2b00de3d924d905ec6d1af86"
          apiBase="http://localhost:3000/"
          darkMode={true}
          metadata={{
            orderId: 'order_456',
            productName: 'Example Product',
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Integration Steps:</h3>
        <ol>
          <li>Install the widget: <code>npm install @blew/widget</code></li>
          <li>Import: <code>import BlewWidget from '@blew/widget'</code></li>
          <li>Add to your page with props (see above)</li>
          <li>Handle success/error callbacks</li>
        </ol>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Props:</h3>
        <ul>
          <li><strong>merchantId</strong> - Your merchant ID from Blew registration</li>
          <li><strong>amount</strong> - Payment amount (e.g., 0.5 SOL)</li>
          <li><strong>token</strong> - Token type: "SOL" or "USDC"</li>
          <li><strong>apiKey</strong> - Your API key (optional, can be in localStorage)</li>
          <li><strong>apiBase</strong> - API base URL (default: http://localhost:3000)</li>
          <li><strong>darkMode</strong> - Enable dark theme (boolean)</li>
          <li><strong>metadata</strong> - Custom data to attach to payment</li>
          <li><strong>onSuccess</strong> - Callback when payment succeeds</li>
          <li><strong>onError</strong> - Callback when payment fails</li>
        </ul>
      </div>
    </div>
  )
}
