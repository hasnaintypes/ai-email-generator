"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import EmailList from "@/components/dashboard/email-list";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const convex = useConvex();

  // Fetch user's emails manually instead of using useQuery
  useEffect(() => {
    const fetchEmails = async () => {
      if (user?.id) {
        try {
          console.log("Fetching emails for user:", user.id);
          const userEmails = await convex.query(api.emails.getUserEmails, {
            userId: user.id,
          });
          console.log("Fetched emails:", userEmails);
          setEmails(userEmails || []);
        } catch (error) {
          console.error("Error fetching emails:", error);
          toast.error("Failed to load email templates");
        } finally {
          setIsLoading(false);
        }
      } else if (isUserLoaded) {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, [user, isUserLoaded, convex]);

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Loading your email templates...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <DashboardHeader
        heading="Email Templates"
        text="Create and manage your AI-generated email templates."
      />
      <EmailList emails={emails} user={user} convex={convex} />
    </div>
  );
}
