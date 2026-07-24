import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Trash2, ArrowUp, ArrowDown, Save } from 'lucide-react';

const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/content/${id}`).then(res => {
        const page = res.data.data;
        setTitle(page.title);
        setSlug(page.slug);
        setBlocks(page.blocks.sort((a, b) => a.order - b.order));
      }).catch(err => console.error(err));
    }
  }, [id]);

  const handleAddBlock = (type) => {
    let newBlock = { type, data: {}, order: blocks.length };
    
    if (type === 'header' || type === 'paragraph') {
      newBlock.data = { text: '' };
    } else if (type === 'list') {
      newBlock.data = { items: [''] };
    } else if (type === 'equation') {
      newBlock.data = { equation: '', displayMode: true };
    } else if (type === 'table') {
      newBlock.data = { headers: ['Col 1', 'Col 2'], rows: [['', '']] };
    }
    
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index, newData) => {
    const newBlocks = [...blocks];
    newBlocks[index].data = newData;
    setBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    
    // update order
    newBlocks.forEach((blk, i) => blk.order = i);
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { title, slug, blocks: blocks.map((b, i) => ({ ...b, order: i })) };
      if (id) {
        await api.put(`/content/${id}`, payload);
      } else {
        await api.post(`/content`, payload);
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error saving page: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold">{id ? 'Edit Page' : 'New Page'}</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Page Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">URL Slug</label>
          <input 
            type="text" 
            value={slug} 
            onChange={e => setSlug(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <span className="font-semibold text-gray-600 uppercase text-xs">{block.type} BLOCK</span>
              <div className="flex gap-2 text-gray-400">
                <button onClick={() => moveBlock(index, -1)}><ArrowUp className="w-4 h-4 hover:text-blue-500" /></button>
                <button onClick={() => moveBlock(index, 1)}><ArrowDown className="w-4 h-4 hover:text-blue-500" /></button>
                <button onClick={() => removeBlock(index)}><Trash2 className="w-4 h-4 hover:text-red-500" /></button>
              </div>
            </div>

            {block.type === 'header' && (
              <input 
                type="text" 
                value={block.data.text || ''} 
                onChange={e => updateBlock(index, { text: e.target.value })}
                className="w-full text-2xl font-bold border-none focus:ring-0 p-0"
                placeholder="Header text..."
              />
            )}

            {block.type === 'paragraph' && (
              <textarea 
                value={block.data.text || ''} 
                onChange={e => updateBlock(index, { text: e.target.value })}
                className="w-full min-h-[100px] border border-gray-200 rounded p-2 focus:ring-blue-500"
                placeholder="Paragraph text..."
              />
            )}

            {block.type === 'list' && (
              <div className="space-y-2">
                {(block.data.items || []).map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-400 mt-2">•</span>
                    <input 
                      type="text" 
                      value={item} 
                      onChange={e => {
                        const newItems = [...block.data.items];
                        newItems[i] = e.target.value;
                        updateBlock(index, { items: newItems });
                      }}
                      className="flex-1 border-b border-gray-200 focus:border-blue-500 outline-none p-1"
                    />
                    <button 
                      onClick={() => {
                        const newItems = block.data.items.filter((_, idx) => idx !== i);
                        updateBlock(index, { items: newItems });
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => updateBlock(index, { items: [...(block.data.items || []), ''] })}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add List Item
                </button>
              </div>
            )}

            {block.type === 'equation' && (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={block.data.equation || ''} 
                  onChange={e => updateBlock(index, { ...block.data, equation: e.target.value })}
                  className="w-full font-mono text-sm border border-gray-200 rounded p-2 bg-gray-50"
                  placeholder="e.g. E = mc^2"
                />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input 
                    type="checkbox" 
                    checked={block.data.displayMode !== false}
                    onChange={e => updateBlock(index, { ...block.data, displayMode: e.target.checked })}
                  />
                  Block Display (Centered)
                </label>
              </div>
            )}

            {block.type === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-gray-50">
                    <tr>
                      {(block.data.headers || []).map((h, i) => (
                        <th key={i} className="px-3 py-2 border-r">
                          <input 
                            value={h} 
                            onChange={e => {
                              const newHeaders = [...block.data.headers];
                              newHeaders[i] = e.target.value;
                              updateBlock(index, { ...block.data, headers: newHeaders });
                            }}
                            className="bg-transparent border-none text-xs font-bold uppercase w-full focus:ring-0 p-0"
                          />
                        </th>
                      ))}
                      <th className="w-10">
                        <button 
                          onClick={() => {
                            const newHeaders = [...block.data.headers, `Col ${block.data.headers.length + 1}`];
                            const newRows = block.data.rows.map(r => [...r, '']);
                            updateBlock(index, { headers: newHeaders, rows: newRows });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >+</button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(block.data.rows || []).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 border-r">
                            <input 
                              value={cell} 
                              onChange={e => {
                                const newRows = [...block.data.rows];
                                newRows[rIdx][cIdx] = e.target.value;
                                updateBlock(index, { ...block.data, rows: newRows });
                              }}
                              className="w-full border-none focus:ring-0 p-0 text-sm"
                            />
                          </td>
                        ))}
                        <td>
                          <button 
                            onClick={() => {
                              const newRows = block.data.rows.filter((_, i) => i !== rIdx);
                              updateBlock(index, { ...block.data, rows: newRows });
                            }}
                            className="text-red-500 px-2"
                          >&times;</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  onClick={() => {
                    const newRows = [...block.data.rows, Array(block.data.headers.length).fill('')];
                    updateBlock(index, { ...block.data, rows: newRows });
                  }}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  + Add Row
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-2">
        <span className="text-gray-500 flex items-center mr-2 text-sm font-medium">Add Block:</span>
        {['header', 'paragraph', 'list', 'equation', 'table'].map(type => (
          <button 
            key={type}
            onClick={() => handleAddBlock(type)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 capitalize flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageEditor;
