import { create } from 'zustand';
import { Scene } from '../classes/Scene';
import { Dialogue } from '../classes/Dialogue';
import { detectTone } from '../api/ToneDetector';

interface SceneState {
  scene: Scene;
  currentIndex: number;
  isAnalyzingTone: boolean;
  toneError: string | null;
  addDialogue: (dialogue: Dialogue) => void;
  clearScene: () => void;
  nextDialogue: () => void;
  prevDialogue: () => void;
  setCurrentIndex: (index: number) => void;
  setBackground: (url: string) => void;
  setCharacterSprite: (speakerName: string, imageUrl: string) => void;
  analyzeTone: () => Promise<void>;
  setTone: (tone: string, emoji?: string) => void;
  clearToneError: () => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  scene: new Scene(),
  currentIndex: 0,
  isAnalyzingTone: false,
  toneError: null,
  
  addDialogue: (dialogue: Dialogue) => 
    set((state) => {
      state.scene.addDialogue(dialogue);
      return { scene: state.scene };
    }),
  
  clearScene: () => set({ scene: new Scene(), currentIndex: 0, toneError: null }),
  
  nextDialogue: () => set((state) => {
    if (state.currentIndex < state.scene.dialogue.length - 1) {
      return { currentIndex: state.currentIndex + 1 };
    }
    // Loop back to the beginning
    return { currentIndex: 0 };
  }),
  
  prevDialogue: () => set((state) => {
    if (state.currentIndex > 0) {
      return { currentIndex: state.currentIndex - 1 };
    }
    // Loop to the end
    return { currentIndex: state.scene.dialogue.length - 1 };
  }),
  
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  
  setBackground: (url: string) => set((state) => {
    state.scene.setBackground(url);
    return { scene: state.scene };
  }),
  
  setCharacterSprite: (speakerName: string, imageUrl: string) => set((state) => {
    state.scene.setCharacterSprite(speakerName, imageUrl);
    return { scene: state.scene };
  }),

  analyzeTone: async () => {
    const state = get();
    
    // Check if there's any dialogue
    if (state.scene.dialogue.length === 0) {
      return;
    }
    
    // Reset any previous errors
    set({ isAnalyzingTone: true, toneError: null });
    
    try {
      // Get the first dialogue line
      const firstDialogue = state.scene.dialogue[0];
      
      // Analyze the tone
      const result = await detectTone(firstDialogue.line);
      
      // Set the tone in the scene
      state.scene.setTone(result.tone || 'neutral', result.emoji);
      
      // Update the state
      set({ scene: state.scene, isAnalyzingTone: false });
    } catch (error) {
      console.error('Failed to analyze tone:', error);
      let errorMessage = 'Failed to analyze tone';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      set({ 
        isAnalyzingTone: false, 
        toneError: errorMessage
      });
      
      // Clear the tone if there was an error
      state.scene.setTone('');
      set({ scene: state.scene });
    }
  },
  
  setTone: (tone: string, emoji?: string) => set((state) => {
    state.scene.setTone(tone, emoji);
    return { scene: state.scene };
  }),
  
  clearToneError: () => set({ toneError: null }),
})); 