import React, { useState, useRef } from 'react';
import { useSceneStore } from '../stores/SceneStore';
import './Assets.css';

const Assets: React.FC = () => {
  const { 
    scene, 
    setCharacterSprite, 
    setBackground, 
    analyzeTone, 
    isAnalyzingTone,
    toneError,
    clearToneError
  } = useSceneStore();
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const uniqueSpeakers = scene.uniqueSpeakers();

  const handleSpeakerSelect = (speaker: string) => {
    setSelectedSpeaker(speaker);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedSpeaker) return;

    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        setCharacterSprite(selectedSpeaker, imageUrl);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        // Apply background immediately when loaded
        setBackground(imageUrl);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerBackgroundInput = () => {
    backgroundInputRef.current?.click();
  };

  const handleAnalyzeTone = () => {
    clearToneError();
    analyzeTone();
  };

  return (
    <div className="assets-container">
      <h2>Assets</h2>
      
      <div className="assets-content">
        {uniqueSpeakers.length === 0 ? (
          <p className="empty-message">No characters detected. Please upload a PDF with dialogue first.</p>
        ) : (
          <>
            <div className="assets-section">
              <h3>Scene Tone</h3>
              <div className="tone-section">
                {isAnalyzingTone ? (
                  <p>Analyzing tone...</p>
                ) : toneError ? (
                  <div className="tone-error">
                    <p className="error-message">{toneError}</p>
                    <p className="error-help">
                      Tone analysis is not available. Please check your API key.
                    </p>
                  </div>
                ) : scene.tone ? (
                  <div className="tone-display">
                    <p className="tone-value">
                      {scene.tone} {scene.toneEmoji && <span className="tone-emoji">{scene.toneEmoji}</span>}
                    </p>
                    <p className="tone-description">Based on the first line of dialogue</p>
                  </div>
                ) : (
                  <p>No tone detected</p>
                )}
                <button 
                  onClick={handleAnalyzeTone} 
                  className="analyze-tone-button"
                  disabled={isAnalyzingTone || scene.dialogue.length === 0}
                >
                  {isAnalyzingTone ? 'Analyzing...' : 'Analyze Tone'}
                </button>
              </div>
            </div>

            <div className="assets-section">
              <h3>Characters</h3>
              <div className="character-list">
                {uniqueSpeakers.map(speaker => (
                  <div 
                    key={speaker} 
                    className={`character-item ${selectedSpeaker === speaker ? 'selected' : ''}`}
                    onClick={() => handleSpeakerSelect(speaker)}
                  >
                    <div className="character-preview">
                      {scene.getCharacterSprite(speaker) ? (
                        <img 
                          src={scene.getCharacterSprite(speaker)} 
                          alt={speaker} 
                          className="character-thumbnail"
                        />
                      ) : (
                        <div className="character-placeholder-small"></div>
                      )}
                    </div>
                    <div className="character-name-asset">{speaker}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedSpeaker && (
              <div className="upload-section">
                <h4>Upload sprite for {selectedSpeaker}</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <button onClick={triggerFileInput} className="upload-button">
                  {scene.getCharacterSprite(selectedSpeaker) 
                    ? 'Change Character Sprite' 
                    : 'Upload Character Sprite'}
                </button>
              </div>
            )}
            
            <div className="assets-section">
              <h3>Background</h3>
              <div className="background-preview">
                {scene.background ? (
                  <img 
                    src={scene.background} 
                    alt="Background" 
                    className="background-thumbnail"
                  />
                ) : (
                  <div className="background-placeholder"></div>
                )}
              </div>
              <div className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundChange}
                  ref={backgroundInputRef}
                  style={{ display: 'none' }}
                />
                <button onClick={triggerBackgroundInput} className="upload-button">
                  {scene.background ? 'Change Background' : 'Upload Background'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Assets; 