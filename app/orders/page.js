'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));

    // Lấy đơn hàng từ localStorage
    const ordersStr = localStorage.getItem('orders');
    if (ordersStr) {
      try {
        setOrders(JSON.parse(ordersStr));
      } catch (err) {
        setOrders([]);
      }
    }
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Đơn Hàng</h1>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Quay lại
            </Link>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa mua sản phẩm nào. Hãy khám phá các sản phẩm của chúng tôi!
            </p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 inline-block"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID Đơn Hàng</p>
                    <p className="font-semibold text-gray-900">
                      {order.sessionId?.substring(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sản Phẩm</p>
                    <p className="font-semibold text-gray-900">
                      {order.productName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Giá</p>
                    <p className="font-semibold text-blue-600">
                      {parseInt(order.amount).toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trạng Thái</p>
                    <span
                      className={
                        order.status === 'completed'
                          ? 'inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold'
                          : 'inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold'
                      }
                    >
                      {order.status === 'completed' ? '✓ Hoàn tất' : 'Chờ xử lý'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
