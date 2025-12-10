'use client';

import { useState } from 'react';
import { CodebaseMap } from '@/components/codebase-map';
import { ComicViewer } from '@/components/comic-viewer';
import { TaskList } from '@/components/task-list';
import { OnboardingReadme } from '@/components/onboarding-readme';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ListChecks, FileText, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { SagaData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SagaDashboardProps {
  data: SagaData;
  repoUrl: string;
}

export function SagaDashboard({ data, repoUrl }: SagaDashboardProps) {
  const isDemo = data.readme.includes("Demo Mode Active");
  const [cinematicMode, setCinematicMode] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col p-4 md:p-8 overflow-hidden">
      
      {/* --- LIVE BACKGROUND (Client Side for Parallax potential) --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <img 
          src="/assets/bg-dashboard.jpg" 
          className="w-full h-full object-cover animate-ken-burns opacity-90 brightness-75"
          alt="Ruins"
        />
        {/* Subtle overlay to ensure white text pops without blocking image */}
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
      </div>

      {/* --- TOP BAR: Header & Toggle --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-50 mb-6 transition-all duration-500">
        
        {/* Title Card - Fades out in Cinematic Mode */}
        <div className={cn(
          "bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-700",
          cinematicMode ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100"
        )}>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            The Saga of <span className="text-primary glow-blue">{repoUrl}</span>
          </h1>
        </div>

        {/* Controls Container */}
        <div className="flex items-center gap-4">
          {isDemo && (
            <div className={cn(
              "flex items-center gap-2 text-amber-300 bg-amber-900/30 px-4 py-2 rounded-lg border border-amber-500/40 backdrop-blur-md animate-pulse transition-opacity duration-500",
               cinematicMode ? "opacity-0" : "opacity-100"
            )}>
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold text-sm">Demo Mode</span>
            </div>
          )}

          {/* CINEMATIC TOGGLE BUTTON */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCinematicMode(!cinematicMode)}
            className="bg-black/40 border-primary/50 text-primary hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-md rounded-full w-12 h-12"
            title={cinematicMode ? "Show Interface" : "Cinematic Mode (Hide UI)"}
          >
            {cinematicMode ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className={cn(
        "grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow transition-all duration-700 ease-in-out",
        cinematicMode ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      )}>
        
        {/* MAP COLUMN (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col h-full min-h-[500px]">
          <Card className="flex-grow border border-white/10 bg-black/10 backdrop-blur-md shadow-2xl hover:border-primary/30 transition-colors overflow-hidden group">
            <CardHeader className="bg-black/20 border-b border-white/5 pb-2">
              <CardTitle className="text-white drop-shadow-md flex items-center gap-2">
                 Realm Map 
                 <span className="text-xs font-normal text-white/50 bg-white/10 px-2 py-0.5 rounded-full">Interactive</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative h-full">
               {/* Make the map component fill the glassy card completely */}
               <div className="w-full h-full min-h-[400px] p-2">
                 <CodebaseMap data={data.map} />
               </div>
            </CardContent>
          </Card>
        </div>
        
        {/* TOOLS COLUMN (1/3 width) */}
        <div className="lg:col-span-1 h-full min-h-[500px]">
          <Tabs defaultValue="comic" className="w-full h-full flex flex-col">
            
            {/* Minimalist Tab Bar */}
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-black/20 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
              <TabsTrigger value="comic" className="data-[state=active]:bg-primary/80 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)] font-bold transition-all">
                <BookOpen className="mr-2 h-4 w-4" /> Saga
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-primary/80 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)] font-bold transition-all">
                <ListChecks className="mr-2 h-4 w-4" /> Quests
              </TabsTrigger>
              <TabsTrigger value="guide" className="data-[state=active]:bg-primary/80 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)] font-bold transition-all">
                <FileText className="mr-2 h-4 w-4" /> Guide
              </TabsTrigger>
            </TabsList>
            
            {/* Tab Content Containers - SUPER GLASSY */}
            <div className="flex-grow relative">
              <TabsContent value="comic" className="h-full mt-0 absolute inset-0">
                <div className="bg-black/10 backdrop-blur-xl rounded-xl border border-white/10 h-full p-1 overflow-hidden shadow-2xl">
                    <ComicViewer data={data.comic} />
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="h-full mt-0 absolute inset-0">
                 <div className="bg-black/10 backdrop-blur-xl rounded-xl border border-white/10 h-full overflow-y-auto shadow-2xl p-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
                    <TaskList data={data.tasks} repoUrl={repoUrl} />
                 </div>
              </TabsContent>
              
              <TabsContent value="guide" className="h-full mt-0 absolute inset-0">
                 <div className="bg-black/10 backdrop-blur-xl rounded-xl border border-white/10 h-full overflow-y-auto shadow-2xl p-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
                    <OnboardingReadme content={data.readme} />
                 </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Floating Hint when in Cinematic Mode */}
      {cinematicMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/70 text-sm animate-pulse pointer-events-none">
              Press Eye Icon to return to Dashboard
          </div>
      )}
    </div>
  );
}