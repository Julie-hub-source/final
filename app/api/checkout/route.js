import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20',
});

export async function POST(request) {
  try {
    const { amount, email, productName, address, phone } = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!amount || !email || !productName) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tạo Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: productName,
              description: `Địa chỉ: ${address}\nSố điện thoại: ${phone}`,
            },
            unit_amount: Math.round(amount), // Stripe yêu cầu số nguyên (đơn vị: cent)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        email,
        productName,
        address,
        phone,
      },
    });

    return new Response(
      JSON.stringify({
        sessionId: session.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Stripe error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
