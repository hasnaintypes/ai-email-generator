"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Sparkles, Edit3, Save } from "lucide-react";
import Link from "next/link";

export default function CreateEmailPage() {
  const [creationMethod, setCreationMethod] = useState("ai");

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
              <Input id="name" placeholder="e.g., Welcome Email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Welcome to Our Community!"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender">Sender</Label>
                <Input id="sender" defaultValue="user@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient (Optional)</Label>
                <Input id="recipient" placeholder="recipient@example.com" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Creation Method</Label>
              <RadioGroup
                defaultValue="ai"
                onValueChange={setCreationMethod}
                className="flex flex-col space-y-3"
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
          <Button variant="outline" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/editor">
              <Save className="mr-2 h-4 w-4" />
              Create Template
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
