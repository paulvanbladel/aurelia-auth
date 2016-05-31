System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "es7.decorators",
      "es7.classProperties"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "aurelia-auth/*": "dist/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
     }
});
