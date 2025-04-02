"use client";

import { useState } from "react";
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
  Eye,
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

export default function EmailList({ emails, user }) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = emails.filter(
    (email) =>
      email.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
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
              <EmailCard key={email.id} email={email} formatDate={formatDate} />
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
                  <TableRow key={email.id}>
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
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
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

function EmailCard({ email, formatDate }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{email.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {email.description}
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
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
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
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-primary hover:bg-primary/10"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
