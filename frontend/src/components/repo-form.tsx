'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WandSparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  repoUrl: z
    .string()
    .url({ message: 'Please enter a valid URL.' })
    .regex(/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-.]+$/, {
      message: 'Please enter a valid GitHub repository URL.',
    }),
});

export function RepoForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      repoUrl: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const url = new URL(data.repoUrl);
      const repoPath = url.pathname.slice(1);
      router.push(`/saga?repoUrl=${encodeURIComponent(repoPath)}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Could not process the provided GitHub URL.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="repoUrl"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
  <FormControl>
    <Input
      placeholder="e.g. -> https://github.com/facebook/.."
      {...field}
      className="h-14 pl-4 pr-40 text-lg bg-secondary border-2 border-border focus:border-primary focus:ring-primary rounded-xl"
    />
  </FormControl>

  <div className="absolute inset-y-0 right-2 flex items-center">
    <Button
      type="submit"
      size="lg"
      className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
    >
      <WandSparkles className="mr-2 h-5 w-5" />
      Summon Map
    </Button>
  </div>
</div>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
