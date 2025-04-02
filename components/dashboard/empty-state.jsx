import { Button } from "@/components/ui/button";
import { Mail, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function EmptyState({ onCreateNew }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50 my-16">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">No email templates yet</h2>
      <p className="mt-2 text-center text-muted-foreground max-w-sm mx-auto">
        Create your first email template to get started. You can generate one
        with AI or create one from scratch.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="gap-1">
          <Link href="/dashboard/create-email">
            <Plus className="h-4 w-4" />
            Create New Template
          </Link>
        </Button>
        <Button variant="outline" className="gap-1">
          <Sparkles className="h-4 w-4" />
          Browse Template Gallery
        </Button>
      </div>
    </div>
  );
}
