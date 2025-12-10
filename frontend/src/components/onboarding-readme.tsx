// src/components/onboarding-readme.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import ReactMarkdown from 'react-markdown';

interface OnboardingReadmeProps {
  content: string;
}

export function OnboardingReadme({ content }: OnboardingReadmeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding Guide</CardTitle>
        <CardDescription>Direct from the repository archives (README.md).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}