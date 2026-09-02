import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function AiSalesInsights() {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get("http://localhost:8081/api/ai/sales-insights");
      setInsights(response.data.insights);
    } catch (err) {
      console.error("Failed to fetch AI insights:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6 px-4 md:px-6 max-w-screen-2xl mx-auto"
    >
      <Card className="shadow-4 border-round-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
        {/* Decorative AI background element */}
        <div className="absolute opacity-10 pointer-events-none" style={{ top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)' }}></div>
        
        <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
          <div className="flex align-items-center gap-3">
            <div className="w-3rem h-3rem border-circle bg-primary-100 flex align-items-center justify-content-center text-primary-600 shadow-1">
              <i className="pi pi-sparkles text-xl"></i>
            </div>
            <div>
              <h2 className="m-0 text-2xl font-bold text-900">AI Sales Insights</h2>
              <p className="m-0 text-500 text-sm mt-1">Powered by Google Gemini</p>
            </div>
          </div>
          <Button 
            icon="pi pi-refresh" 
            rounded 
            text 
            severity="secondary" 
            aria-label="Refresh Insights" 
            onClick={fetchInsights}
            loading={loading}
            tooltip="Refresh Insights"
          />
        </div>

        <div className="p-2">
          {loading ? (
            <div className="flex flex-column gap-3">
              <Skeleton width="100%" height="1.5rem"></Skeleton>
              <Skeleton width="80%" height="1.5rem"></Skeleton>
              <Skeleton width="90%" height="1.5rem"></Skeleton>
              <Skeleton width="60%" height="1.5rem"></Skeleton>
            </div>
          ) : error ? (
            <div className="flex flex-column align-items-center justify-content-center p-4 text-center">
              <i className="pi pi-exclamation-circle text-red-500 text-4xl mb-3"></i>
              <p className="text-700 m-0 mb-3">Failed to load AI insights at the moment.</p>
              <Button label="Try Again" icon="pi pi-refresh" onClick={fetchInsights} className="p-button-outlined p-button-sm" />
            </div>
          ) : (
            <div className="markdown-container text-700 line-height-3 text-lg">
              <ReactMarkdown>{insights}</ReactMarkdown>
            </div>
          )}
        </div>
      </Card>
      
      {/* Add some basic markdown styling just for this component */}
      <style>{`
        .markdown-container ul { padding-left: 1.5rem; margin-top: 0.5rem; }
        .markdown-container li { margin-bottom: 0.75rem; }
        .markdown-container strong { color: var(--primary-color); font-weight: 700; }
        .markdown-container p { margin-top: 0; margin-bottom: 1rem; }
      `}</style>
    </motion.div>
  );
}

export default AiSalesInsights;
