'use client'
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flex, Grid, Theme, Text, DropdownMenu, Button, Box, Container } from '@radix-ui/themes';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (e.target.value.length > 0) {
      setIsOpen(true);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setIsOpen(false);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for "Cmd" or "Ctrl" + number key (1-9)
      if (event.metaKey || event.ctrlKey) {
        const index = parseInt(event.key, 10) - 1;
        if (index >= 0 && index < suggestions.length) {
          handleSuggestionClick(suggestions[index]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions]); // Depend on suggestions to update event listener with the latest data

  return (
    <Theme>
      <Box style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-3)', height: '100vh' }}>
        <Container size="1">

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
            ) : !isOpen ? null : (

              <div>
                {/* <CommandDialog open={open} onOpenChange={setOpen}> */}
                   <Command>
                  {/* <CommandInput placeholder="Start typing to see autocomplete suggestions..." /> */}
                  <CommandList>
                    {/* <CommandEmpty>No results found.</CommandEmpty> */}
                    <CommandGroup heading="Suggestions">
                      {suggestions.map((suggestion: string, index: number) => (
                        <CommandItem key={index} onSelect={() => handleSuggestionClick(suggestion)}>
                          {suggestion}
                          <CommandShortcut onKeyDown={() => handleSuggestionClick(suggestion)}>⌘{index}</CommandShortcut>
                        </CommandItem>
                      ))}
                      {/* <CommandItem>Calendar</CommandItem>
                  <CommandItem>Search Emoji</CommandItem>
                  <CommandItem>Calculator</CommandItem> */}
                    </CommandGroup>
                  </CommandList>
                </Command>
                {/* </CommandDialog> */}

                {/* {suggestions.length > 0 && (
              <DropdownMenu.Root open>
              
                <DropdownMenu.Content>
                  {suggestions.map((suggestion: string, index: number) => (
                    <DropdownMenu.Item key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )} */}
              </div>
            )}
          </div>

        </Container>
      </Box>

    </Theme >
  );
}
