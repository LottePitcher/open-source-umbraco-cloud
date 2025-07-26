export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Open Source Test My Extension Entrypoint",
    alias: "OpenSourceTest.MyExtension.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
