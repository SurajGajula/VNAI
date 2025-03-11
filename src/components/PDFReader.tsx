import React, { useState, useRef } from 'react';
import './PDFReader.css';
import * as pdfjs from 'pdfjs-dist';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFLine {
  text: string;
  pageNumber: number;
  lineNumber: number;
}

const PDFReader: React.FC = () => {
  const [pdfLines, setPdfLines] = useState<PDFLine[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    setPdfLines([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      let allLines: PDFLine[] = [];
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Process text items into lines
        const items = textContent.items as any[];
        const pageLines = items.map((item, index) => ({
          text: item.str,
          pageNumber: pageNum,
          lineNumber: index + 1
        }));
        
        allLines = [...allLines, ...pageLines];
      }
      
      setPdfLines(allLines);
    } catch (err) {
      console.error('Error parsing PDF:', err);
      setError('Failed to parse the PDF file. Please try another file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPdfLines([]);
    setFileName('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="pdf-reader">
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
      
      {pdfLines.length > 0 && (
        <div className="results">
          <div className="lines-container">
            {pdfLines.map((line, index) => (
              <div key={index} className="line">
                <span className="line-text">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFReader; 