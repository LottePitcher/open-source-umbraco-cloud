export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Open Source Test My Extension Dashboard",
    alias: "OpenSourceTest.MyExtension.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
    ],
  },
];
