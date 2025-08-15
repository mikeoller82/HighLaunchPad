// Server-side instrumentation to handle global polyfills
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Define self for server-side to prevent "self is not defined" errors
    if (typeof (globalThis as any).self === 'undefined') {
      (globalThis as any).self = globalThis;
    }
    
    // Polyfill for atob and btoa
    if (typeof (global as any).atob === 'undefined') {
      (global as any).atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
    }
    if (typeof (global as any).btoa === 'undefined') {
      (global as any).btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
    }

    if (typeof (global as any).window === 'undefined') {
      (global as any).window = {
        ...global,
        location: {
          protocol: 'http:',
          hostname: 'localhost',
          port: '3000',
          host: 'localhost:3000',
          origin: 'http://localhost:3000',
          href: 'http://localhost:3000',
          pathname: '/',
          search: '',
          hash: '',
          assign: () => {},
          replace: () => {},
          reload: () => {},
          toString: () => 'http://localhost:3000'
        },
        history: {
          pushState: () => {},
          replaceState: () => {},
          back: () => {},
          forward: () => {},
          go: () => {},
          length: 1,
          state: null
        },
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
        localStorage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null
        },
        sessionStorage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null
        },
        innerWidth: 1024,
        innerHeight: 768,
        outerWidth: 1024,
        outerHeight: 768,
        screen: {
          width: 1024,
          height: 768,
          availWidth: 1024,
          availHeight: 768
        }
      };
    }
    if (typeof (global as any).document === 'undefined') {
      (global as any).document = {
        createElement: () => ({
          setAttribute: () => {},
          getAttribute: () => null,
          appendChild: () => {},
          removeChild: () => {},
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => {}
          }
        }),
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementsByTagName: () => [],
        getElementsByClassName: () => [],
        addEventListener: () => {},
        removeEventListener: () => {},
        createTextNode: () => ({ textContent: '' }),
        body: {
          appendChild: () => {},
          removeChild: () => {},
          style: {}
        },
        head: {
          appendChild: () => {},
          removeChild: () => {},
          style: {}
        }
      };
    }
    if (typeof (global as any).navigator === 'undefined') {
      (global as any).navigator = {
        userAgent: 'node',
        platform: 'node',
        language: 'en-US',
        languages: ['en-US'],
        onLine: true
      };
    }
  }
}