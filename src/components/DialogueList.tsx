import React, { useState, useEffect, useRef } from 'react';
import { useSceneStore } from '../stores/SceneStore';
import './DialogueList.css';

const DialogueList: React.FC = () => {
  const { 
    scene,
    currentIndex, 
    setCurrentIndex 
  } = useSceneStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const typingSpeed = 30; // milliseconds per character
  const fullTextRef = useRef('');
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const vnContainerRef = useRef<HTMLDivElement>(null);

  const handleNextDialogue = () => {
    // Only advance to next dialogue if not typing
    if (!isTyping) {
      // Loop back to the beginning if we're at the end
      if (currentIndex >= scene.dialogue.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handleDialogueBoxClick = () => {
    if (isTyping) {
      // If text is still typing, show full text immediately and stop the animation
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      setDisplayedText(fullTextRef.current);
      setIsTyping(false);
    } else {
      // If text is fully displayed, go to next dialogue
      handleNextDialogue();
    }
  };

  useEffect(() => {
    // Add keyboard event listener for navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.code === 'Space') {
        if (isTyping) {
          // If text is still typing, show full text immediately and stop the animation
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          setDisplayedText(fullTextRef.current);
          setIsTyping(false);
        } else {
          // If text is fully displayed, go to next dialogue
          handleNextDialogue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, scene.dialogue.length, isTyping, handleNextDialogue]);

  // Effect to handle text animation when dialogue changes
  useEffect(() => {
    if (scene.dialogue.length === 0) return;
    
    const text = scene.dialogue[currentIndex].line;
    fullTextRef.current = text;
    setDisplayedText('');
    setIsTyping(true);
    
    let currentChar = 0;
    // Clear any existing interval
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    
    // Start new typing animation
    const intervalId = setInterval(() => {
      if (currentChar < text.length) {
        setDisplayedText(text.substring(0, currentChar + 1));
        currentChar++;
      } else {
        clearInterval(intervalId);
        intervalIdRef.current = null;
        setIsTyping(false);
      }
    }, typingSpeed);
    
    // Store the interval ID for potential cancellation
    intervalIdRef.current = intervalId;
    
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [currentIndex, scene.dialogue]);

  const toggleFullscreen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!document.fullscreenElement) {
      vnContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    
    // Blur (unfocus) the button after clicking
    event.currentTarget.blur();
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (scene.dialogue.length === 0) {
    return <div className="no-dialogues">No dialogues loaded. Please upload a PDF file.</div>;
  }

  const currentDialogue = scene.dialogue[currentIndex];
  const currentSpeaker = currentDialogue.speaker;
  const characterSprite = scene.getCharacterSprite(currentSpeaker);
  
  return (
    <div className={`vn-container ${isFullscreen ? 'fullscreen' : ''}`} ref={vnContainerRef}>
      <div className="vn-scene">
        <div className="vn-background" style={scene.background ? { backgroundImage: `url(${scene.background})` } : {}}>
          {/* Background image */}
        </div>
        <div className="vn-character">
          {characterSprite ? (
            <img src={characterSprite} alt={currentSpeaker} className="character-sprite" />
          ) : (
            /* Only show character placeholder if there's a speaker but no sprite */
            currentDialogue.hasSpeaker() && <div className="character-placeholder"></div>
          )}
        </div>
      </div>
      
      <div className="dialogue-container">
        <div className="dialogue-header">
          {currentDialogue.hasSpeaker() ? (
            <div className="character-name">{currentDialogue.speaker}</div>
          ) : (
            <div className="character-name-placeholder"></div>
          )}
          <div className="dialogue-controls">
            <button onClick={toggleFullscreen} className="fullscreen-toggle">
              {isFullscreen ? '⊖' : '⊕'}
            </button>
          </div>
        </div>
        <div className="dialogue-content" onClick={handleDialogueBoxClick}>
          {displayedText}
          {!isTyping && <div className="vn-dialogue-indicator">▼</div>}
        </div>
      </div>
    </div>
  );
};

export default DialogueList; 