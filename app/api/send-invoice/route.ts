import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { order, customer } = await req.json();

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #1A1A1A; }
        .header { text-align: center; border-bottom: 2px solid #8B1A1A; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; color: #8B1A1A; letter-spacing: 0.2em; }
        .tagline { font-size: 12px; color: #6B6B6B; margin-top: 4px; }
        .order-num { background: #FFF5F5; border: 1px solid #8B1A1A; padding: 12px 20px; text-align: center; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #3D0000; color: white; padding: 10px; text-align: left; font-size: 12px; }
        td { padding: 10px; border-bottom: 1px solid #E8E4DD; font-size: 13px; }
        .total-row { font-weight: bold; font-size: 15px; }
        .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #6B6B6B; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">RAMPYARI INC</div>
        <div class="tagline">Shaan. Shringar. Shauq.</div>
      </div>

      <div class="order-num">
        <strong>ORDER INVOICE</strong><br/>
        <span style="font-size:20px; color:#8B1A1A">#${order.order_number}</span>
      </div>

      <table>
        <tr><td><strong>Customer</strong></td><td>${customer.name}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${customer.phone}</td></tr>
        <tr><td><strong>Email</strong></td><td>${customer.email || 'N/A'}</td></tr>
        <tr><td><strong>Address</strong></td><td>${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}</td></tr>
        <tr><td><strong>Date</strong></td><td>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
        <tr><td><strong>Payment ID</strong></td><td>${order.payment_id}</td></tr>
      </table>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>₹${item.price.toLocaleString()}</td>
              <td>₹${(item.price * item.qty).toLocaleString()}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="3" style="text-align:right; color:#6B6B6B">Subtotal</td>
            <td>₹${order.subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right; color:#6B6B6B">Shipping</td>
            <td>${order.shipping === 0 ? 'FREE' : '₹' + order.shipping}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align:right">TOTAL</td>
            <td style="color:#8B1A1A">₹${order.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>Thank you for shopping with Rampyari Inc!</p>
        <p>For any queries: hello@rampyari.in</p>
        <p style="margin-top:16px; color:#8B1A1A">Shaan. Shringar. Shauq.</p>
      </div>
    </body>
    </html>
  `;

  return NextResponse.json({ html: invoiceHTML });
}