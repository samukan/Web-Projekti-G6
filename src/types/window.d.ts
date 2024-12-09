interface StatusTransitions {
  [key: string]: string[];
}

interface Window {
  statusTransitions?: StatusTransitions;
}
