import { isMoment } from 'moment';


export function logGreen(thisObject, data, extraTitle='', description='') {
  const details = getCallerDetails(thisObject, logGreen);
  console.log(`%c[${details}] %c ${extraTitle} %c${description}`, 
    "color: green;  font-weight: bold",
    "color: orange; font-weight: bold",
    "color: grey;   font-weight: normal");
  if (data) console.log(data);
}
export function logWarn(thisObject, data, extraTitle='', description='') {
  const details = getCallerDetails(thisObject, logWarn);
  console.log(`%c[${details}] %c ${extraTitle} %c${description}`, 
    "color: red;  font-weight: bold",
    "color: orange; font-weight: bold",
    "color: grey;   font-weight: normal");
  if (data) console.log(data);
}


// TODO: Move the following utilities to a separate place
function getCallerDetails(thisObject, calledMethod) {
  const callerMethodName = calledMethod.caller.name;
  const callerClassName = getObjectClassName(thisObject);
  return `${callerClassName}::${callerMethodName}()`;
}



export function isObject(value, className = null) {
  let result = typeof value == "object";
  if (!result) {
    className = className ? className : getObjectClassName(value);
    result = ["Symbol", "Object"].includes(className);
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
    console.warn(
      `[screens::utils::getObjectClassName] Error: ${error.message}`,
      { error, obj }
    );
  }
  return result;
}

export function getObjectFromPath(rootObject, propPath) {
  const asArray = propPath.split('.');
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