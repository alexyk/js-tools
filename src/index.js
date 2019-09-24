import { isMoment } from 'moment';

let config = {
  noColor: false,
  noObjects: false
}


/**
 * Logs in green color
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} extraTitle Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */
export function logGreen(thisObject, data, extraTitle='', description='') {
  if (config.noColor) {
    let args = [thisObject, extraTitle, description, data];
    if (isObject(thisObject)) {
      args.shift();
    }
    console.log(...args);
    return;
  }

  const details = getCallerDetails(thisObject, logGreen);
  console.log(`%c[${details}] %c ${extraTitle} %c${description}`, 
    "color: green;  font-weight: bold",
    "color: orange; font-weight: bold",
    "color: grey;   font-weight: normal");
  if (data) console.log(data);
}

/**
 * Logs a warning message
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} extraTitle Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */
export function logWarn(thisObject, data, extraTitle='', description='') {
  if (config.noColor) {
    let args = [thisObject, extraTitle, description, data];
    if (isObject(thisObject)) {
      args.shift();
    }
    console.warn(...args);
    return;
  }

  let details;
  if (thisObject == null || isString(thisObject)) {
    details = (isString(thisObject) ? thisObject : 'n/a');
  } else {
    details = getCallerDetails(thisObject, logWarn);
  }
  console.log(`%c[Warn] [${details}] %c${extraTitle} %c${description}`, 
    "color: yellow;  font-weight: bold",
    "color: white; font-weight: bold",
    "color: grey;   font-weight: normal");
  if (data) console.log(data);
}

/**
 * Logs usually a caught error
 * @param {Object} thisObject Calling object
 * @param {any} data Data to log
 * @param {String} error Title added to warning default title (red color)
 * @param {String} description Additional text (normal color)
 */
export function logError(thisObject, data, error='', description='') {
  if (config.noColor) {
    let args = [thisObject, description, data];
    if (isObject(thisObject)) {
      args.shift();
    }
    console.error(...args);
    return;
  }

  let details;
  if (thisObject == null || isString(thisObject)) {
    details = (isString(thisObject) ? thisObject : 'n/a');
  } else {
    details = getCallerDetails(thisObject, logError);
  }
  console.log(`%c[Error] [${details}] %c${error} %c${description}`, 
    "color: red;  font-weight: bold",
    "color: orange; font-weight: bold",
    "color: pink;   font-weight: normal");
  if (data && Object.keys(data).length > 0) console.log(data);
}


// TODO: Move the following utilities to a separate place
export function getCallerDetails(thisObject, calledMethod) {
  const callerMethodName = getCallerMethod(calledMethod);
  const callerClassName = getObjectClassName(thisObject);
  return `${callerClassName}::${callerMethodName}()`;
}

function getCallerMethod(calledMethod) {
  let result;

  if (!calledMethod || !calledMethod.prototype || !calledMethod.prototype.caller || !calledMethod.prototype.caller.name) {
    result = '';
  } else {
    result = calledMethod.caller.name.replace("\$", '');
  }

  return result;
}

export function isObject(value, className = null) {
  let result = typeof value == "object";
  if (!result) {
    className = className ? className : getObjectClassName(value);
    result = ["Symbol", "Object"].includes(className);
  }
  return result;
}

export function isArray(value) {
  return (value instanceof Array);
}

export function isFunction(value) {
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

export function isNumber(value) {
  return typeof value == "number";
}

export function isString(value) {
  return typeof value == "string";
}

export function isSymbol(obj, className = null) {
  return (className || getObjectClassName(obj)) == "Symbol";
}

export function getObjectKeysCount(obj) {
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
export function getConditionsByPath(rootObject, path, expectedValue) {
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

export function getObjectClassName(obj) {
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

export function getObjectFromPath(rootObject, propPath, pathIncludesRoot=false) {
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

function setConfig(option, value) {
  if (option == 'nodeMode') {
    config.noColor = true;
    config.noObjects = true;
  } else {
    config[option] = value;
  }
}
export {
  config, setConfig
};
