"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.measureTime = measureTime;
exports.log = log;
exports.dlog = dlog;
exports.logGreen = logGreen;
exports.logWarn = logWarn;
exports.logError = logError;
exports.getObjectClassName = getObjectClassName;
exports.getObjectFromPath = getObjectFromPath;
exports.getConditionsByPath = getConditionsByPath;
exports.getObjectKeysCount = getObjectKeysCount;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isSymbol = isSymbol;
exports.isObjectEmpty = isObjectEmpty;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function get() {
    return _config["default"];
  }
});
Object.defineProperty(exports, "setConfig", {
  enumerable: true,
  get: function get() {
    return _config.setConfig;
  }
});
Object.defineProperty(exports, "LOG_TYPE", {
  enumerable: true,
  get: function get() {
    return _config.LOG_TYPE;
  }
});

var _moment = _interopRequireWildcard(require("moment"));

var _config = _interopRequireWildcard(require("./config"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function processLogArgs(thisObject, extraTitle, description, data) {
  var args = [thisObject, description, data];

  if (extraTitle != null) {
    args.splice(1, 0, extraTitle); // add extra title at index 1 if not null
  }

  if (_config["default"].noObjects) {
    if (isObject(thisObject)) {
      if (thisObject == null) {
        args[0] = '    '; // add indent if object is null
      } else {
        args.shift();
      }
    }

    if (isObject(data)) {
      args.pop(data);
    }
  }

  return args;
}

function log() {
  var _console;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var hasArgs = args.length > 0;
  var arg1 = args[0];

  if (hasArgs && isObject(arg1) && _config["default"].noObjects) {
    return;
  }

  if (!hasArgs) {
    console.log();
    return;
  }

  if (_config["default"].noColor && arg1.includes('%c')) {
    args = [arg1.replace(/\%c/g, '')];
  } else if (_config["default"].noObjects) {
    args = args.filter(function (item) {
      return !isObject(item);
    });
  }

  (_console = console).log.apply(_console, _toConsumableArray(args));
}

function dlog() {
  var _console2;

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  (_console2 = console).log.apply(_console2, ['[DEBUG]'].concat(args));
}
/**
 * Logs in green color
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} extraTitle Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */


function logGreen(thisObject, data) {
  var extraTitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  if (_config["default"].noColor) {
    var args = processLogArgs(thisObject, extraTitle, description, data);
    log.apply(void 0, _toConsumableArray(args));
    return;
  }

  var details = getCallerDetails(thisObject, logGreen);
  log("%c[".concat(details, "] %c ").concat(extraTitle, " %c").concat(description), "color: green;  font-weight: bold", "color: orange; font-weight: bold", "color: grey;   font-weight: normal");
  if (!isObjectEmpty(data)) console.log(data);
}
/**
 * Logs a warning message
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} extraTitle Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */


function logWarn(thisObject, data) {
  var extraTitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  if (_config["default"].noColor) {
    var _console3;

    var args = processLogArgs(thisObject, extraTitle, description, data);

    (_console3 = console).warn.apply(_console3, _toConsumableArray(args));

    return;
  }

  var details;

  if (thisObject == null || isString(thisObject)) {
    details = isString(thisObject) ? thisObject : 'n/a';
  } else {
    details = getCallerDetails(thisObject, logWarn);
  }

  log("%c[Warn] [".concat(details, "] %c").concat(extraTitle, " %c").concat(description), "color: yellow;  font-weight: bold", "color: white; font-weight: bold", "color: grey;   font-weight: normal");
  if (!isObjectEmpty(data)) console.log(data);
}
/**
 * Logs usually a caught error
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} error Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */


function logError(thisObject, data) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  if (_config["default"].noColor) {
    var _console4;

    var args = processLogArgs('[ERROR] ' + thisObject, " - " + error.toString(), description ? "(".concat(description, ")") : '', data);
    log();

    (_console4 = console).error.apply(_console4, _toConsumableArray(args));

    return;
  }

  var details;

  if (thisObject == null || isString(thisObject)) {
    details = isString(thisObject) ? thisObject : 'n/a';
  } else {
    details = getCallerDetails(thisObject, logError);
  }

  log("%c[Error] [".concat(details, "] %c").concat(error, " %c").concat(description), "color: red;  font-weight: bold", "color: orange; font-weight: bold", "color: pink;   font-weight: normal");
  if (!isObjectEmpty(data)) console.log(data);
} // TODO: Move the following utilities to a separate place


function getCallerDetails(thisObject, calledMethod) {
  var callerMethodName = getCallerMethod(calledMethod);
  var callerClassName = getObjectClassName(thisObject);
  return "".concat(callerClassName, "::").concat(callerMethodName);
}

function getCallerMethod(calledMethod) {
  var result;

  if (!calledMethod || !calledMethod.prototype || !calledMethod.prototype.caller || !calledMethod.prototype.caller.name) {
    result = '';
  } else {
    result = calledMethod.caller.name.replace("\$", '');
    result += '()';
  }

  return result;
}

function isObjectEmpty(object) {
  return !object || !isObject(object) || Object.keys(object).length > 0;
}

function isObject(value) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var result = _typeof(value) == "object";

  if (!result) {
    className = className ? className : getObjectClassName(value);
    result = ["Symbol", "Object"].includes(className);
  }

  return result;
}

