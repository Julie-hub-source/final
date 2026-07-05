'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [productName, setProductName] = useState('Ốp lưng iPhone 15 Pro');
  const [amount, setAmount] = useState(150000);

  const router = useRouter();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);

      // Load amount từ localStorage nếu có
      const savedAmount = localStorage.getItem('lastOrderAmount');
      if (savedAmount) {
        setAmount(parseInt(savedAmount));
      }
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Kiểm tra dữ liệu
    if (!address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      setSubmitting(false);
      return;
    }

    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      setSubmitting(false);
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Số điện thoại không hợp lệ (10-11 chữ số)');
      setSubmitting(false);
      return;
    }

    try {
      // Prepare cart items
      const cartItems = [
        {
          id: 1,
          name: productName,
          price: amount,
          quantity: 1,
        },
      ];

      // Gọi API checkout (Supabase)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          cartItems,
          address,
          phone,
          totalPrice: amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể tạo checkout session');
      }

      const { sessionId, orderId } = await response.json();

      // Lưu order ID để sử dụng khi quay lại success page
      localStorage.setItem('currentOrderId', orderId.toString());

      // Redirect tới Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            ← Quay lại
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Thanh Toán
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Sản Phẩm
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VND)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  disabled={submitting}
                />
                <span className="ml-3 text-gray-600 font-semibold">
                  ₫ {amount.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa Chỉ *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa chỉ giao hàng"
                rows="3"
                disabled={submitting}
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số Điện Thoại *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0123456789"
                disabled={submitting}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Tóm Tắt Đơn Hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Sản phẩm:</span>
                  <span className="font-semibold text-gray-900">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Giá:</span>
                  <span className="font-semibold text-blue-600">
                    ₫ {amount.toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₫ {amount.toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg"
            >
              {submitting ? '⏳ Đang xử lý...' : '🛒 Thanh Toán'}
            </button>

            <p className="text-center text-gray-600 text-sm">
              💳 Thanh toán được bảo mật bằng Stripe
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
