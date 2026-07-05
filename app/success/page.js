import { Suspense } from 'react';
import { SuccessContent } from './success-content';

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-xl text-gray-600">Đang tải...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
