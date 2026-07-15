import { array, Infer, object, pattern, record, string } from "superstruct";

/** Superstruct schema for a changelog category. */
export const ChangelogCategorySchema = object({
  title: string(),
  list: array(string()),
});

/** Superstruct schema for a changelog release. */
export const ChangelogReleaseSchema = object({
  title: string(),
  date: pattern(string(), /^\d{4}-\d{2}-\d{2}$/),
  author: string(),
  categories: array(ChangelogCategorySchema),
});

/** Superstruct schema for a version-keyed changelog. */
export const ChangelogSchema = record(string(), ChangelogReleaseSchema);

/** Changelog category. */
export type ChangelogCategory = Infer<typeof ChangelogCategorySchema>;

/** Changelog release. */
export type ChangelogRelease = Infer<typeof ChangelogReleaseSchema>;

/** Version-keyed changelog. */
export type Changelog = Infer<typeof ChangelogSchema>;
