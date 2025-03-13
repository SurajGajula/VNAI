import React, { useState } from 'react';
import PDFReader from './PDFReader';
import DialogueList from './DialogueList';
import Assets from './Assets';
import './TabContainer.css';

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'view' | 'assets'>('upload');

  return (
    <div className="tab-container">
      <div className="tab-header">
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
        <button 
          className={`tab-button ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </button>
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'upload' && (
          <div className="tab-panel">
            <PDFReader />
          </div>
        )}
        
        {activeTab === 'view' && (
          <div className="tab-panel">
            <DialogueList />
          </div>
        )}
        
        {activeTab === 'assets' && (
          <div className="tab-panel">
            <Assets />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabContainer; 