/**
 * Interface describing an event listener.
 */
export interface EventListener<T, O> {
  callback: (event: T) => void;
  options?: O;
}

/**
 * Event signal for subscribing to event signal events.
 */
export abstract class EventSignal<T, O = undefined> {
  listeners: EventListener<T, O>[] = [];

  constructor() {}

  /**
   * Number of listeners subscribed to this event.
   * @returns {number}
   */
  get size(): number {
    return this.listeners.length;
  }

  /**
   * Whether this event has no listeners.
   * @returns {boolean}
   */
  get isEmpty(): boolean {
    return this.listeners.length === 0;
  }

  /**
   * Subscribes to this event.
   * @param {(event: T) => void} callback
   * @param {O} options
   * @returns {void}
   */
  subscribe(callback: (event: T) => void, options?: O): (event: T) => void {
    this.listeners.push({ callback, options });
    return callback;
  }

  /**
   * Unsubscribes from this event.
   * @param {(event: T) => void} callback
   * @returns {void}
   */
  unsubscribe(callback: (event: T) => void): void {
    this.listeners = this.listeners.filter((fn) => fn.callback !== callback);
  }

  /**
   * Internal method.
   */
  apply(event: T): void {
    for (const fn of this.listeners) {
      try {
        fn.callback(event);
      } catch (err) {
        if (err instanceof Error) {
          return console.error(`Error while running ${this.constructor.name}:`, err.name, err.message, err.stack);
        }
        throw err;
      }
    }
  }
}
