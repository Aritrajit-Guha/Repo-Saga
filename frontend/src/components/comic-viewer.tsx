import type { ComicScript } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Forward } from 'lucide-react';

interface ComicViewerProps {
  data: ComicScript;
}

export function ComicViewer({ data }: ComicViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comic Script</CardTitle>
        <CardDescription>A journey through the codebase.</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {data.panels.map((panel) => (
              <CarouselItem key={panel.id}>
                <div className="p-1">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="font-headline text-lg">
                        Panel {panel.id}: {panel.title}
                      </CardTitle>
                      <CardDescription className="italic">
                        {panel.narration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-bold flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4" /> Dialogue
                        </h4>
                        <div className="pl-6 border-l-2 border-primary/50 text-sm space-y-1">
                          {panel.dialog.map((line, i) => (
                            <p key={i} className="text-muted-foreground">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <p className="font-code text-xs text-muted-foreground mb-1">
                          {panel.file}
                        </p>
                        <pre className="bg-background rounded-md p-3 text-xs font-code overflow-x-auto">
                          <code>{panel.snippet}</code>
                        </pre>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-background/50">
                       <div className="text-sm font-bold flex items-center gap-2 text-primary">
                         <Forward className="w-4 h-4" />
                         <span>{panel.panel_goal}</span>
                       </div>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
