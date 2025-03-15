import React, { useState, createContext, useContext } from 'react';
import PDFReader from './PDFReader';
import DialogueList from './DialogueList';
import Assets from './Assets';
import './TabContainer.css';

// Create a context for tab switching
export type TabType = 'upload' | 'view' | 'assets';
interface TabContextType {
  setActiveTab: (tab: TabType) => void;
}

export const TabContext = createContext<TabContextType | undefined>(undefined);

// Custom hook to use the tab context
export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabContextProvider');
  }
  return context;
};

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  return (
    <TabContext.Provider value={{ setActiveTab }}>
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
    </TabContext.Provider>
  );
};

export default TabContainer; 