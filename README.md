# PDF Line Reader

A React TypeScript application that allows users to upload PDF files and view their content line by line.

## Features

- Upload PDF files
- Extract text content from PDFs
- Display text content line by line with page and line numbers
- Clean and responsive user interface

## Technologies Used

- React
- TypeScript
- PDF.js for PDF parsing
- Create React App for project setup

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pdf-reader
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Click the "Choose File" button to select a PDF file from your computer
2. The application will process the PDF and display its content line by line
3. Each line is displayed with its corresponding page and line number
4. Use the "Clear" button to reset and upload a different PDF

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create a `build` folder with optimized production files.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [PDF.js](https://mozilla.github.io/pdf.js/) - A general-purpose, web standards-based platform for parsing and rendering PDFs
- [Create React App](https://create-react-app.dev/) - Set up a modern web app by running one command
