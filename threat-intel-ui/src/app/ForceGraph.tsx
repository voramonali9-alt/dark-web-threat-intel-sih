'use client';
import { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function ForceGraph({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="text-white p-4">Loading Graph...</div>;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <ForceGraph2D
        graphData={data}
        nodeLabel={(node: any) => `${node.label}: ${node.id}`}
        nodeAutoColorBy="label"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkLabel="label"
        width={800}
        height={500}
        backgroundColor="#111827"
        linkColor={() => 'rgba(255,255,255,0.4)'}
      />
    </div>
  );
}
