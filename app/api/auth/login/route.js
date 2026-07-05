import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email và mật khẩu không được bỏ trống' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tìm user
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('id, email, name, password')
      .eq('email', email)
      .single();

    if (queryError || !user) {
      return new Response(
        JSON.stringify({ error: 'Email không tồn tại' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Kiểm tra password (simple comparison - nên dùng bcrypt trong production)
    if (user.password !== password) {
      return new Response(
        JSON.stringify({ error: 'Mật khẩu không chính xác' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return user info (không return password)
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Lỗi đăng nhập' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
