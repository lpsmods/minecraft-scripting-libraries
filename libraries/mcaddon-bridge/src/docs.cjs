// Keep the native dynamic import intact when just-scripts loads this shim through ts-node's CommonJS hook.
const loadDocs = () => Function("return import('./docs.js')")();

exports.generateAddonDocs = (options) => loadDocs().then(({ generateAddonDocs }) => generateAddonDocs(options));
exports.addonDocsTask = (options = {}) => () => exports.generateAddonDocs(options);
