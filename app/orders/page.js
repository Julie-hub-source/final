'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Helper function: Lấy màu status
const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600',
    processing: 'bg-blue-100 text-blue-800 border-l-4 border-blue-600',
    completed: 'bg-green-100 text-green-800 border-l-4 border-green-600',
    cancelled: 'bg-red-100 text-red-800 border-l-4 border-red-600',
  };
  return colors[status] || colors.pending;
};

// Helper function: Lấy label status
const getStatusLabel = (status) => {
  const labels = {
    pending: '⏳ Chờ xác nhận',
    processing: '🔄 Đang xử lý',
    completed: '✓ Hoàn thành',
    cancelled: '✕ Đã hủy',
  };
  return labels[status] || 'Chờ xác nhận';
};

export default function OrdersPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kiểm tra user và lấy orders từ localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);

      // Lấy danh sách orders
      const ordersStr = localStorage.getItem('orders');
      if (ordersStr) {
        const parsedOrders = JSON.parse(ordersStr);
        setOrders(parsedOrders);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">📦 Đơn Hàng Của Tôi</h1>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Quay lại Dashboard
            </Link>
          </div>
          <p className="text-gray-600">
            Tổng số đơn hàng: <span className="font-bold text-blue-600">{orders.length}</span>
          </p>
        </div>
      </header>

      {/* Orders List */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bạn chưa có đơn hàng nào
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy khám phá các sản phẩm ốp lưng điện thoại tuyệt vời của chúng tôi!
            </p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 inline-block"
            >
              🛍️ Xem Sản Phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
                <p className="text-gray-600 text-sm">Chờ xác nhận</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm">Đang xử lý</p>
                <p className="text-3xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                <p className="text-gray-600 text-sm">Hoàn thành</p>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
                <p className="text-gray-600 text-sm">Đã hủy</p>
                <p className="text-3xl font-bold text-red-600">
                  {orders.filter(o => o.status === 'cancelled').length}
                </p>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 ${getStatusColor(
                    order.status
                  )}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          ID Đơn Hàng
                        </p>
                        <p className="font-bold text-lg text-gray-900">
                          #{order.id.toString().slice(0, 8)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Sản Phẩm
                        </p>
                        <p className="font-semibold text-gray-900">
                          {order.product}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Ngày Đặt
                        </p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.date).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Tổng Tiền
                        </p>
                        <p className="font-bold text-2xl text-blue-600">
                          ₫ {parseInt(order.total).toLocaleString('vi-VN')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Trạng Thái
                        </p>
                        <span className="inline-block px-4 py-2 bg-white bg-opacity-70 rounded-full font-semibold">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="mt-6 pt-6 border-t border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">📍 Địa chỉ giao hàng:</p>
                      <p className="font-semibold text-gray-900">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">📞 Số điện thoại:</p>
                      <p className="font-semibold text-gray-900">{order.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
