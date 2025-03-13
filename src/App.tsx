import React from 'react';
import './App.css';
import TabContainer from './components/TabContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Visual Novel AI</h1>
      </header>
      <main>
        <TabContainer />
      </main>
    </div>
  );
}

export default App;
