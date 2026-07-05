import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, mật khẩu và tên không được bỏ trống' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Kiểm tra email đã tồn tại
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email đã được sử dụng' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert user mới
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, password, name }])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Register error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Lỗi đăng ký' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
