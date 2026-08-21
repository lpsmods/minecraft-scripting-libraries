---
"@lpsmods/mcaddon-bridge": minor
---

Improve bridge reliability and API coverage with request timeouts, response routing, packet validation, typed protocol messages, structured errors, async bridge calls, version negotiation, authorization hooks, descriptor enforcement, and lifecycle controls.

Fix connection response handling, falsy packet responses, listener cleanup, the `has()` return type, and `enableDocs: false`. Existing `connect(addonId, version?)` calls and the legacy `writeable` descriptor spelling remain supported.
