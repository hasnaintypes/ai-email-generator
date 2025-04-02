"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, AlignCenter, AlignRight, Bold } from "lucide-react";

export default function PropertyPanel({ element, onUpdate }) {
  const handleStyleChange = (property, value) => {
    const updatedElement = {
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    };
    onUpdate(updatedElement);
  };

  const handleOuterStyleChange = (property, value) => {
    const updatedElement = {
      ...element,
      outerStyle: {
        ...element.outerStyle,
        [property]: value,
      },
    };
    onUpdate(updatedElement);
  };

  const handleContentChange = (property, value) => {
    const updatedElement = {
      ...element,
      [property]: value,
    };
    onUpdate(updatedElement);
  };

  // Text element specific content
  if (element.type === "Text") {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Text Area</Label>
          <Textarea
            value={element.textarea}
            onChange={(e) => handleContentChange("textarea", e.target.value)}
            className="min-h-[120px] resize-y"
            placeholder="Enter your text here..."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Text Align</Label>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none ${element.style.textAlign === "left" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("textAlign", "left")}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none ${element.style.textAlign === "center" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("textAlign", "center")}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none ${element.style.textAlign === "right" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("textAlign", "right")}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={element.style.backgroundColor}
              onChange={(e) =>
                handleStyleChange("backgroundColor", e.target.value)
              }
              className="w-10 h-10 rounded-md border cursor-pointer"
            />
            <span className="text-sm">{element.style.backgroundColor}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Text Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={element.style.color}
              onChange={(e) => handleStyleChange("color", e.target.value)}
              className="w-10 h-10 rounded-md border cursor-pointer"
            />
            <span className="text-sm">{element.style.color}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Size</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={Number.parseInt(element.style.fontSize)}
              onChange={(e) =>
                handleStyleChange("fontSize", `${e.target.value}px`)
              }
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
            <input
              type="range"
              min="8"
              max="72"
              value={Number.parseInt(element.style.fontSize)}
              onChange={(e) =>
                handleStyleChange("fontSize", `${e.target.value}px`)
              }
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Text Transform</Label>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none text-xs ${element.style.textTransform === "none" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("textTransform", "none")}
            >
              Aa
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none text-xs ${element.style.textTransform === "uppercase" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("textTransform", "uppercase")}
            >
              AA
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none text-xs ${element.style.textTransform === "lowercase" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("textTransform", "lowercase")}
            >
              aa
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none text-xs ${element.style.textTransform === "capitalize" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("textTransform", "capitalize")}
            >
              Aa
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Padding</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={Number.parseInt(element.style.padding) || 0}
              onChange={(e) =>
                handleStyleChange("padding", `${e.target.value}px`)
              }
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
            <input
              type="range"
              min="0"
              max="50"
              value={Number.parseInt(element.style.padding) || 0}
              onChange={(e) =>
                handleStyleChange("padding", `${e.target.value}px`)
              }
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Weight</Label>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none ${element.style.fontWeight === "normal" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("fontWeight", "normal")}
            >
              Normal
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-none ${element.style.fontWeight === "bold" ? "bg-muted" : ""}`}
              onClick={() => handleStyleChange("fontWeight", "bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Outer Style</h3>
          {element.outerStyle && element.outerStyle.justifyContent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alignment</Label>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-start" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-start")
                  }
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "center" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "center")
                  }
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-end" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-end")
                  }
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Button element specific content
  if (element.type === "Button") {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Button Text</Label>
          <Input
            value={element.content}
            onChange={(e) => handleContentChange("content", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Button URL</Label>
          <Input
            value={element.url}
            onChange={(e) => handleContentChange("url", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={element.style.backgroundColor}
              onChange={(e) =>
                handleStyleChange("backgroundColor", e.target.value)
              }
              className="w-10 h-10 rounded-md border cursor-pointer"
            />
            <span className="text-sm">{element.style.backgroundColor}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Text Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={element.style.color}
              onChange={(e) => handleStyleChange("color", e.target.value)}
              className="w-10 h-10 rounded-md border cursor-pointer"
            />
            <span className="text-sm">{element.style.color}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Border Radius</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={Number.parseInt(element.style.borderRadius) || 0}
              onChange={(e) =>
                handleStyleChange("borderRadius", `${e.target.value}px`)
              }
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
            <input
              type="range"
              min="0"
              max="50"
              value={Number.parseInt(element.style.borderRadius) || 0}
              onChange={(e) =>
                handleStyleChange("borderRadius", `${e.target.value}px`)
              }
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Padding</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={Number.parseInt(element.style.padding) || 0}
              onChange={(e) =>
                handleStyleChange("padding", `${e.target.value}px`)
              }
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
            <input
              type="range"
              min="0"
              max="50"
              value={Number.parseInt(element.style.padding) || 0}
              onChange={(e) =>
                handleStyleChange("padding", `${e.target.value}px`)
              }
              className="flex-1"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Outer Style</h3>
          {element.outerStyle && element.outerStyle.justifyContent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alignment</Label>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-start" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-start")
                  }
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "center" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "center")
                  }
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-end" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-end")
                  }
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Image, Logo, or LogoHeader element specific content
  if (
    element.type === "Image" ||
    element.type === "Logo" ||
    element.type === "LogoHeader"
  ) {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Image URL</Label>
          <Input
            value={element.imageUrl}
            onChange={(e) => handleContentChange("imageUrl", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Alt Text</Label>
          <Input
            value={element.alt}
            onChange={(e) => handleContentChange("alt", e.target.value)}
          />
        </div>

        {element.url && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Link URL</Label>
            <Input
              value={element.url}
              onChange={(e) => handleContentChange("url", e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium">Width</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={element.style.width}
              onChange={(e) => handleStyleChange("width", e.target.value)}
              className="w-20"
            />
            <input
              type="range"
              min="10"
              max="100"
              value={Number.parseInt(element.style.width) || 50}
              onChange={(e) => handleStyleChange("width", `${e.target.value}%`)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Border Radius</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={Number.parseInt(element.style.borderRadius) || 0}
              onChange={(e) =>
                handleStyleChange("borderRadius", `${e.target.value}px`)
              }
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
            <input
              type="range"
              min="0"
              max="50"
              value={Number.parseInt(element.style.borderRadius) || 0}
              onChange={(e) =>
                handleStyleChange("borderRadius", `${e.target.value}px`)
              }
              className="flex-1"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Outer Style</h3>
          {element.outerStyle && element.outerStyle.justifyContent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alignment</Label>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-start" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-start")
                  }
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "center" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "center")
                  }
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-end" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-end")
                  }
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // SocialIcons element specific content
  if (element.type === "SocialIcons") {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Social Icons</Label>
          {element.socialIcons.map((icon, index) => (
            <div key={index} className="flex gap-2 items-center">
              <img
                src={icon.icon || "/placeholder.svg"}
                alt="icon"
                className="w-6 h-6"
              />
              <Input
                value={icon.url}
                onChange={(e) => {
                  const updatedIcons = [...element.socialIcons];
                  updatedIcons[index].url = e.target.value;
                  handleContentChange("socialIcons", updatedIcons);
                }}
                placeholder="URL"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Icon Size</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={element.style.width}
              onChange={(e) => {
                handleStyleChange("width", Number.parseInt(e.target.value));
                handleStyleChange("height", Number.parseInt(e.target.value));
              }}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
            <input
              type="range"
              min="16"
              max="64"
              value={element.style.width || 40}
              onChange={(e) => {
                handleStyleChange("width", Number.parseInt(e.target.value));
                handleStyleChange("height", Number.parseInt(e.target.value));
              }}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Gap Between Icons</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={element.outerStyle.gap}
              onChange={(e) =>
                handleOuterStyleChange("gap", Number.parseInt(e.target.value))
              }
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">px</span>
            <input
              type="range"
              min="0"
              max="50"
              value={element.outerStyle.gap || 15}
              onChange={(e) =>
                handleOuterStyleChange("gap", Number.parseInt(e.target.value))
              }
              className="flex-1"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Outer Style</h3>
          {element.outerStyle && element.outerStyle.justifyContent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alignment</Label>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-start" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-start")
                  }
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "center" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "center")
                  }
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 rounded-none ${element.outerStyle.justifyContent === "flex-end" ? "bg-muted" : ""}`}
                  onClick={() =>
                    handleOuterStyleChange("justifyContent", "flex-end")
                  }
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default property panel for other elements
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Element Type</Label>
        <div className="p-2 bg-muted rounded-md text-sm">{element.type}</div>
      </div>

      {element.style &&
        Object.keys(element.style).map((key) => (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </Label>
            <Input
              value={element.style[key]}
              onChange={(e) => handleStyleChange(key, e.target.value)}
            />
          </div>
        ))}
    </div>
  );
}
