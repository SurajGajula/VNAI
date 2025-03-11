import React from 'react';
import './App.css';
import PDFReader from './components/PDFReader';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Visual Novel AI</h1>
      </header>
      <main>
        <PDFReader />
      </main>
    </div>
  );
}

export default App;
