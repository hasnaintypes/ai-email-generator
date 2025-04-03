"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Mail,
  FileText,
  Grid2X2,
  List,
} from "lucide-react";
import { format } from "date-fns";
import EmptyState from "./empty-state";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function EmailList({ emails, user, convex }) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);

  // Update filtered emails when search query or emails change
  useEffect(() => {
    if (!emails) {
      setFilteredEmails([]);
      return;
    }

    setFilteredEmails(
      emails.filter(
        (email) =>
          email.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [emails, searchQuery]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return format(date, "MMM d, yyyy");
  };

  const handleDeleteEmail = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        console.log(`Deleting email template: ${id}`);
        await convex.mutation(api.emails.deleteEmail, { id });

        // Update the local state to remove the deleted email
        setFilteredEmails(filteredEmails.filter((email) => email._id !== id));

        toast.success(`"${name}" has been deleted successfully.`);
      } catch (error) {
        console.error("Error deleting email:", error);
        toast.error("Failed to delete email template.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search emails..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-2 ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-2 ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
          <Button asChild>
            <Link href="/dashboard/create-email">
              <Plus className="mr-2 h-4 w-4" />
              New Email
            </Link>
          </Button>
        </div>
      </div>

      {filteredEmails.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEmails.map((email) => (
              <EmailCard
                key={email._id}
                email={email}
                formatDate={formatDate}
                onDelete={() => handleDeleteEmail(email._id, email.name)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Subject
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Updated
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map((email) => (
                  <TableRow key={email._id}>
                    <TableCell>
                      <div className="font-medium">{email.name}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {email.subject}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {email.subject}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(email.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(email.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                          asChild
                        >
                          <Link href={`/dashboard/editor?id=${email._id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            handleDeleteEmail(email._id, email.name)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      ) : (
        <EmptyState
          onCreateNew={() => (window.location.href = "/dashboard/create-email")}
        />
      )}
    </div>
  );
}

function EmailCard({ email, formatDate, onDelete }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/20 group">
      <CardHeader className="pb-3 relative">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{email.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {email.subject}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/editor?id=${email._id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Mail className="mr-1 h-4 w-4 text-primary/70" />
            <span className="line-clamp-1 font-medium">
              Subject: {email.subject}
            </span>
          </div>
          <div className="flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            <span>Created: {formatDate(email.createdAt)}</span>
          </div>
          {email.tone && (
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
              Tone: {email.tone.charAt(0).toUpperCase() + email.tone.slice(1)}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 px-6 py-3 mt-auto">
        <div className="flex w-full items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated: {formatDate(email.updatedAt)}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-primary hover:bg-primary/10"
              asChild
            >
              <Link href={`/dashboard/editor?id=${email._id}`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
