type Listener = (data: string) => void;

class TerminalEventEmitter {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(data: string) {
    this.listeners.forEach(listener => listener(data));
  }
}

export const terminalEventEmitter = new TerminalEventEmitter();
