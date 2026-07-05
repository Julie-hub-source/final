'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Helper function: Lấy màu status
const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
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

// Status transitions
const getNextStatuses = (currentStatus) => {
  const transitions = {
    pending: ['processing', 'cancelled'],
    processing: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };
  return transitions[currentStatus] || [];
};

export default function AdminOrdersPage() {
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

  // Cập nhật status order
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Quản Lý Đơn Hàng</h1>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Quay lại Dashboard
            </Link>
          </div>
          <p className="text-gray-600">
            Tổng số đơn hàng: <span className="font-bold text-blue-600">{orders.length}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chưa có đơn hàng nào
            </h2>
            <p className="text-gray-600">Tất cả đơn hàng sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Sản Phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Địa Chỉ
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Điện Thoại
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      Tổng Tiền
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        #{order.id.toString().slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <span className="truncate">{order.address}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.phone}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600 text-right">
                        ₫ {parseInt(order.total).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getNextStatuses(order.status).length > 0 && (
                          <div className="flex gap-2 justify-center">
                            {getNextStatuses(order.status).map((nextStatus) => (
                              <button
                                key={nextStatus}
                                onClick={() => updateOrderStatus(order.id, nextStatus)}
                                className={`px-3 py-1 rounded text-xs font-bold transition duration-200 ${
                                  nextStatus === 'processing'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : nextStatus === 'completed'
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                              >
                                {nextStatus === 'processing'
                                  ? '→ Xử Lý'
                                  : nextStatus === 'completed'
                                  ? '✓ Hoàn'
                                  : '✕ Hủy'}
                              </button>
                            ))}
                          </div>
                        )}
                        {getNextStatuses(order.status).length === 0 && (
                          <span className="text-gray-500 text-xs">Không hành động</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            ℹ️ Hướng Dẫn
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Chờ xác nhận:</strong> Đơn hàng vừa được đặt</li>
            <li>• <strong>Đang xử lý:</strong> Đơn hàng được xác nhận, chuẩn bị giao</li>
            <li>• <strong>Hoàn thành:</strong> Đơn hàng đã giao cho khách</li>
            <li>• <strong>Đã hủy:</strong> Đơn hàng bị hủy bỏ</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
