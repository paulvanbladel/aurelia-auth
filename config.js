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
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-fetch-client": "github:aurelia/fetch-client@0.4.0",
    "aurelia-framework": "github:aurelia/framework@0.18.0",
    "aurelia-http-client": "github:aurelia/http-client@0.13.0",
    "aurelia-router": "github:aurelia/router@0.14.0",
    "babel": "npm:babel-core@5.8.23",
    "babel-runtime": "npm:babel-runtime@5.8.20",
    "core-js": "npm:core-js@0.9.18",
    "github:aurelia/binding@0.11.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.10.0",
      "aurelia-pal": "github:aurelia/pal@0.3.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.9.0",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/dependency-injection@0.12.0": {
      "aurelia-logging": "github:aurelia/logging@0.9.0",
      "aurelia-metadata": "github:aurelia/metadata@0.10.0",
      "aurelia-pal": "github:aurelia/pal@0.3.0",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/event-aggregator@0.10.0": {
      "aurelia-logging": "github:aurelia/logging@0.9.0"
    },
    "github:aurelia/fetch-client@0.4.0": {
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/framework@0.18.0": {
      "aurelia-binding": "github:aurelia/binding@0.11.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.12.0",
      "aurelia-loader": "github:aurelia/loader@0.11.0",
      "aurelia-logging": "github:aurelia/logging@0.9.0",
      "aurelia-metadata": "github:aurelia/metadata@0.10.0",
      "aurelia-pal": "github:aurelia/pal@0.3.0",
      "aurelia-path": "github:aurelia/path@0.11.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.9.0",
      "aurelia-templating": "github:aurelia/templating@0.17.1",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/http-client@0.13.0": {
      "aurelia-pal": "github:aurelia/pal@0.3.0",
      "aurelia-path": "github:aurelia/path@0.11.0",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/loader@0.11.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.10.0",
      "aurelia-path": "github:aurelia/path@0.11.0"
    },
    "github:aurelia/metadata@0.10.0": {
      "aurelia-pal": "github:aurelia/pal@0.3.0",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/route-recognizer@0.9.0": {
      "aurelia-path": "github:aurelia/path@0.11.0",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/router@0.14.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.12.0",
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.10.0",
      "aurelia-history": "github:aurelia/history@0.9.0",
      "aurelia-logging": "github:aurelia/logging@0.9.0",
      "aurelia-path": "github:aurelia/path@0.11.0",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.9.0",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:aurelia/task-queue@0.9.0": {
      "aurelia-pal": "github:aurelia/pal@0.3.0"
    },
    "github:aurelia/templating@0.17.1": {
      "aurelia-binding": "github:aurelia/binding@0.11.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.12.0",
      "aurelia-loader": "github:aurelia/loader@0.11.0",
      "aurelia-logging": "github:aurelia/logging@0.9.0",
      "aurelia-metadata": "github:aurelia/metadata@0.10.0",
      "aurelia-pal": "github:aurelia/pal@0.3.0",
      "aurelia-path": "github:aurelia/path@0.11.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.9.0",
      "core-js": "npm:core-js@1.2.6"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.20": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
