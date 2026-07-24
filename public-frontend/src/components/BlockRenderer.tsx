import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const BlockRenderer = ({ blocks = [] }: { blocks: any[] }) => {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'header':
            return (
              <h2 key={block._id} className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {block.data.text}
              </h2>
            );

          case 'paragraph':
            return (
              <p key={block._id} className="text-lg leading-relaxed text-gray-700">
                {block.data.text}
              </p>
            );

          case 'list':
            return (
              <ul key={block._id} className="list-disc pl-6 space-y-3 text-lg text-gray-700 marker:text-blue-500">
                {(block.data.items || []).map((item: string, index: number) => (
                  <li key={index} className="pl-2">{item}</li>
                ))}
              </ul>
            );

          case 'equation':
            const { equation, displayMode } = block.data;
            return (
              <div key={block._id} className="my-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto hover:shadow-md transition-shadow">
                {displayMode ? (
                  <BlockMath math={equation} />
                ) : (
                  <p className="flex items-center gap-2 text-lg">
                    <span className="text-sm text-gray-400 font-mono tracking-widest uppercase">Formula</span>
                    <InlineMath math={equation} />
                  </p>
                )}
              </div>
            );

          case 'table':
            const { headers, rows } = block.data;
            return (
              <div key={block._id} className="overflow-x-auto my-8 rounded-2xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      {(headers || []).map((header: string, idx: number) => (
                        <th key={idx} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {(rows || []).map((row: string[], rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                        {(row || []).map((cell: string, cIdx: number) => (
                          <td key={cIdx} className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default BlockRenderer;
