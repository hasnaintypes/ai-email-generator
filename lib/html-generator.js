export function generateHtmlFromElements(elements) {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    img {
      max-width: 100%;
      height: auto;
      border: 0;
    }
    .button {
      display: inline-block;
      text-decoration: none;
    }
    .column-container {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -10px;
    }
    .column {
      padding: 10px;
      box-sizing: border-box;
    }
    .column-1 {
      width: 100%;
    }
    .column-2 {
      width: 50%;
    }
    .column-3 {
      width: 33.333%;
    }
    .column-4 {
      width: 25%;
    }
    @media only screen and (max-width: 480px) {
      .mobile-responsive {
        width: 100% !important;
        height: auto !important;
      }
      .mobile-padding {
        padding: 10px !important;
      }
      .mobile-center {
        text-align: center !important;
      }
      .column {
        width: 100% !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0;">
<div class="container">
`;

  // Helper function to render a single element
  const renderElement = (element) => {
    let elementHtml = "";

    switch (element.type) {
      case "Button":
        elementHtml += `  <div style="${styleObjectToString(element.outerStyle)}">
    <a href="${element.url || "#"}" class="button" style="${styleObjectToString(element.style)}; display: inline-block; text-decoration: none;">${element.content || "Button"}</a>
  </div>
`;
        break;

      case "Text":
        elementHtml += `  <div style="${styleObjectToString(element.outerStyle)}">
    <div style="${styleObjectToString(element.style)}">${element.textarea || ""}</div>
  </div>
`;
        break;

      case "Image":
      case "Logo":
      case "LogoHeader":
        elementHtml += `  <div style="${styleObjectToString(element.outerStyle)}">
    <img src="${element.imageUrl || "/placeholder.svg"}" alt="${element.alt || "Image"}" style="${styleObjectToString(element.style)}" class="mobile-responsive" />
  </div>
`;
        break;

      case "Divider":
        elementHtml += `  <hr style="${styleObjectToString(element.style)}; border: none; border-top: 1px solid #e2e8f0;" />
`;
        break;

      case "SocialIcons":
        elementHtml += `  <div style="${styleObjectToString(element.outerStyle)}" class="mobile-center">
`;
        if (element.socialIcons && element.socialIcons.length > 0) {
          element.socialIcons.forEach((icon) => {
            elementHtml += `    <a href="${icon.url || "#"}" target="_blank" style="margin: 0 5px; display: inline-block;">
      <img src="${icon.icon || "/placeholder.svg"}" alt="Social Icon" width="${element.style?.width || 40}" height="${element.style?.height || 40}" />
    </a>
`;
          });
        }
        elementHtml += `  </div>
`;
        break;

      default:
        elementHtml += `  <!-- Unknown element type: ${element.type} -->
`;
    }

    return elementHtml;
  };

  elements.forEach((element) => {
    if (element.type === "column") {
      // Start flex container for columns
      html += `  <div class="column-container" style="margin-bottom: 20px;">
`;

      // Generate each column
      for (let i = 0; i < element.numOfCol; i++) {
        const columnClass = `column column-${element.numOfCol}`;
        html += `    <div class="${columnClass}">
`;

        // Check if there's content for this column
        const columnContent = element[i.toString()];
        if (columnContent) {
          html += renderElement(columnContent);
        } else {
          html += `      <!-- Empty column ${i + 1} -->
`;
        }

        html += `    </div>
`;
      }

      // Close flex container
      html += `  </div>
`;
    } else {
      // Regular element
      html += renderElement(element);
    }
  });

  html += `</div>
</body>
</html>`;

  return html;
}

function styleObjectToString(styleObj) {
  if (!styleObj) return "";
  return Object.entries(styleObj)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

      // Handle array values (take the first item)
      const styleValue = Array.isArray(value) ? value[0] : value;

      return `${kebabKey}: ${styleValue}`;
    })
    .join("; ");
}
