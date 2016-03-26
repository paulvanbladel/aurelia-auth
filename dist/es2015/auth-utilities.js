var slice = [].slice;

function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  } else {
    delete obj.$$hashKey;
  }
}

function baseExtend(dst, objs, deep) {
  var h = dst.$$hashKey;

  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);
    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
        baseExtend(dst[key], [src], true);
      } else {
        dst[key] = src;
      }
    }
  }

  setHashKey(dst, h);
  return dst;
}

export function status(response) {
  if (response.status >= 200 && response.status < 400) {
    return response.json().catch(error => null);
  }

  throw response;
}

export function isDefined(value) {
  return typeof value !== 'undefined';
}

export function camelCase(name) {
  return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  });
}

export function parseQueryString(keyValue) {
  var obj = {},
      key,
      value;
  forEach((keyValue || '').split('&'), function (keyValue) {
    if (keyValue) {
      value = keyValue.split('=');
      key = decodeURIComponent(value[0]);
      obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
    }
  });
  return obj;
}

export function isString(value) {
  return typeof value === 'string';
}

export function isObject(value) {
  return value !== null && typeof value === 'object';
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function joinUrl(baseUrl, url) {
  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url;
  }

  var joined = [baseUrl, url].join('/');

  var normalize = function (str) {
    return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
  };

  return normalize(joined);
}

export function isBlankObject(value) {
  return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);
}

export function isArrayLike(obj) {
  if (obj == null || isWindow(obj)) {
    return false;
  }
}

export function isWindow(obj) {
  return obj && obj.window === obj;
}

export function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

export function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}

export function forEach(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (Array.isArray(obj) || isArrayLike(obj)) {
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}