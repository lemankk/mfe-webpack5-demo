import React from "react";
import loadjs from "loadjs";

export const loadJs = async (url) => {
  return new Promise((resolve) => {
    loadjs([url], {
      success: resolve,
    });
  });
};

function loadComponent(scope, module, filePath) {
//   console.log("[loadComponent:%s/%s] init ", scope, module);
  const _scope = moduleNameToWindowName(scope);
  return async () => {
    await loadJs(filePath + "remoteEntry.js");

    
    // console.log("[loadComponent:%s/%s] started", scope, module);
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[_scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    container.setPublicPath(filePath)
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  };
}

export const createRemoteComponent = (moduleName, filePath, varName) => {
  const Component = React.lazy(loadComponent(moduleName, "./index", filePath));

  return Component;
};

export const moduleNameToWindowName = (moduleName) => {
  let name = `${moduleName}`.replace(/[\@\/\-]+/g, "_");
  if (name.startsWith("_")) {
    name = name.substr(1);
  }
  return name;
};
