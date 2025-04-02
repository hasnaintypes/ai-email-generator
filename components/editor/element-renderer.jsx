"use client";

import Image from "next/image";

export default function ElementRenderer({ element }) {
  switch (element.type) {
    case "Button":
      return (
        <div style={element.outerStyle}>
          <button style={element.style}>{element.content}</button>
        </div>
      );

    case "Text":
      return (
        <div style={element.outerStyle}>
          <div style={element.style}>{element.textarea}</div>
        </div>
      );

    case "Image":
      return (
        <div style={element.outerStyle}>
          <Image
            src={element.imageUrl || "/placeholder.svg"}
            alt={element.alt}
            width={400}
            height={300}
            style={element.style}
          />
        </div>
      );

    case "Logo":
    case "LogoHeader":
      return (
        <div style={element.outerStyle}>
          <Image
            src={element.imageUrl || "/placeholder.svg"}
            alt={element.alt}
            width={200}
            height={100}
            style={element.style}
          />
        </div>
      );

    case "Divider":
      return (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e2e8f0",
            margin: "10px 0",
            ...element.style,
          }}
        />
      );

    case "SocialIcons":
      return (
        <div style={element.outerStyle} className="flex justify-center py-2">
          {element.socialIcons.map((icon, index) => (
            <a
              key={index}
              href={icon.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={icon.icon || "/placeholder.svg"}
                alt="Social Icon"
                width={element.style.width}
                height={element.style.height}
                style={{ margin: "0 5px" }}
              />
            </a>
          ))}
        </div>
      );

    case "column":
      return (
        <div className="border-2 border-dashed border-muted-foreground/20 p-2 m-2 rounded-md">
          <div className={`grid grid-cols-${element.numOfCol} gap-4`}>
            {Array(element.numOfCol)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="min-h-[100px] border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">
                    Drop elements here
                  </span>
                </div>
              ))}
          </div>
        </div>
      );

    default:
      return <div>Unknown element type: {element.type}</div>;
  }
}
