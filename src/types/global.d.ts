declare global {
  interface Window {
    statusTransitions: {
      [key: string]: string[];
    };
  }
}

export {};
