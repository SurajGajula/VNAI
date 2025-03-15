import { Dialogue } from "./Dialogue";

export interface CharacterSprite {
    name: string;
    imageUrl: string;
}

export class Scene {
    public dialogue: Dialogue[];
    public background: string;
    public characterSprites: Map<string, string>;
    public tone: string;
    public toneEmoji: string;

    constructor() {
        this.dialogue = [];
        this.background = "";
        this.characterSprites = new Map<string, string>();
        this.tone = "";
        this.toneEmoji = "";
    }

    addDialogue(dialogue: Dialogue) {
        this.dialogue.push(dialogue);
    }

    setBackground(url: string) {
        this.background = url;
    }

    setCharacterSprite(speakerName: string, imageUrl: string) {
        this.characterSprites.set(speakerName, imageUrl);
    }

    getCharacterSprite(speakerName: string): string | undefined {
        return this.characterSprites.get(speakerName);
    }

    uniqueSpeakers(): string[] {
        return Array.from(new Set(this.dialogue
            .filter(dialogue => dialogue.speaker !== "None")
            .map(dialogue => dialogue.speaker)));
    }

    setTone(tone: string, emoji?: string) {
        this.tone = tone;
        if (emoji) {
            this.toneEmoji = emoji;
        }
    }
}