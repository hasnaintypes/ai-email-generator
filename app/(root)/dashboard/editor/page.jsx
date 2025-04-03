"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Edit,
  Menu,
  Settings,
  Save,
  Loader2,
  Code,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import elements from "@/constants/elements";
import ElementItem from "@/components/editor/element-item";
import DroppableArea from "@/components/editor/droppable-area";
import PropertyPanel from "@/components/editor/property-panel";
import { CopyButton } from "@/components/editor/copy-button";
import { generateHtmlFromElements } from "@/lib/html-generator";

import { Suspense } from "react";

export default function Editor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailId = searchParams.get("id");

  const [viewMode, setViewMode] = useState("editor"); // 'editor' or 'preview'
  const [emailTitle, setEmailTitle] = useState("Untitled Email");
  const [emailData, setEmailData] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [emailElements, setEmailElements] = useState([]);
  const [htmlContent, setHtmlContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSheet, setOpenSheet] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const titleInputRef = useRef(null);
  const [isDndReady, setIsDndReady] = useState(false);
  const previewIframeRef = useRef(null);

  const { user } = useUser();
  const convex = useConvex();

  // Fetch email data
  useEffect(() => {
    const fetchEmailData = async () => {
      if (!emailId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching email data for ID:", emailId);
        const data = await convex.query(api.emails.getEmailById, {
          id: emailId,
        });
        console.log("Email data loaded:", data);

        if (data) {
          setEmailData(data);
          setEmailTitle(data.name);
          setEmailElements(data.elements || []);
          setHtmlContent(data.htmlContent || "");
        } else {
          toast.error("Email template not found");
        }
      } catch (error) {
        console.error("Error fetching email data:", error);
        toast.error("Failed to load email template");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailData();
  }, [emailId, convex]);

  // Update HTML content when elements change
  useEffect(() => {
    if (emailElements.length > 0) {
      const newHtmlContent = generateHtmlFromElements(emailElements);
      setHtmlContent(newHtmlContent);
    }
  }, [emailElements]);

  // Check if viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Auto focus on title input  when editing

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // This ensures DnD is only initialized on the client side
    const initDnd = async () => {
      setIsDndReady(true);
    };

    initDnd();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveId(null);

    if (!over) return;

    // Handle dropping a new element
    if (active.id.startsWith("element-") && over.id === "droppable-area") {
      const elementType = active.id.replace("element-", "");
      const element = elements.find((el) => el.type === elementType);

      if (element) {
        const newElement = {
          ...element,
          id: `email-element-${Date.now()}`,
        };

        setEmailElements([...emailElements, newElement]);
        setSelectedElement(newElement);
      }
    }
    // Handle reordering existing elements
    else if (active.id.startsWith("email-") && over.id.startsWith("email-")) {
      const oldIndex = emailElements.findIndex((el) => el.id === active.id);
      const newIndex = emailElements.findIndex((el) => el.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setEmailElements(arrayMove(emailElements, oldIndex, newIndex));
      }
    }
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
    if (isMobile) {
      setOpenSheet("settings");
    }
  };

  const handleElementUpdate = (updatedElement) => {
    setEmailElements(
      emailElements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      )
    );
    setSelectedElement(updatedElement);
  };

  const handleElementDelete = (elementId) => {
    setEmailElements(emailElements.filter((el) => el.id !== elementId));
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };

  const moveElementUp = (elementId) => {
    const index = emailElements.findIndex((el) => el.id === elementId);
    if (index > 0) {
      setEmailElements(arrayMove(emailElements, index, index - 1));
    }
  };

  const moveElementDown = (elementId) => {
    const index = emailElements.findIndex((el) => el.id === elementId);
    if (index < emailElements.length - 1) {
      setEmailElements(arrayMove(emailElements, index, index + 1));
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!emailId) {
      toast.error("No email ID found");
      return;
    }

    setIsSaving(true);
    console.log("Saving email template:", emailTitle);

    try {
      await convex.mutation(api.emails.updateEmail, {
        id: emailId,
        name: emailTitle,
        elements: emailElements,
        htmlContent: htmlContent,
      });

      toast.success("Email template saved successfully");

      console.log("Email template saved successfully");
    } catch (error) {
      console.error("Error saving email template:", error);
      toast.error("Failed to save email template");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading email template...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="flex flex-col h-screen bg-muted/30">
        {/* Header */}
        <header className="border-b bg-background p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Draft /</span>
              <div
                className={`flex items-center ${isEditing ? "border rounded-md" : "hover:bg-muted/50 rounded-md px-2 py-1 cursor-pointer"}`}
                onClick={!isEditing ? handleTitleClick : undefined}
              >
                {isEditing ? (
                  <Input
                    ref={titleInputRef}
                    value={emailTitle}
                    onChange={(e) => setEmailTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    className="h-8 w-[200px] bg-background"
                  />
                ) : (
                  <div className="flex items-center">
                    <span className="text-base font-medium">{emailTitle}</span>
                    <Edit className="w-4 h-4 ml-2 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Code className="h-4 w-4" />
                  <span>HTML</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent cl a ssName="w-[600px] p-0" align="end">
                <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-t-md">
                  <span className="text-xs font-mono text-zinc-400">
                    HTML Code
                  </span>
                  <CopyButton value={htmlContent} />
                </div>
                <div className="bg-zinc-950 p-4 rounded-b-md max-h-[400px] overflow-auto">
                  <pre className="text-xs font-mono text-zinc-100 whitespace-pre-wrap">
                    {htmlContent}
                  </pre>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveTemplate}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Save Template</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </Button>

            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenSheet("elements")}
                className="md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </header>
        {/* Main Content with Tabs */};{" "}
        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
          className="flex-1 flex flex-col"
        >
          <div className="border-b bg-background px-4 py-2">
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="editor" className="flex items-center gap-1">
                <Edit className="h-3.5 w-3.5" />
                <span>Editor</span>
              </TabsTrigger>

              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="editor"
            className="flex-1 overflow-hidden m-0 p-0"
          >
            {isDndReady ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToWindowEdges]}
              >
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                  {/* Sidebar - Desktop */}
                  <div className="w-full md:w-64 border-r bg-background overflow-y-auto hidden md:block custom-scrollbar">
                    <div className="p-4">
                      <h3 className="font-medium text-sm mb-2">Elements</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {elements.map((element) => (
                          <ElementItem
                            key={`element-${element.type}`}
                            element={element}
                            id={`element-${element.type}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Main Canvas */}
                  <div className="flex-1 overflow-y-auto bg-muted/50 p-6 flex justify-center custom-scrollbar">
                    <div
                      className={`bg-white shadow-sm border w-[600px] min-h-[600px]`}
                    >
                      <SortableContext
                        items={emailElements.map((el) => el.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <DroppableArea
                          elements={emailElements}
                          onElementSelect={handleElementSelect}
                          onElementDelete={handleElementDelete}
                          onMoveUp={moveElementUp}
                          onMoveDown={moveElementDown}
                          selectedElementId={selectedElement?.id}
                        />
                      </SortableContext>

                      {emailElements.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 border-2 border-dashed m-4 rounded-md">
                          <div className="text-muted-foreground mb-2">
                            <div className="h-10 w-10 mx-auto mb-2 opacity-50 flex items-center justify-center border-2 border-dashed rounded-full">
                              <span className="text-lg">+</span>
                            </div>
                            <h3 className="font-medium">Add Elements</h3>
                          </div>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Drag and drop elements from the sidebar to start
                            building your email template
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Properties Panel - Desktop */}
                  {selectedElement && (
                    <div className="w-full md:w-72 border-l bg-background overflow-y-auto hidden md:block custom-scrollbar">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-medium">Settings</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedElement(null)}
                        >
                          Close
                        </Button>
                      </div>

                      <PropertyPanel
                        element={selectedElement}
                        onUpdate={handleElementUpdate}
                      />
                    </div>
                  )}
                  ;{/* Drag Overlay */}
                  <DragOverlay>
                    {activeId && activeId.startsWith("element-") && (
                      <div className="bg-background border rounded-md p-3 shadow-md opacity-80 w-48">
                        {() => {
                          const elementType = activeId.replace("element-", "");
                          const element = elements.find(
                            (el) => el.type === elementType
                          );
                          if (element) {
                            return (
                              <div className="flex items-center gap-2">
                                <element.icon className="h-4 w-4" />
                                <span>{element.label}</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      </div>
                    )}
                  </DragOverlay>
                </div>
              </DndContext>
            ) : (
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-pulse text-center">
                    <div className="h-8 w-32 bg-muted rounded mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading editor...</p>
                  </div>
                </div>
                ;
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="preview"
            className="flex-1 overflow-hidden m-0 p-0"
          >
            <div className="h-full w-full flex justify-center bg-muted/50 p-6 overflow-auto">
              <div className="bg-white shadow-sm border w-[600px] h-full overflow-auto">
                {htmlContent ? (
                  <iframe
                    ref={previewIframeRef}
                    srcDoc={htmlContent}
                    title="Email Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="text-muted-foreground mb-2">
                      <Eye className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <h3 className="font-medium">No content to preview</h3>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Add elements to your email template to see a preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {/* Mobile Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around">
            <Button
              variant={openSheet === "elements" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setOpenSheet(openSheet === "elements" ? "" : "elements")
              }
              className="flex-1 mx-1"
            >
              <span className="mr-2">+</span>
              Elements
            </Button>
            <Button
              variant={openSheet === "settings" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setOpenSheet(openSheet === "settings" ? "" : "settings")
              }
              className="flex-1 mx-1"
              disabled={!selectedElement}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
        {/* Elements Sheet for Mobile */}
        <Sheet
          open={openSheet === "elements"}
          onOpenChange={(open) => !open && setOpenSheet("")}
        >
          <SheetContent side="left" className="w-full sm:max-w-md p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Elements</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-20 custom-scrollbar">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {elements.map((element) => (
                    <ElementItem
                      key={`element-${element.type}`}
                      element={element}
                      id={`element-${element.type}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {/* Settings Sheet for Mobile */}
        <Sheet
          open={openSheet === "settings"}
          onOpenChange={(open) => !open && setOpenSheet("")}
        >
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Element Settings</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-20 custom-scrollbar">
              <PropertyPanel
                element={selectedElement}
                onUpdate={handleElementUpdate}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
  );
}


export default function EditorPage() {
 return (
    <Suspense>
      <Editor />
    </Suspense>
  )
}
