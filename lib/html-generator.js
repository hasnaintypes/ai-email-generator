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
    .column {
      display: inline-block;
      vertical-align: top;
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
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .mobile-hide {
        display: none !important;
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
    <a href="${element.url}" class="button" style="${styleObjectToString(element.style)}; display: inline-block; text-decoration: none;">${element.content}</a>
  </div>
`;
        break;

      case "Text":
        elementHtml += `  <div style="${styleObjectToString(element.outerStyle)}">
    <div style="${styleObjectToString(element.style)}">${element.textarea}</div>
  </div>
`;
        break;

      case "Image":
      case "Logo":
      case "LogoHeader":
        elementHtml += `  <div style="${styleObjectToString(element.outerStyle)}">
    <img src="${element.imageUrl}" alt="${element.alt}" style="${styleObjectToString(element.style)}" class="mobile-responsive" />
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
        element.socialIcons.forEach((icon) => {
          elementHtml += `    <a href="${icon.url || "#"}" target="_blank" style="margin: 0 5px; display: inline-block;">
      <img src="${icon.icon}" alt="Social Icon" width="${element.style.width}" height="${element.style.height}" />
    </a>
`;
        });
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
      // Start table for columns
      html += `  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
    <tr>
`;
      // Calculate column width
      const colWidth = Math.floor(100 / element.numOfCol);

      // Generate each column
      for (let i = 0; i < element.numOfCol; i++) {
        html += `      <td class="column mobile-stack" width="${colWidth}%" style="padding: 10px; vertical-align: top;">
`;

        // Add column content if available
        if (
          element.columns &&
          element.columns[i] &&
          element.columns[i].length > 0
        ) {
          element.columns[i].forEach((colElement) => {
            html += renderElement(colElement);
          });
        } else {
          html += `        <!-- Empty column ${i + 1} -->
`;
        }

        html += `      </td>
`;
      }

      // Close table
      html += `    </tr>
  </table>
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
      return `${kebabKey}: ${value}`;
    })
    .join("; ");
}
