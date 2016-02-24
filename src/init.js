//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/* exported vgl, inherit */
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
window.vgl = vgl;

//////////////////////////////////////////////////////////////////////////////
/**
 * Convenient function to define JS inheritance
 */
//////////////////////////////////////////////////////////////////////////////
vgl.inherit = function (C, P) {
  'use strict';

  var F = inherit.func();
  F.prototype = P.prototype;
  C.prototype = new F();
  C.prototype.constructor = C;
};
vgl.inherit.func = function () {
  'use strict';
  return function () {};
};

window.inherit = vgl.inherit;

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

  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size += 1;
    }
  }
  return size;
};
