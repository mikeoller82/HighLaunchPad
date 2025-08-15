// Server-side polyfill for browser globals
if (typeof global !== 'undefined') {
  if (typeof global.self === 'undefined') {
    global.self = global;
  }
  if (typeof global.window === 'undefined') {
    global.window = global;
  }
  if (typeof global.document === 'undefined') {
    global.document = {};
  }
  if (typeof global.navigator === 'undefined') {
    global.navigator = { userAgent: 'node' };
  }
}