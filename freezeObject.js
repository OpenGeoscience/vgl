 /**
 * @module ogs.vgl
 */

vglModule.freezeObject = function(obj) {
  "use strict";

  /**
   * Freezes an object, using Object.freeze if available, otherwise returns
   * the object unchanged.  This function should be used in setup code to prevent
   * errors from completely halting JavaScript execution in legacy browsers.
   *
   * @exports freezeObject
   */
  var freezedObject = Object.freeze(obj);
  if (typeof freezedObject === 'undefined') {
    freezedObject = function(o) {
      return o;
    };
  }

  return freezedObject;
};
