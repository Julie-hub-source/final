import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { email, cartItems, address, phone, totalPrice } = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!email || !address || !phone || !totalPrice) {
      return new Response(
        JSON.stringify({ error: 'Dữ liệu không hợp lệ' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Lấy user ID từ email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Người dùng không tồn tại' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tạo order trong Supabase (assume thanh toán thành công)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_email: email,
          total_price: totalPrice,
          address: address,
          phone: phone,
          status: 'pending', // Chờ lấy hàng
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      throw new Error('Không thể tạo đơn hàng');
    }

    // Tạo order items
    if (cartItems && cartItems.length > 0) {
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
      }
    }

    // Assume payment success - direct redirect to success page
    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Lỗi thanh toán' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
