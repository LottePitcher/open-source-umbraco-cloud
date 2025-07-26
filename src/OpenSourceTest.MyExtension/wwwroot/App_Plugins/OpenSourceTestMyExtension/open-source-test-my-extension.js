const n = [
  {
    name: "Open Source Test My Extension Entrypoint",
    alias: "OpenSourceTest.MyExtension.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-DSfFzdHl.js")
  }
], e = [
  {
    name: "Open Source Test My Extension Dashboard",
    alias: "OpenSourceTest.MyExtension.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-xGdjJiCG.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], t = [
  ...n,
  ...e
];
export {
  t as manifests
};
//# sourceMappingURL=open-source-test-my-extension.js.map
