//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Returns the first parameter if not undefined,
 * otherwise the second parameter.
 *
 * @class
 * @returns {vgl.defaultValue}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.defaultValue = function(a, b) {
  'use strict';

  if (typeof a !== 'undefined') {
    return a;
  }
  return b;
};

vgl.defaultValue.EMPTY_OBJECT = vgl.freezeObject({});
