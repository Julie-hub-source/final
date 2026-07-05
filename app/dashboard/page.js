'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra user từ localStorage
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
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
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
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Ốp Lưng Store</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chào mừng bạn! 👋
          </h2>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard Card */}
          <Link href="/dashboard">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition duration-200 cursor-pointer">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dashboard
              </h3>
              <p className="text-gray-600">
                Xem thông tin tổng quan về tài khoản
              </p>
            </div>
          </Link>

          {/* Products Card */}
          <Link href="/products">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition duration-200 cursor-pointer">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sản Phẩm
              </h3>
              <p className="text-gray-600">
                Xem danh sách ốp lưng điện thoại
              </p>
            </div>
          </Link>

          {/* Orders Card */}
          <Link href="/orders">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition duration-200 cursor-pointer">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Đơn Hàng
              </h3>
              <p className="text-gray-600">
                Quản lý đơn hàng của bạn
              </p>
            </div>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            ℹ️ Thông tin
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>✓ Quản lý các sản phẩm ốp lưng điện thoại</li>
            <li>✓ Giỏ hàng và thanh toán với Stripe</li>
            <li>✓ Theo dõi các đơn hàng của bạn</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
