---
"@lpsmods/mc-build": patch
---

Accept manifest header pack_scope values world, global, and any during validation and version synchronization. Include the underlying validation error in sync-manifests failures so task runners display the offending field.
