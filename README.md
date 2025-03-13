# Visual Novel AI

A React-based application for creating visual novel experiences from text. This tool allows you to upload PDF documents, extract dialogue, and present it in a visual novel format with character sprites and backgrounds.

## Features

### PDF Dialogue Extraction
- Upload PDF files and automatically extract text
- Intelligent parsing of dialogue and speaker identification
- Automatic organization of dialogue into a sequential scene

### Visual Novel View
- Interactive visual novel interface with typing animation
- Character sprites displayed based on the current speaker
- Background images to set the scene
- Fullscreen mode for immersive reading
- Keyboard (space) and click navigation

### Asset Management
- Upload and manage character sprites for each detected speaker
- Set background images for your visual novel scenes
- Real-time preview of assets in the visual novel view

## How It Works

1. **Upload**: Upload a PDF file containing dialogue text
2. **Assets**: Add character sprites for each detected speaker and set a background
3. **View**: Experience your text as a visual novel with character sprites and animated dialogue

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/visual-novel-ai.git
cd visual-novel-ai

# Install dependencies
npm install

# Start the development server
npm start
```

### Usage

1. **Upload a PDF**:
   - Navigate to the "Upload" tab
   - Click the file input to select a PDF file
   - The application will extract dialogue and identify speakers

2. **Add Assets**:
   - Navigate to the "Assets" tab
   - Click on a character name to select it
   - Upload a character sprite for the selected character
   - Upload a background image for your scene

3. **View Your Visual Novel**:
   - Navigate to the "View" tab
   - Click or press space to advance through the dialogue
   - Use the fullscreen button for an immersive experience

## Technical Details

- Built with React and TypeScript
- Uses PDF.js for PDF parsing
- State management with Zustand
- Responsive design for various screen sizes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- PDF.js for PDF parsing capabilities
- React for the UI framework
- Zustand for state management
