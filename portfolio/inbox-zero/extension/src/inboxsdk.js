/**
 * InboxSDK shim — placeholder for the InboxSDK loader.
 *
 * The content.js in this extension uses direct DOM manipulation instead of
 * InboxSDK for the initial release to avoid bundler complexity and the
 * InboxSDK App ID registration requirement.
 *
 * To upgrade to InboxSDK later:
 *   1. Register at https://register.inboxsdk.com for a free App ID
 *   2. npm install @inboxsdk/core
 *   3. Bundle with webpack/rollup and replace this file + content.js
 *
 * This file is intentionally empty — content.js handles everything directly.
 */
