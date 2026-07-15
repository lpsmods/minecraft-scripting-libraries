import { behaviorPackManifest, resourcePackManifest } from "../builders";
import { BehaviorPack, type PackCreateOptions, type PackEmitOptions, ResourcePack } from "./pack";

/** Options for creating both packs in an add-on. */
export type AddOnCreateOptions = {
  behaviorPack: PackCreateOptions;
  resourcePack: PackCreateOptions;
};

/** Directories containing both packs in an add-on. */
export type AddOnDirectories = {
  behaviorPack: string;
  resourcePack: string;
};

/**
 * Collection of the behavior pack and resource pack that make up an add-on.
 */
export class AddOn {
  constructor(
    public readonly behaviorPack: BehaviorPack = new BehaviorPack(),
    public readonly resourcePack: ResourcePack = new ResourcePack(),
  ) {}

  /**
   * Creates an add-on with mutually linked behavior and resource pack manifests.
   */
  static create(options: AddOnCreateOptions): AddOn {
    const behavior = options.behaviorPack;
    const resource = options.resourcePack;
    const behaviorVersion = behavior.version ?? [1, 0, 0];
    const resourceVersion = resource.version ?? [1, 0, 0];

    const behaviorManifest = behaviorPackManifest(
      behavior.name ?? "",
      behavior.packUuid ?? "",
      behavior.moduleUuid ?? "",
      behaviorVersion,
    )
      .description(behavior.description ?? "")
      .dependency(resource.packUuid ?? "", resourceVersion)
      .build();
    const resourceManifest = resourcePackManifest(
      resource.name ?? "",
      resource.packUuid ?? "",
      resource.moduleUuid ?? "",
      resourceVersion,
    )
      .description(resource.description ?? "")
      .dependency(behavior.packUuid ?? "", behaviorVersion)
      .build();

    return new AddOn(new BehaviorPack(behaviorManifest), new ResourcePack(resourceManifest));
  }

  /**
   * Opens both packs and returns them as an add-on.
   */
  static open(directories: AddOnDirectories, validate = false): AddOn {
    return new AddOn().open(directories, validate);
  }

  /**
   * Opens both packs from their respective directories.
   */
  open(directories: AddOnDirectories, validate = false): this {
    this.behaviorPack.open(directories.behaviorPack, validate);
    this.resourcePack.open(directories.resourcePack, validate);
    return this;
  }

  /**
   * Writes both packs to their respective output directories.
   */
  emit(directories: AddOnDirectories, options: PackEmitOptions = {}): void {
    this.behaviorPack.emit(directories.behaviorPack, options);
    this.resourcePack.emit(directories.resourcePack, options);
  }
}
