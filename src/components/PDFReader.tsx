import React, { useState, useRef } from 'react';
import './PDFReader.css';
import * as pdfjs from 'pdfjs-dist';
import { Dialogue } from '../classes/Dialogue';
import { useSceneStore } from '../stores/SceneStore';
import { useTabContext } from './TabContainer';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFReader: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get the store methods
  const { addDialogue, clearScene } = useSceneStore();
  
  // Get the tab context for switching tabs
  const { setActiveTab } = useTabContext();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    clearScene(); // Clear the scene when loading a new file

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Process text items into lines
        const items = textContent.items as any[];
        
        // Collect text for dialogue parsing
        const pageText = items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }
      
      // Parse dialogues from the full text
      parseDialoguesFromText(fullText);
      
      // Set success state
      setSuccess(true);
      
      // Automatically switch to the Assets tab
      setActiveTab('assets');
      
    } catch (err) {
      console.error('Error parsing PDF:', err);
      setError('Failed to parse the PDF file. Please try another file.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseDialoguesFromText = (text: string) => {
    // Split the text by sentence endings (., ?, !)
    // Using a regex that handles sentence endings followed by spaces
    const sentenceRegex = /[.!?]+\s+/g;
    const sentences = text.split(sentenceRegex).filter(s => s.trim() !== '');
    
    // Add back the sentence endings that were removed by the split
    const processedSentences = sentences.map((sentence, index) => {
      // Find what punctuation ended this sentence (for all except the last one)
      if (index < sentences.length - 1) {
        const nextSentenceStart = text.indexOf(sentences[index + 1], 
          text.indexOf(sentence) + sentence.length);
        const endingPunctuation = text.substring(
          text.indexOf(sentence) + sentence.length, 
          nextSentenceStart
        ).trim();
        return sentence.trim() + endingPunctuation;
      }
      // For the last sentence, check if it ends with punctuation
      const lastChar = text.trim().slice(-1);
      if (['.', '!', '?'].includes(lastChar)) {
        return sentence.trim() + lastChar;
      }
      return sentence.trim();
    });
    
    // Create Dialogue objects for each sentence and add to scene
    processedSentences
      .filter(sentence => sentence.trim().length > 0)
      .forEach(sentence => {
        const dialogue = new Dialogue(sentence.trim());
        addDialogue(dialogue);
      });
    
    console.log(`Parsed and added dialogues to scene`);
  };

  const handleReset = () => {
    setFileName('');
    setError(null);
    setSuccess(false);
    clearScene(); // Clear scene when resetting
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="pdf-reader">
      <h2>PDF Dialogue Reader</h2>
      <div className="upload-section">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file-input"
        />
        {fileName && <button onClick={handleReset}>Clear</button>}
      </div>

      {isLoading && <div className="loading">Loading PDF content...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {success && !isLoading && (
        <div className="success-message">
          <p>PDF successfully processed! Switching to Assets tab...</p>
        </div>
      )}
    </div>
  );
};

export default PDFReader; 