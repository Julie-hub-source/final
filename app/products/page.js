'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductsPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      try {
        setUser(JSON.parse(userStr));

        // Fetch products từ Supabase
        const { data: productsData, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else {
          setProducts(productsData || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải sản phẩm...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">🏪 Danh Sách Sản Phẩm</h1>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Quay lại Dashboard
            </Link>
          </div>
          <p className="text-gray-600">
            Tổng sản phẩm: <span className="font-bold text-blue-600">{products.length}</span>
          </p>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Không có sản phẩm nào
            </h2>
            <p className="text-gray-600">
              Vui lòng kiểm tra lại sau
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
              >
                {/* Product Image */}
                <div className="text-6xl text-center py-8 bg-gray-100">
                  📱
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  {/* Phone Model */}
                  <p className="text-sm text-gray-600 mb-2">
                    {product.phone_model}
                  </p>

                  {/* Stock Info */}
                  <p className="text-xs text-gray-500 mb-4">
                    Tồn kho: <span className="font-semibold">{product.stock}</span>
                  </p>

                  {/* Price and Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ₫ {parseInt(product.price).toLocaleString('vi-VN')}
                    </span>
                    <button
                      onClick={() => {
                        localStorage.setItem('lastOrderAmount', product.price.toString());
                        localStorage.setItem('selectedProductName', product.name);
                        window.location.href = '/checkout';
                      }}
                      disabled={product.stock <= 0}
                      className={`${
                        product.stock <= 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white py-2 px-4 rounded-lg transition duration-200`}
                    >
                      {product.stock <= 0 ? 'Hết hàng' : 'Mua'}
                    </button>
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
