import { create } from 'zustand';
import { Dialogue } from '../classes/Dialogue';

interface DialogueState {
  dialogues: Dialogue[];
  currentIndex: number;
  setDialogues: (dialogues: Dialogue[]) => void;
  addDialogue: (dialogue: Dialogue) => void;
  clearDialogues: () => void;
  nextDialogue: () => void;
  prevDialogue: () => void;
  setCurrentIndex: (index: number) => void;
}

export const useDialogueStore = create<DialogueState>((set) => ({
  dialogues: [],
  currentIndex: 0,
  
  setDialogues: (dialogues: Dialogue[]) => set({ dialogues }),
  
  addDialogue: (dialogue: Dialogue) => 
    set((state) => ({ 
      dialogues: [...state.dialogues, dialogue] 
    })),
  
  clearDialogues: () => set({ dialogues: [] }),
  
  nextDialogue: () => set((state) => {
    if (state.currentIndex < state.dialogues.length - 1) {
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
    return { currentIndex: state.dialogues.length - 1 };
  }),
  
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
}));
