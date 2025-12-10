import type { SuggestFirstContributorTasksOutput } from '@/ai/flows/suggest-first-contributor-tasks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { File, Star, Github, Target } from 'lucide-react';

interface TaskListProps {
  data: SuggestFirstContributorTasksOutput;
  repoUrl: string;
}

const DifficultyStars = ({ level }: { level: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < level ? 'text-accent fill-accent' : 'text-muted-foreground/50'
        }`}
      />
    ))}
  </div>
);

export function TaskList({ data, repoUrl }: TaskListProps) {

  const createIssueUrl = (task: SuggestFirstContributorTasksOutput['tasks'][0]) => {
    const baseUrl = `https://github.com/${repoUrl}/issues/new`;
    const title = encodeURIComponent(task.title);
    const body = encodeURIComponent(
      `**Description:**\n${task.description}\n\n**Files to Edit:**\n${task.filesToEdit
        .map(f => `\`${f}\``)
        .join('\n')}\n\n**Expected Outcome:**\n${task.expectedOutcome}`
    );
    const labels = 'good first issue,reposaga';
    return `${baseUrl}?title=${title}&body=${body}&labels=${labels}`;
  };

  if (!data.tasks || data.tasks.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Starter Quests</CardTitle>
          <CardDescription>
            A list of tasks to help you get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>No tasks were generated for this repository.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Starter Quests</CardTitle>
        <CardDescription>
          A list of tasks to help you get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {data.tasks.map((task, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-bold">{task.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">Difficulty</Badge>
                    <DifficultyStars level={task.difficulty} />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-muted-foreground">{task.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <strong>Files:</strong>
                    <div className="flex flex-wrap gap-1">
                      {task.filesToEdit.map(file => <Badge key={file} variant="secondary" className="font-code">{file}</Badge>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <strong>Expected Outcome:</strong>
                    <span>{task.expectedOutcome}</span>
                  </div>
                </div>

                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <a href={createIssueUrl(task)} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Create Issue on GitHub
                  </a>
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
