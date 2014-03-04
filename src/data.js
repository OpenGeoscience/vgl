//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

vgl.data = function() {
  'use strict';

  if (!(this instanceof vgl.data)) {
    return new vgl.data();
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return data type. Should be implemented by the derived class
   */
  ////////////////////////////////////////////////////////////////////////////
  this.type = function() {
  };
};

vgl.data.raster = 0;
vgl.data.point = 1;
vgl.data.lineString = 2;
vgl.data.polygon = 3;
vgl.data.geometry = 10;