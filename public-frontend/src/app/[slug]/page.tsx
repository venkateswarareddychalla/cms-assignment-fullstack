import React from 'react';
import axios from 'axios';
import BlockRenderer from '@/components/BlockRenderer';

export const revalidate = 60;

// Fetch page data by slug
async function getPageData(slug: string) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000/api/v1'}/content/${slug}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageData(params.slug);

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
        <p className="text-gray-500">The content you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <article className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-4">{page.title}</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>
      <BlockRenderer blocks={page.blocks} />
    </article>
  );
}
