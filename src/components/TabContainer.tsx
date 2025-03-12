import React, { useState } from 'react';
import PDFReader from './PDFReader';
import DialogueList from './DialogueList';
import './TabContainer.css';

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'view'>('upload');

  return (
    <div className="tab-container">
      <div className="tab-header">
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          U pload
        </button>
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          V iew
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
      </div>
    </div>
  );
};

export default TabContainer; 