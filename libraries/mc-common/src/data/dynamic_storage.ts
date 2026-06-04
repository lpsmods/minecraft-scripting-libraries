import { Vector3 } from "@minecraft/server";
import { DataStorageOptions, VersionedDataStorage } from "./data_storage";

/**
 * Provides dynamic storage behavior.
 */
export class DynamicStorage {
  readonly store: VersionedDataStorage;

  constructor(rootId: string, formatVersion?: number, options?: DataStorageOptions) {
    this.store = new VersionedDataStorage(rootId, formatVersion, options);
  }

  /**
   * @remarks
   * Clears all dynamic properties that have been set on this
   * block.
   *
   */
  clearDynamicProperties(): void {
    this.store.clear();
  }

  /**
   * @remarks
   * Returns a property value.
   *
   * @param identifier
   * The property identifier.
   * @returns
   * Returns the value for the property, or undefined if the
   * property has not been set.
   */
  getDynamicProperty(identifier: string): boolean | number | string | Vector3 | undefined {
    return this.store.get(identifier);
  }

  /**
   * @remarks
   * Returns the available set of dynamic property identifiers
   * that have been used on this entity.
   *
   * @returns
   * A string array of the dynamic properties set on this entity.
   */
  getDynamicPropertyIds(): string[] {
    return this.store.keys();
  }

  /**
   * @remarks
   * Returns the total size, in bytes, of all the dynamic
   * properties that are currently stored for this entity. This
   * includes the size of both the key and the value.  This can
   * be useful for diagnosing performance warning signs - if, for
   * example, an entity has many megabytes of associated dynamic
   * properties, it may be slow to load on various devices.
   *
   */
  getDynamicPropertyTotalByteCount(): number {
    return this.store.getSize();
  }

  /**
   * @remarks
   * Sets multiple dynamic properties with specific values.
   *
   * @param values
   * A Record of key value pairs of the dynamic properties to
   * set. If the data value is null, it will remove that property
   * instead.
   * @throws This function can throw errors.
   *
   * {@link minecraftcommon.ArgumentOutOfBoundsError}
   *
   * {@link minecraftcommon.UnsupportedFunctionalityError}
   */
  setDynamicProperties(values: Record<string, boolean | number | string | Vector3 | undefined>): void {
    Object.entries(values).forEach(([k, v]) => this.store.set(k, v));
  }

  /**
   * @remarks
   * Sets a specified property to a value.
   *
   * @param identifier
   * The property identifier.
   * @param value
   * Data value of the property to set. If the value is null, it
   * will remove the property instead.
   *
   * {@link minecraftcommon.ArgumentOutOfBoundsError}
   *
   * {@link minecraftcommon.UnsupportedFunctionalityError}
   */
  setDynamicProperty(identifier: string, value?: boolean | number | string | Vector3): void {
    this.store.set(identifier, value);
  }
}
