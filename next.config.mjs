// Optimized Next.js configuration for better performance

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  optimizeFonts: true,
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: [
      'firebase-admin',
      '@google-cloud/firestore',
      'google-auth-library',
      'gaxios',
      'google-gax',
      'genkit',
      '@genkit-ai/googleai',
      '@genkit-ai/core',
      '@genkit-ai/firebase',
      '@genkit-ai/google-cloud',
      'node-fetch',
      'google-logging-utils',
      'gcp-metadata',
      '@google-cloud/opentelemetry-resource-util'
    ]
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          { key: "Cache-Control", value: "public, max-age=60" }, // Cache API responses for 1 minute
          { key: "X-RateLimit-Limit", value: "100" },
          { key: "X-RateLimit-Window", value: "60" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    // Handle Node.js built-in modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        http2: false,
        child_process: false,
        worker_threads: false,
        // OpenTelemetry and gRPC related modules
        diagnostics_channel: false,
        dns: false,
        async_hooks: false,
        dgram: false,
        // Additional Node.js modules that might be needed
        util: false,
        buffer: false,
        events: false,
        // Node.js built-in modules with node: prefix
        'node:async_hooks': false,
        'node:buffer': false,
        'node:events': false,
        'node:fs': false,
        'node:https': false,
        'node:http': false,
        'node:path': false,
        'node:url': false,
        'node:util': false,
        'node:stream': false,
        'node:crypto': false,
        'node:os': false,
        'node:process': false,
        'node:querystring': false,
        'node:zlib': false,
      };

      // Add aliases to redirect problematic imports to empty modules
      config.resolve.alias = {
        ...config.resolve.alias,
        'genkit': false,
        '@genkit-ai/googleai': false,
        '@genkit-ai/core': false,
        '@genkit-ai/firebase': false,
        '@genkit-ai/google-cloud': false,
        'node-fetch': false,
        'google-logging-utils': false,
        'gcp-metadata': false,
        '@google-cloud/opentelemetry-resource-util': false,
      };
    }

    // Optimize module resolution for Firebase
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ensure Firebase modules are resolved correctly - using path resolution
      'firebase/app': 'firebase/app',
      'firebase/auth': 'firebase/auth',
      'firebase/firestore': 'firebase/firestore',
    };

    // Improve chunk splitting for Firebase modules
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'firebase',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }

    // Ignore specific warnings that are not critical
    config.ignoreWarnings = [
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      /require.extensions is not supported by webpack/,
      /A Node\.js API is used \(.*\) which is not supported in the Edge Runtime/,
      /Module not found: Can't resolve '@opentelemetry\/winston-transport'/,
      /Module not found: Can't resolve '@opentelemetry\/exporter-jaeger'/,
      // Add Node.js built-in modules to ignored warnings
      /Module not found: Can't resolve 'diagnostics_channel'/,
      /Module not found: Can't resolve 'dns'/,
      /Module not found: Can't resolve 'async_hooks'/,
      /Module not found: Can't resolve 'dgram'/,
      // Ignore node: protocol warnings
      /Module not found: Can't resolve 'node:async_hooks'/,
      /Module not found: Can't resolve 'node:buffer'/,
      /Module not found: Can't resolve 'node:events'/,
      /Module not found: Can't resolve 'node:fs'/,
      /Module not found: Can't resolve 'node:https'/,
      /Module not found: Can't resolve 'node:http'/,
      // Ignore Firebase-related warnings
      /Critical dependency: the request of a dependency is an expression/,
      /Can't resolve 'encoding'/,
    ];

    return config;
  },
  // Configure OpenTelemetry properly
  env: {
    OTEL_SDK_DISABLED: 'false',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'd1yjjnpx0p53s8.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'images-platform.99static.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.leonardo.ai'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;