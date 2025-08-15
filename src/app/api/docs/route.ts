import { NextRequest, NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/api-docs/openapi-spec';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const docsLogger = logger.child({
    component: 'api_docs',
    requestId: request.headers.get('x-request-id') || `docs_${Date.now()}`
  });

  try {
    const acceptHeader = request.headers.get('accept') || '';
    const format = request.nextUrl.searchParams.get('format');

    docsLogger.info('API documentation requested', {
      acceptHeader,
      format,
      userAgent: request.headers.get('user-agent')
    });

    // Return JSON format by default or if specifically requested
    if (format === 'json' || acceptHeader.includes('application/json')) {
      return NextResponse.json(openApiSpec, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Return YAML format if requested
    if (format === 'yaml' || acceptHeader.includes('application/yaml') || acceptHeader.includes('text/yaml')) {
      const yaml = convertToYaml(openApiSpec);
      
      return new NextResponse(yaml, {
        headers: {
          'Content-Type': 'application/yaml',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Return HTML documentation page by default
    const html = generateHtmlDocs();
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      }
    });

  } catch (error) {
    docsLogger.error('Failed to serve API documentation', { error });

    return NextResponse.json(
      { 
        error: 'Failed to generate API documentation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Simple YAML converter (basic implementation)
function convertToYaml(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      yaml += `${spaces}${key}: null\n`;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      yaml += convertToYaml(value, indent + 1);
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object') {
          yaml += `${spaces}  -\n`;
          yaml += convertToYaml(item, indent + 2);
        } else {
          yaml += `${spaces}  - ${JSON.stringify(item)}\n`;
        }
      }
    } else {
      yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
    }
  }

  return yaml;
}

// Generate HTML documentation page
function generateHtmlDocs(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${openApiSpec.info.title} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
        .swagger-ui .topbar {
            background-color: #1f2937;
        }
        .swagger-ui .topbar .download-url-wrapper .download-url-button {
            background-color: #3b82f6;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-standalone-preset.js"></script>
    <script>
    window.onload = function() {
        const ui = SwaggerUIBundle({
            url: '/api/docs?format=json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
            ],
            plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            validatorUrl: null,
            tryItOutEnabled: true,
            requestInterceptor: function(request) {
                // Add any global headers here
                return request;
            },
            responseInterceptor: function(response) {
                // Handle responses globally here
                return response;
            }
        });
    };
    </script>
</body>
</html>
  `;
}