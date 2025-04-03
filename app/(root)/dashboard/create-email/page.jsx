"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Sparkles, Edit3, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { generateEmailTemplate } from "@/lib/ai-service";
import { toast } from "sonner";

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "urgent", label: "Urgent" },
  { value: "persuasive", label: "Persuasive" },
];

export default function CreateEmailPage() {
  const [creationMethod, setCreationMethod] = useState("ai");
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { user } = useUser();
  const convex = useConvex();

  // Set default sender email from user
  useEffect(() => {
    if (user?.primaryEmailAddress) {
      setSender(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  // Sync user with Convex
  useEffect(() => {
    const syncUserWithConvex = async () => {
      if (user) {
        console.log("Syncing user with Convex:", user.id);
        try {
          await convex.mutation(api.users.syncUser, {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || "",
          });
          console.log("User synced successfully");
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    syncUserWithConvex();
  }, [user, convex]);

  const handleCreateTemplate = async () => {
    if (!templateName || !subject || !sender) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("Please sign in to create an email template");
      return;
    }

    setIsSubmitting(true);
    console.log(
      `Creating ${creationMethod === "ai" ? "AI-generated" : "manual"} email template with tone: ${tone}`
    );

    try {
      if (creationMethod === "ai") {
        setIsLoading(true);
        toast.info("Generating email template with AI...", { duration: 10000 });

        // Generate email template using AI
        const result = await generateEmailTemplate(
          templateName,
          subject,
          sender,
          tone
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to generate email template");
        }

        // Save the generated template to Convex
        const emailId = await convex.mutation(api.emails.createEmail, {
          name: templateName,
          subject,
          sender,
          recipient,
          elements: result.elements,
          htmlContent: result.htmlContent,
          userId: user.id,
          isAiGenerated: true,
          tone,
        });

        console.log("AI-generated email saved with ID:", emailId);
        toast.success("Email template generated successfully!");

        // Navigate to the editor with the generated template
        router.push(`/dashboard/editor?id=${emailId}`);
      } else {
        // Create an empty template for manual editing
        const emailId = await convex.mutation(api.emails.createEmail, {
          name: templateName,
          subject,
          sender,
          recipient,
          elements: [],
          htmlContent: "",
          userId: user.id,
          isAiGenerated: false,
          tone,
        });

        console.log("Empty email template created with ID:", emailId);
        toast.success("Email template created successfully!");

        // Navigate to the editor for manual creation
        router.push(`/dashboard/editor?id=${emailId}`);
      }
    } catch (error) {
      console.error("Error creating email template:", error);
      toast.error(error.message || "Failed to create email template");
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Email Template
          </h1>
          <p className="text-muted-foreground">
            Enter the basic information for your new email template.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="e.g., Welcome Email"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Welcome to Our Community!"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender">Sender</Label>
                <Input
                  id="sender"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient (Optional)</Label>
                <Input
                  id="recipient"
                  placeholder="recipient@example.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Email Tone</Label>
              <Select
                value={tone}
                onValueChange={setTone}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {tone === "professional" &&
                  "Clear, straightforward language suitable for business communications."}
                {tone === "friendly" &&
                  "Warm, approachable language that builds rapport with the recipient."}
                {tone === "formal" &&
                  "Traditional, respectful language for official or serious communications."}
                {tone === "casual" &&
                  "Relaxed, conversational language for informal communications."}
                {tone === "enthusiastic" &&
                  "Energetic, positive language that conveys excitement."}
                {tone === "urgent" &&
                  "Direct, action-oriented language that emphasizes immediacy."}
                {tone === "persuasive" &&
                  "Compelling language designed to influence the recipient's decisions."}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Creation Method</Label>
              <RadioGroup
                defaultValue="ai"
                value={creationMethod}
                onValueChange={setCreationMethod}
                className="flex flex-col space-y-3"
                disabled={isSubmitting}
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="ai" id="ai" />
                  <Label
                    htmlFor="ai"
                    className="flex items-center cursor-pointer"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Generate with AI
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label
                    htmlFor="manual"
                    className="flex items-center cursor-pointer"
                  >
                    <Edit3 className="mr-2 h-4 w-4 text-primary" />
                    Create from scratch
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild disabled={isSubmitting}>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button onClick={handleCreateTemplate} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLoading ? "Generating Template..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Template
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
