//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl: true, ogs: true, inherit*/
/*exported vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

if (typeof ogs === 'undefined') {
  var ogs = {};
}

//////////////////////////////////////////////////////////////////////////////
/**
 * Create namespace for the given name
 *
 * @param ns_string
 * @returns {*|{}}
 */
//////////////////////////////////////////////////////////////////////////////
ogs.namespace = function (ns_string) {
  'use strict';

  var parts = ns_string.split('.'), parent = ogs, i;

  // strip redundant leading global
  if (parts[0] === 'ogs') {
    parts = parts.slice(1);
  }
  for (i = 0; i < parts.length; i += 1) {
    // create a property if it doesn't exist
    if (typeof parent[parts[i]] === 'undefined') {
      parent[parts[i]] = {};
    }
    parent = parent[parts[i]];
  }
  return parent;
};

/** vgl namespace */
var vgl = ogs.namespace('gl');

//////////////////////////////////////////////////////////////////////////////
/**
 * Convenient function to define JS inheritance
 *
 * @param C
 * @param P
 */
//////////////////////////////////////////////////////////////////////////////
function inherit(C, P) {
  'use strict';

  var F = function () {
  };
  F.prototype = P.prototype;
  C.prototype = new F();
  C.uber = P.prototype;
  C.prototype.constructor = C;
}

//////////////////////////////////////////////////////////////////////////////
/**
 * Convenient function to get size of an object
 *
 * @param obj
 * @returns {number} *
 */
//////////////////////////////////////////////////////////////////////////////
Object.size = function (obj) {
  'use strict';

  var size = 0, key = null;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size += 1;
    }
  }
  return size;
};
