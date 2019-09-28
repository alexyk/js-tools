"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = setConfig;
exports.LOG_TYPE = exports["default"] = void 0;
var LOG_TYPE = {
  CHROME: "chrome",
  VSCODE: "vscode"
};
exports.LOG_TYPE = LOG_TYPE;
var config = {
  noColor: false,
  noObjects: false,
  logType: LOG_TYPE.VSCODE
};

function setConfig(option, value) {
  if (option == "logType") {
    switch (value) {
      case LOG_TYPE.VSCODE:
        config.noColor = true;
        config.noObjects = true;
        break;

      case LOG_TYPE.CHROME:
        config.noColor = false;
        config.noObjects = false;
        break;

      default:
        config[option] = value;
        break;
    }
  }

  config[option] = value;
}

var _default = config;
exports["default"] = _default;