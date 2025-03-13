import { create } from 'zustand';
import { Scene } from '../classes/Scene';
import { Dialogue } from '../classes/Dialogue';

interface SceneState {
  scene: Scene;
  currentIndex: number;
  addDialogue: (dialogue: Dialogue) => void;
  clearScene: () => void;
  nextDialogue: () => void;
  prevDialogue: () => void;
  setCurrentIndex: (index: number) => void;
  setBackground: (url: string) => void;
  setCharacterSprite: (speakerName: string, imageUrl: string) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: new Scene(),
  currentIndex: 0,
  
  addDialogue: (dialogue: Dialogue) => 
    set((state) => {
      state.scene.addDialogue(dialogue);
      return { scene: state.scene };
    }),
  
  clearScene: () => set({ scene: new Scene(), currentIndex: 0 }),
  
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
})); 