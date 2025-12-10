// src/lib/toon-parser.ts
import { ComicScript } from '@/lib/types';

export function parseTOON(rawText: string): ComicScript {
  const panels = rawText
    .trim()
    .split('\n')
    .filter(line => line.length > 0 && line.includes('|'))
    .map(line => {
      // Destructure based on the spec: ID | TITLE | NARRATION | DIALOG | FILE | SNIPPET
      const parts = line.split('|').map(p => p.trim());
      
      const idStr = parts[0] || '0';
      const title = parts[1] || 'Untitled Panel';
      const narration = parts[2] || '';
      const dialogStr = parts[3] || '';
      const file = parts[4] || '';
      const snippet = parts[5] || '';

      return {
        id: parseInt(idStr.replace('#', ''), 10) || 0,
        title: title,
        narration: narration,
        dialog: dialogStr ? dialogStr.split(';').map(d => d.trim()) : [],
        file: file,
        snippet: snippet,
        panel_goal: 'Understand this module', // Default value since TOON omits it
      };
    });

  return { panels };
}