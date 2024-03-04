'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery }  from '@tanstack/react-query';
const queryClient = new QueryClient();

const fetchAutocomplete = async (inputText: string) => {
  if (!inputText) return [];
  try {
    const response = await fetch("/api/autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputText }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching suggestions');
  }
}
export default function Home() {
  const [inputText, setInputText] = useState('');

  const { data: suggestions = [], isLoading, isError } = useQuery({
    queryKey: ['autocomplete', inputText],
    queryFn: () => fetchAutocomplete(inputText)
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <QueryClientProvider client={queryClient}>

    <div>
      <h1>Autocomplete</h1>
      <p>Start typing to see autocomplete suggestions.</p>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text..."
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error fetching suggestions</div>
      ) : (
        <div>
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((suggestion: string, index: number) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
    </QueryClientProvider>
  );
}
