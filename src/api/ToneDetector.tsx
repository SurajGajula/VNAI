import React from 'react';

interface ToneResponse {
  overall: [number, string, string][]; // [confidence, tone, emoji]
  results: [[number, string, string][]]; // Array of arrays of [confidence, tone, emoji]
  sents: string[]; // The sentences that were analyzed
  tone?: string; // The extracted tone with highest confidence (added for convenience)
  confidence?: number; // The confidence of the extracted tone (added for convenience)
  emoji?: string; // The emoji of the extracted tone (added for convenience)
  [key: string]: any; // Allow for additional properties
}

interface ErrorResponse {
  msg: string;
}

export async function detectTone(text: string): Promise<ToneResponse> {
  try {
    const apiKey = process.env.REACT_APP_SAPLING_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please check your environment variables.');
    }
    
    const response = await fetch('https://api.sapling.ai/api/v1/tone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        text,
      }),
    });
    
    const responseText = await response.text();
    let data: ToneResponse;
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error('Invalid response format from API');
    }
    
    if (!response.ok) {
      const errorData = data as unknown as ErrorResponse;
      throw new Error(errorData.msg || 'Failed to detect tone');
    }
    
    // Extract the tone with the highest confidence from the overall results
    if (data.overall && data.overall.length > 0) {
      // Sort by confidence (descending)
      const sortedTones = [...data.overall].sort((a, b) => b[0] - a[0]);
      const highestConfidenceTone = sortedTones[0];
      
      // Add the extracted tone to the response for convenience
      data.tone = highestConfidenceTone[1];
      data.confidence = highestConfidenceTone[0];
      data.emoji = highestConfidenceTone[2];
    } else {
      data.tone = 'neutral';
      data.confidence = 0;
      data.emoji = '😐';
    }
    
    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Tone detection error:', err.message);
    } else {
      console.error('Unknown tone detection error occurred');
    }
    throw err;
  }
}

// Example component for testing
const ToneDetectorComponent: React.FC<{text: string}> = ({ text }) => {
  const [tone, setTone] = React.useState<ToneResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  
  const analyzeText = async () => {
    if (!text) return;
    
    setLoading(true);
    try {
      const result = await detectTone(text);
      setTone(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
      setTone(null);
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    analyzeText();
  }, [text]);
  
  if (loading) return <div>Analyzing tone...</div>;
  
  return (
    <div>
      {tone && (
        <div>
          <h3>Detected Tone: {tone.tone} {tone.emoji}</h3>
          <p>Confidence: {(tone.confidence! * 100).toFixed(2)}%</p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ToneDetectorComponent;
