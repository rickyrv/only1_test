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
    const uniqueMatches = new Set<string>();

    let bestScore: number = 0;

    dictionary.forEach(dictWord => {
        const score: number = calculateSimilarity(word, dictWord);

        if (score > bestScore) {
            bestScore = score;
            uniqueMatches.clear(); 
            uniqueMatches.add(dictWord); 
        } else if (score === bestScore) {
            uniqueMatches.add(dictWord);
        }
    });

    return Array.from(uniqueMatches);
}


function calculateSimilarity(word1: string, word2: string): number {
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

    return 1 / (1 + dp[m][n]); 
}

