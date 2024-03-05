'use client'
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Theme, Box, Container } from '@radix-ui/themes';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [isOpen, setIsOpen] = useState(false);

  const { data: suggestions = [], isLoading, isError } = useQuery({
    queryKey: ['autocomplete', inputText],
    queryFn: () => fetchAutocomplete(inputText)
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      setIsOpen(true);
    }
    setInputText(event.target.value);
    if (inputText.length === 0) {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setIsOpen(false);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        const index = parseInt(event.key, 10) - 1;
        if (index >= 0 && index < suggestions.length) {
          handleSuggestionClick(suggestions[index]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions]);

  return (
    <Theme>
      <Box style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-3)', height: '100vh', paddingTop: '200px'  }}>
        <Container size="1">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Start typing to see autocomplete suggestions. </Label>
              <Input type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text..." />
            </div>

            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div>Error fetching suggestions</div>
            ) : inputText.length === 0 || !isOpen ? null : (
              <div>
                <Command>
                  <CommandList>
                    <CommandGroup heading="Suggestions">
                      {suggestions.map((suggestion: string, index: number) => (
                        <CommandItem key={index} onSelect={() => handleSuggestionClick(suggestion)} onKeyDown={() => handleSuggestionClick(suggestion)}>
                          {suggestion}
                          <CommandShortcut onKeyDown={() => handleSuggestionClick(suggestion)}>⌘{index + 1}</CommandShortcut>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
        </Container>
      </Box>
    </Theme >
  );
}
