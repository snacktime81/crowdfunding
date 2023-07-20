export {}

declare global {
  interface CError extends Error {
    status?: number;
  }
}


