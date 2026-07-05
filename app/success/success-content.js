'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function SuccessContent() {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initPage = async () => {
      // Kiểm tra user
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      try {
        const userData = JSON.parse(userStr);
        setUser(userData);

        // Lấy order ID từ URL hoặc localStorage
        let orderId = searchParams.get('order_id');
        if (!orderId) {
          orderId = localStorage.getItem('currentOrderId');
        }

        if (orderId) {
          // Lấy order từ Supabase
          const { data: orderData, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', parseInt(orderId))
            .single();

          if (orderData) {
            setOrder(orderData);
          } else if (error) {
            console.error('Error fetching order:', error);
          }

          localStorage.removeItem('currentOrderId');
        }
      } catch (err) {
        console.error('Error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Đang xử lý...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 rounded-full p-6 mb-6">
            <svg
              className="w-16 h-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-green-600 mb-3">
            ✅ Thanh Toán Thành Công!
          </h1>

          <p className="text-gray-600 text-lg">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              📋 Chi Tiết Đơn Hàng
            </h2>

            <div className="space-y-4">
              {/* Order ID */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="text-lg font-semibold text-gray-900">
                  #{order.id}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {order.user_email}
                </p>
              </div>

              {/* Total Price */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng Tiền</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₫ {parseInt(order.total_price).toLocaleString('vi-VN')}
                </p>
              </div>

              {/* Address */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Địa Chỉ</p>
                <p className="text-lg font-semibold text-gray-900">
                  {order.address}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Số Điện Thoại</p>
                <p className="text-lg font-semibold text-gray-900">
                  {order.phone}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Trạng Thái</p>
                <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                  ⏳ {order.status === 'pending' ? 'Chờ xác nhận' : order.status}
                </span>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày Đặt</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            ℹ️ Thông Tin Quan Trọng
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>📧 Kiểm tra email để nhận xác nhận đơn hàng</li>
            <li>📦 Sản phẩm sẽ được giao trong 3-5 ngày làm việc</li>
            <li>📞 Liên hệ với chúng tôi nếu có bất kỳ câu hỏi nào</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            🏠 Quay về Dashboard
          </Link>

          <Link
            href="/orders"
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            📦 Xem Đơn Hàng
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Cảm ơn bạn đã sử dụng Ốp Lưng Store! 🎉
        </p>
      </div>
    </div>
  );
}
