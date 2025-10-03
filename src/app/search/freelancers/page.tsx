'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SearchFreelancersContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Find Freelancers</h1>
      
      {query && (
        <p className="text-gray-600 mb-4">
          Search results for: <span className="font-semibold">&quot;{query}&quot;</span>
        </p>
      )}
      
      {category && (
        <p className="text-gray-600 mb-4">
          Category: <span className="font-semibold">{category}</span>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Freelancer cards will go here */}
        <p className="text-gray-500 col-span-full text-center py-12">
          Freelancer search functionality coming soon...
        </p>
      </div>
    </div>
  );
}

export default function SearchFreelancersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8">Loading...</div>}>
      <SearchFreelancersContent />
    </Suspense>
  );
}
