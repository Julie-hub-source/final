'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Kiểm tra user
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (err) {
      router.push('/login');
      return;
    }

    // Lấy session ID từ URL
    const sid = searchParams.get('session_id');
    if (sid) {
      setSessionId(sid);

      // Lấy thông tin từ localStorage
      const checkoutData = localStorage.getItem('checkoutData');
      let address = '';
      let phone = '';
      let productName = 'Ốp lưng điện thoại';
      let amount = localStorage.getItem('lastOrderAmount') || '0';

      if (checkoutData) {
        try {
          const data = JSON.parse(checkoutData);
          address = data.address || '';
          phone = data.phone || '';
          productName = data.productName || productName;
          amount = data.amount || amount;
        } catch (err) {
          console.error('Error parsing checkout data:', err);
        }
      }

      // Lưu order vào localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: Date.now(), // ID duy nhất dựa trên timestamp
        sessionId: sid,
        email: userData.email,
        product: productName,
        address: address,
        phone: phone,
        total: amount,
        status: 'pending', // Trạng thái ban đầu
        date: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.removeItem('lastOrderAmount');
      localStorage.removeItem('checkoutData');
    }

    setLoading(false);
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📋 Chi Tiết Đơn Hàng
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>

            {/* Session ID */}
            {sessionId && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Session ID</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono text-gray-900 break-all">
                    {sessionId}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sessionId);
                      alert('Đã sao chép!');
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200 whitespace-nowrap text-sm"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng Thái</p>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                ✓ Hoàn Tất
              </span>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày Tạo</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

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
