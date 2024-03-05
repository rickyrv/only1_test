import { NextResponse, NextRequest } from "next/server";
import { dictionary } from "../../../_HARDCODED_/dictionary";

interface Result {
    bestMatch: string | null;
    score: number;
}

export async function POST(request: NextRequest, response: NextResponse): Promise<NextResponse> {
    const { inputText }: { inputText: string } = await request.json();
    
    const result = findBestMatches(inputText, dictionary);
    
    return NextResponse.json(result);
}

function findBestMatches(word: string, dictionary: string[]): string[] {
    // Initialize a set to store unique best matches
    const uniqueMatches = new Set<string>();

    // Initialize variable to keep track of the best score
    let bestScore: number = 0;

    // Loop through each word in the dictionary
    dictionary.forEach(dictWord => {
        // Calculate the similarity score between the input word and the current word in the dictionary
        const score: number = calculateSimilarity(word, dictWord);

        // If the current word's score is higher than the best score so far, update the best score
        if (score > bestScore) {
            bestScore = score;
            uniqueMatches.clear(); // Clear the set since we found a new best match
            uniqueMatches.add(dictWord); // Add the new best match to the set
        } else if (score === bestScore) {
            uniqueMatches.add(dictWord); // Add the word to the set if it has the same score as the best score
        }
    });

    // Convert the set to an array and return the unique best matches
    return Array.from(uniqueMatches);
}


// Function to calculate the similarity score between two words (for example, using Levenshtein distance)
function calculateSimilarity(word1: string, word2: string): number {
    // Implementation of similarity calculation (you can replace this with any other similarity metric)
    // For example, you can use Levenshtein distance, Jaccard similarity, etc.
    // Here, we use a simple Levenshtein distance implementation
    const m: number = word1.length;
    const n: number = word2.length;
    const dp: number[][] = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return 1 / (1 + dp[m][n]); // Return similarity score (inverse of Levenshtein distance)
}

