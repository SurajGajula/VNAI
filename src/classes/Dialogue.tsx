export class Dialogue {
    public speaker: string;
    public line: string;

    constructor(
        public text: string
    ) {
        // Check for pattern: one or two capitalized words followed by a colon
        const speakerPattern = /^([A-Z][a-z]*(\s[A-Z][a-z]*)?)\s*:/;
        const match = text.match(speakerPattern);
        
        if (match) {
            // If pattern matches, extract speaker and line
            this.speaker = match[1].trim();
            const colonIndex = text.indexOf(':');
            this.line = text.substring(colonIndex + 1).trim();
        } else {
            // If no speaker pattern is found, there is no speaker
            this.speaker = "None";
            this.line = text.trim();
        }
    }

    // Helper method to check if this dialogue has a speaker
    hasSpeaker(): boolean {
        return this.speaker !== "None";
    }
}