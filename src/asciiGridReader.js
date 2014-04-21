//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of asciiGridReader
 *
 * @class
 * @returns {vgl.asciiGridReader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.asciiGridReader = function() {
  'use strict';

  if (!(this instanceof vgl.asciiGridReader)) {
    return new vgl.asciiGridReader();
  }
  
  var m_errorMessage = new Error("Invalid line in ACII Grid file");

  function readParam(line, param, isFloat) {
    var sp = (line || '').split(' ');
    if (sp.length !== 2 || param.indexOf(sp[0].toLowerCase()) < 0) {
      throw m_errorMessage;
    }
    if (isFloat) {
      return parseFloat(sp[1]);
    }
    return parseInt(sp[1], 10);
  }

  this.read = function (data) {
    var obj = {},
        lines = data.split('\n');
    
    obj.ncols = readParam(lines.shift(), ['ncols'], false);
    obj.nrows = readParam(lines.shift(), ['nrows'], false);
    obj.xllcorner = readParam(lines.shift(), ['xllcorner', 'xllcenter'], true);
    obj.yllcorner = readParam(lines.shift(), ['yllcorner', 'yllcenter'], true);
    obj.cellsize = readParam(lines.shift(), ['cellsize'], true);
    try {
      obj.nodata_value = readParam(lines[0], ['nodata_value'], true);
      lines.shift();
    } catch (e) {
      obj.nodata_value = null;
      if (e !== m_errorMessage) {
        throw e;
      }
    }
    obj.data = lines.join(' ').trim().split(' ').map(function (d, i) {
      var f = parseFloat(d);
      if (Number.isNaN(f)) {
        console.log("error at " + i + " : " + d);
        throw m_errorMessage;
      }
      return f;
    });
    return obj;
  };

  return this;
};