function isArray(value) {
  return value instanceof Array;
}

function isFunction(value) {
  var result = false;

  if (isString(value)) {
    //let t = eval(value) 
    //result = typeof(eval(value) == 'function');
    result = value.includes('() => {');
  } else {
    result = typeof value == 'function';
  }

  return result;
}

function isNumber(value) {
  return typeof value == "number";
}

function isString(value) {
  return typeof value == "string";
}

function isSymbol(obj) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return (className || getObjectClassName(obj)) == "Symbol";
}

function getObjectKeysCount(obj) {
  var result = obj && Object.keys(obj).length || -1;
  return result;
}
/**
 * Compares expected value to given path (like "rootObject.prop1.anotherProp").
 * Makes sure nothing on the way is undefined
 * @param {Object} rootObject The rootObject in the path (Example: if path = "rootObject.prop1.anotherProp" then "rootObject" is the rootObject)
 * @param {String} path A path to the prop in the form "rootObject.prop1.anotherProp"
 * @param {any} expectedValue What the path is expected to evaluate to
 */


function getConditionsByPath(rootObject, path, expectedValue) {
  var conditions = {};
  var comparisonResult = false;
  var item = rootObject;
  var pathAsArray = path.split('.');
  var name = pathAsArray[0];
  pathAsArray.shift();
  conditions[name] = item != null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = pathAsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      if (item != null) {
        item = item[prop];
      }

      name += ".".concat(prop);
      conditions[name] = item != null;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (name == path) {
    comparisonResult = item == expectedValue;
  }

  return {
    conditions: conditions,
    comparisonResult: comparisonResult
  };
}

function getObjectClassName(obj) {
  var result = null;

  if (obj == null) {
    return _typeof(obj);
  }

  if (obj['global']) {
    return 'global';
  }

  try {
    if ((0, _moment.isMoment)(obj)) {
      result = "moment";
    }

    if (obj instanceof Symbol) {
      result = "Symbol";
    }

    if (!result) {
      result = obj && obj.constructor && (obj.constructor.name || obj.constructor.className || null);
    }

    if (!result) {
      result = _typeof(obj);
    }
  } catch (error) {
    logError('js-tools::getObjectClassName', null, error);
  }

  return result;
}

function getObjectFromPath(rootObject, propPath) {
  var pathIncludesRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var asArray = propPath.split('.');

  if (pathIncludesRoot) {
    asArray.shift();
  }

  var result = rootObject || {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = asArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var prop = _step2.value;

      if (result) {
        result = result[prop];
      } else {
        break;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return result;
}

var timeData = {};

function formatTime(value) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var result = (value / 1000).toPrecision(precision);
  result += 's';
  return result;
}

function measureTime(label) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var currentValue = (0, _moment["default"])();
  var lastValue = timeData[label];

  if (lastValue != null) {
    return formatTime(currentValue - lastValue, precision);
  } else {
    timeData[label] = currentValue;
    return '0s';
  }
}