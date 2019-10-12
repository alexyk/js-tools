import moment, { isMoment } from 'moment';
import config, {setConfig, LOG_TYPE} from './config'

/**
 * Used internally by logGreen, logWarn, logError
 * @param {Object|String} thisObject 
 * @param {String} extraTitle 
 * @param {String} description 
 * @param {Object|String|Number} data 
 */
function processLogArgs(thisObject, extraTitle, description, data) {
  let args = [thisObject, description, data];

  if (extraTitle != null) {
    args.splice(1, 0, extraTitle); // add extra title at index 1 if not null
  }
  if (config.noObjects) {
    if (isObject(thisObject)) {
      if (thisObject == null) {
        args[0] = '    ';// add indent if object is null
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

function log(...args) {
  let hasArgs = args.length > 0;
  let arg1 = args[0];

  if (hasArgs && isObject(arg1) && config.noObjects) {
    return;
  }
  if (!hasArgs) {
    console.log();
    return;
  }

  
  if (config.noColor && arg1.includes('%c')) {
    args = [arg1.replace(/\%c/g, '')];
  } else if (config.noObjects) {
    args = args.filter(item => (!isObject(item)));
  }

  console.log(...args);
}


function dlog(...args) {
  console.log('[DEBUG]', ...args);
}
  

/**
 * Logs in green color
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} extraTitle Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */
function logGreen(thisObject, data, extraTitle='', description='') {
  if (config.noColor) {
    const args = processLogArgs(thisObject, extraTitle, description, data);
    log(...args);
    return;
  }

  // one argument case
  if (!data && !extraTitle && !description) {
    log(`%c${thisObject}`, "color: green;  font-weight: normal")
    return;
  }

  const details = getCallerDetails(thisObject, logGreen);
  log(`%c[${details}] %c ${extraTitle} %c${description}`, 
    "color: green;  font-weight: bold",
    "color: orange; font-weight: bold",
    "color: grey;   font-weight: normal");
  if (!isObjectEmpty(data)) console.log(data);
}

/**
 * Logs a warning message
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} extraTitle Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */
function logWarn(thisObject, data, extraTitle='', description='') {
  if (config.noColor) {
    const args = processLogArgs(thisObject, extraTitle, description, data);
    console.warn(...args);
    return;
  }

  let details;
  if (thisObject == null || isString(thisObject)) {
    details = (isString(thisObject) ? thisObject : 'n/a');
  } else {
    details = getCallerDetails(thisObject, logWarn);
  }
  log(`%c[Warn] [${details}] %c${extraTitle} %c${description}`, 
    "color: yellow;  font-weight: bold",
    "color: white; font-weight: bold",
    "color: grey;   font-weight: normal");
  if (!isObjectEmpty(data)) console.log(data);
}

/**
 * Logs usually a caught error
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} error Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */
function logError(thisObject, data, error='', description='') {
  if (config.noColor) {
    const args = processLogArgs('[ERROR] ' + thisObject, " - " + error.toString(), description ? `(${description})` : '', data);
    log();
    console.error(...args);
    return;
  }

  let details;
  if (thisObject == null || isString(thisObject)) {
    details = (isString(thisObject) ? thisObject : 'n/a');
  } else {
    details = getCallerDetails(thisObject, logError);
  }
  log(`%c[Error] [${details}] %c${error} %c${description}`, 
    "color: red;  font-weight: bold",
    "color: orange; font-weight: bold",
    "color: pink;   font-weight: normal");
  if (!isObjectEmpty(data)) console.log(data);
}


// TODO: Move the following utilities to a separate place
function getCallerDetails(thisObject, calledMethod) {
  const callerMethodName = (isString(calledMethod) ? calledMethod : getCallerMethod(calledMethod));
  const callerClassName = (isString(thisObject) ? thisObject : getObjectClassName(thisObject));
  return `${callerClassName}::${callerMethodName}`;
}

function getCallerMethod(calledMethod) {
  let result;

  if (!calledMethod || !calledMethod.prototype || !calledMethod.prototype.caller || !calledMethod.prototype.caller.name) {
    result = '';
  } else {
    result = calledMethod.caller.name.replace("\$", '');
    result += '()';
  }

  return result;
}

function isObjectEmpty(object) {
  return (!object || !isObject(object) || Object.keys(object).length > 0);
}


function isObject(value, className = null) {
  if (value == null) {
    return false;
  }

  let result = typeof value == "object";
  if (!result) {
    className = className ? className : getObjectClassName(value);
    result = ["Symbol", "Object"].includes(className);
  }
  return result;
}

function isArray(value) {
  return (value instanceof Array);
}

function isFunction(value) {
  let result = false;

  if (isString(value)) {
    //let t = eval(value) 
    //result = typeof(eval(value) == 'function');
    result = value.includes('() => {')
  } else {
    result = (typeof(value) == 'function');
  }

  return result;
}

function isNumber(value) {
  return typeof value == "number";
}

function isString(value) {
  return typeof value == "string";
}

function isSymbol(obj, className = null) {
  return (className || getObjectClassName(obj)) == "Symbol";
}

function getObjectKeysCount(obj) {
  const result = (obj && Object.keys(obj).length) || -1;
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
  let conditions = {};
  let comparisonResult = false;

  let item = rootObject;
  let pathAsArray = path.split('.');
  let name = pathAsArray[0];
  pathAsArray.shift();
  conditions[name] = (item != null);
  
  for (let prop of pathAsArray) {
    if (item != null) {
      item = item[prop];
    }
    name += `.${prop}`;
    conditions[name] = (item != null);
  }

  if (name == path) {
    comparisonResult = (item == expectedValue);
  }

  return {conditions, comparisonResult}
}

function getObjectClassName(obj) {
  let result = null;
  if (obj == null) {
    return typeof(obj);
  }

  if (obj['global']) {
    return 'global';
  }

  try {
    if (isMoment(obj)) {
      result = "moment";
    }
    if (obj instanceof Symbol) {
      result = "Symbol";
    }
    if (!result) {
      result =
        obj &&
        obj.constructor &&
        (obj.constructor.name || obj.constructor.className || null);
    }
    if (!result) {
      result = typeof obj;
    }
  } catch (error) {
    logError('js-tools::getObjectClassName', null, error);
  }
  return result;
}

function getObjectFromPath(rootObject, propPath, pathIncludesRoot=false) {
  let asArray = propPath.split('.');
  if (pathIncludesRoot) {
    asArray.shift();
  }
  let result = rootObject || {};
  for (let prop of asArray) {
    if (result) {
      result = result[prop];
    } else {
      break;
    }
  }

  return result;
}


var timeData = {};
function formatTime(value, precision=2) {
  let result = (value/1000).toPrecision(precision);
  result += 's';
  return result;
}
function measureTime(label, precision=2) {
  let currentValue = moment();
  let lastValue = timeData[label];
  if (lastValue != null) {
    return formatTime(currentValue-lastValue, precision);
  } else {
    timeData[label] = currentValue;
    return '0s';
  }
}

export {
  config, setConfig, LOG_TYPE, measureTime,
  log, dlog, logGreen, logWarn, logError, 
  getObjectClassName, getObjectFromPath, getConditionsByPath, getObjectKeysCount, getCallerDetails,
  isString, isNumber, isSymbol, isObjectEmpty, isObject, isArray, isFunction
}