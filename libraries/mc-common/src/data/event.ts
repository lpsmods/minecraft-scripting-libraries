import { DataStorage } from "../data";
import { EventSignal } from "../event";

/**
 * Event payload for data callbacks.
 */
export abstract class DataEvent {
  constructor(store: DataStorage, propertyName?: string) {
    this.store = store;
    this.propertyName = propertyName;
  }

  readonly store: DataStorage;
  readonly propertyName: string | undefined;
}

/**
 * Event payload for read data callbacks.
 */
export class ReadDataEvent extends DataEvent {}

/**
 * Event payload for write data callbacks.
 */
export class WriteDataEvent extends DataEvent {}

/**
 * Event payload for delete data callbacks.
 */
export class DeleteDataEvent extends DataEvent {}

/**
 * Event signal for subscribing to read data events.
 */
export class ReadDataEventSignal extends EventSignal<ReadDataEvent> {}

/**
 * Event signal for subscribing to write data events.
 */
export class WriteDataEventSignal extends EventSignal<WriteDataEvent> {}

/**
 * Event signal for subscribing to delete data events.
 */
export class DeleteDataEventSignal extends EventSignal<DeleteDataEvent> {}

/**
 * Provides data storage events behavior.
 */
export class DataStorageEvents {
  private constructor() {}

  /**
   * This event fires when data is read from DataStorage.
   * @eventProperty
   */
  static readonly readData = new ReadDataEventSignal();

  /**
   * This event fires when data is written to DataStorage.
   * @eventProperty
   */
  static readonly writeData = new WriteDataEventSignal();

  /**
   * This event fires when data is removed from DataStorage.
   * @eventProperty
   */
  static readonly deleteData = new DeleteDataEventSignal();
}
