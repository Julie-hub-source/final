'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductsPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

  if (!user) {
    return null;
  }

  const products = [
    {
      id: 1,
      name: 'Ốp lưng iPhone 15 Pro',
      price: 150000,
      image: '📱',
      description: 'Ốp lưng chất lượng cao cho iPhone 15 Pro',
    },
    {
      id: 2,
      name: 'Ốp lưng Samsung Galaxy S24',
      price: 120000,
      image: '📱',
      description: 'Ốp lưng bảo vệ toàn diện',
    },
    {
      id: 3,
      name: 'Ốp lưng Xiaomi 14',
      price: 100000,
      image: '📱',
      description: 'Ốp lưng siêu bền',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Sản Phẩm</h1>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Quay lại
            </Link>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
            >
              <div className="text-6xl text-center py-8 bg-gray-100">
                {product.image}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </span>
                  <button
                    onClick={() => {
                      localStorage.setItem('lastOrderAmount', product.price.toString());
                      window.location.href = '/checkout';
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                  >
                    Mua
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
