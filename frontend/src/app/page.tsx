'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { ShieldAlert, Activity, UserCheck } from 'lucide-react';

// Dynamically import the graph to avoid SSR issues
const ForceGraph = dynamic(() => import('./ForceGraph'), { ssr: false });

export default function Dashboard() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from FastAPI backend
    const fetchData = async () => {
      try {
        const graphRes = await axios.get('http://127.0.0.1:8000/api/graph-data');
        const matchRes = await axios.get('http://127.0.0.1:8000/api/analysis-results');
        
        setGraphData(graphRes.data);
        setMatches(matchRes.data.stylometric_matches || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <header className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={32} />
          NTRO Dark Web De-Anonymization
        </h1>
        <p className="text-gray-400 mt-2">AI Stylometry & Graph Identity Correlation (SIH 26151)</p>
      </header>

      {loading ? (
        <div className="text-center mt-20 text-xl">Analyzing Threat Data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Graph View */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="text-green-400" />
              Network Graph (Aliases, Wallets, PGP)
            </h2>
            <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800">
              <ForceGraph data={graphData} />
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="text-purple-400" />
              AI Stylometry Matches
            </h2>
            
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-4">
                The NLP engine analyzed sentence structures, n-grams, and forum slang to link the following aliases:
              </p>
              
              {matches.length === 0 ? (
                <p className="text-yellow-400">No high-confidence matches found.</p>
              ) : (
                <ul className="space-y-4">
                  {matches.map((match: any, idx: number) => (
                    <li key={idx} className="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-blue-300">{match.handle_1}</span>
                        <span className="text-gray-500 text-sm">matches</span>
                        <span className="font-mono text-blue-300">{match.handle_2}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-purple-500 h-2.5 rounded-full" 
                          style={{ width: `${match.confidence_score}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-xs mt-1 text-purple-300">
                        {match.confidence_score}% Confidence
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
