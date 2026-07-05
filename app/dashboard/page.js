'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  // Kiểm tra user và lấy orders
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);

      // Lấy danh sách orders từ localStorage
      const ordersStr = localStorage.getItem('orders');
      if (ordersStr) {
        const parsedOrders = JSON.parse(ordersStr);
        setOrders(parsedOrders);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Tính toán thống kê đơn hàng
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpent = orders.reduce((sum, o) => sum + (parseInt(o.total) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  // Không render gì nếu chưa load xong
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">🏪 Ốp Lưng Store</h1>
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

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Tổng Đơn Hàng</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{totalOrders}</p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Chờ Xác Nhận</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingOrders}</p>
              </div>
              <span className="text-4xl">⏳</span>
            </div>
          </div>

          {/* Processing Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Đang Xử Lý</p>
                <p className="text-3xl font-bold text-blue-500 mt-2">{processingOrders}</p>
              </div>
              <span className="text-4xl">🔄</span>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Hoàn Thành</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{completedOrders}</p>
              </div>
              <span className="text-4xl">✓</span>
            </div>
          </div>
        </div>

        {/* Total Spent */}
        {totalSpent > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-lg font-semibold mb-2">💳 Tổng Chi Tiêu</h3>
            <p className="text-4xl font-bold">
              ₫ {totalSpent.toLocaleString('vi-VN')}
            </p>
          </div>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                Đơn Hàng Của Tôi
              </h3>
              <p className="text-gray-600">
                Xem chi tiết và theo dõi đơn hàng
              </p>
            </div>
          </Link>

          {/* Admin Card (Optional) */}
          <Link href="/admin/orders">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition duration-200 cursor-pointer">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Admin
              </h3>
              <p className="text-gray-600">
                Quản lý đơn hàng (demo)
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              🕐 Đơn Hàng Gần Đây
            </h3>
            <div className="space-y-3">
              {orders.slice(-3).reverse().map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      #{order.id.toString().slice(0, 8)} - {order.product}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      ₫ {parseInt(order.total).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.status === 'pending'
                        ? '⏳ Chờ xác nhận'
                        : order.status === 'processing'
                        ? '🔄 Đang xử lý'
                        : order.status === 'completed'
                        ? '✓ Hoàn thành'
                        : '✕ Đã hủy'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/orders"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-semibold"
            >
              Xem tất cả đơn hàng →
            </Link>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            ℹ️ Thông tin
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>✓ Mua sắm các sản phẩm ốp lưng điện thoại chất lượng cao</li>
            <li>✓ Thanh toán an toàn với Stripe</li>
            <li>✓ Theo dõi trạng thái đơn hàng real-time</li>
            <li>✓ Giao hàng nhanh chóng trong 3-5 ngày</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
