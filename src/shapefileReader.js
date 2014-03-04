//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec4, inherit, $, Uint16Array*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of shapefile reader
 *
 * This contains code that reads a shapefile and produces vgl geometries
 *
 * @class
 * @returns {vgl.shapefileReader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.shapefileReader = function() {
  'use strict';

  if (!(this instanceof vgl.shapefileReader)) {
    return new vgl.shapefileReader();
  }

  var m_that = this;
  var SHP_HEADER_LEN = 8;
  var SHP_NULL = 0;
  var SHP_POINT = 1;
  var SHP_POLYGON = 5;
  var SHP_POLYLINE = 3;

  this.int8 = function (data, offset) {
      return data.charCodeAt (offset);
  };

  this.bint32 = function (data, offset) {
    return (
      ((data.charCodeAt (offset) & 0xff) << 24) +
        ((data.charCodeAt (offset + 1) & 0xff) << 16) +
        ((data.charCodeAt (offset + 2) & 0xff) << 8) +
        (data.charCodeAt (offset + 3) & 0xff)
    );
  };

  this.lint32 = function (data, offset) {
    return (
      ((data.charCodeAt (offset + 3) & 0xff) << 24) +
        ((data.charCodeAt (offset + 2) & 0xff) << 16) +
        ((data.charCodeAt (offset + 1) & 0xff) << 8) +
        (data.charCodeAt (offset) & 0xff)
    );
  };

  this.bint16 = function (data, offset) {
    return (
      ((data.charCodeAt (offset) & 0xff) << 8) +
        (data.charCodeAt (offset + 1) & 0xff)
    );
  };

  this.lint16 = function (data, offset) {
    return (
      ((data.charCodeAt (offset + 1) & 0xff) << 8) +
        (data.charCodeAt (offset) & 0xff)
    );
  };

  this.ldbl64 = function (data, offset) {
    var b0 = data.charCodeAt (offset) & 0xff;
    var b1 = data.charCodeAt (offset + 1) & 0xff;
    var b2 = data.charCodeAt (offset + 2) & 0xff;
    var b3 = data.charCodeAt (offset + 3) & 0xff;
    var b4 = data.charCodeAt (offset + 4) & 0xff;
    var b5 = data.charCodeAt (offset + 5) & 0xff;
    var b6 = data.charCodeAt (offset + 6) & 0xff;
    var b7 = data.charCodeAt (offset + 7) & 0xff;

    var sign = 1 - 2 * (b7 >> 7);
    var exp = (((b7 & 0x7f) << 4) + ((b6 & 0xf0) >> 4)) - 1023;
    //var frac = (b6 & 0x0f) * Math.pow (2, -4) + b5 * Math.pow (2, -12) + b4 *
    // Math.pow (2, -20) + b3 * Math.pow (2, -28) + b2 * Math.pow (2, -36) + b1 *
    // Math.pow (2, -44) + b0 * Math.pow (2, -52);

    //return sign * (1 + frac) * Math.pow (2, exp);
    var frac = (b6 & 0x0f) * Math.pow (2, 48) + b5 * Math.pow (2, 40) + b4 *
                 Math.pow (2, 32) + b3 * Math.pow (2, 24) + b2 *
                 Math.pow (2, 16) + b1 * Math.pow (2, 8) + b0;

    return sign * (1 + frac * Math.pow (2, -52)) * Math.pow (2, exp);
  };

  this.lfloat32 = function (data, offset) {
    var b0 = data.charCodeAt (offset) & 0xff;
    var b1 = data.charCodeAt (offset + 1) & 0xff;
    var b2 = data.charCodeAt (offset + 2) & 0xff;
    var b3 = data.charCodeAt (offset + 3) & 0xff;

    var sign = 1 - 2 * (b3 >> 7);
    var exp = (((b3 & 0x7f) << 1) + ((b2 & 0xfe) >> 7)) - 127;
    var frac = (b2 & 0x7f) * Math.pow (2, 16) + b1 * Math.pow (2, 8) + b0;

    return sign * (1 + frac * Math.pow (2, -23)) * Math.pow (2, exp);
  };

  this.str = function (data, offset, length) {
    var chars = [];
    var index = offset;
    while (index < offset + length) {
      var c = data[index];
      if (c.charCodeAt (0) !== 0)
        chars.push (c);
      else {
        break;
      }
      index ++;
    }
    return chars.join ('');
  };

  this.readHeader = function (data) {
    var code = this.bint32(data, 0);
    var length = this.bint32(data, 24);
    var version = this.lint32(data, 28);
    var shapetype = this.lint32(data, 32);

    var xmin = this.ldbl64(data, 36);
    var ymin = this.ldbl64(data, 44);
    var xmax = this.ldbl64(data, 52);
    var ymax = this.ldbl64(data, 60);
    return {
      code: code,
      length: length,
      version: version,
      shapetype: shapetype,
      bounds: new Box (vect (xmin, ymin), vect (xmax, ymax))
    };
  };

  this.loadShx = function (data) {
    var indices = [];
    var appendIndex = function (offset) {
      indices.push (2 * m_that.bint32(data, offset));
      return offset + 8;
    };
    var offset = 100;
    while (offset < data.length) {
      offset = appendIndex (offset);
    }
    return indices;
  };

  this.Shapefile = function (options) {
    var path = options.path;
    $.ajax ({
      url: path + '.shx',
      mimeType: 'text/plain; charset=x-user-defined',
      success: function (data) {
        var indices = this.loadShx(data);
        $.ajax ({
          url: path + '.shp',
          mimeType: 'text/plain; charset=x-user-defined',
          success: function (data) {
            $.ajax ({
              url: path + '.dbf',
              mimeType: 'text/plain; charset=x-user-defined',
              success: function (dbf_data) {
                var layer = this.loadShp (data, dbf_data, indices, options);
                options.success (layer);
              }
            });
          }
        });
      }
    });
  };

  this.localShapefile = function(options) {
    var shxFile = options.shx;
    var shpFile = options.shp;
    var dbfFile = options.dbf;
    var shxReader = new FileReader();
    shxReader.onloadend = function() {
      var indices = m_that.loadShx(shxReader.result);
      var shpReader = new FileReader();

      shpReader.onloadend = function() {
        var shpData = shpReader.result;

        var dbfReader = new FileReader();
        dbfReader.onloadend = function() {
          var dbfData = dbfReader.result;
          var layer = m_that.loadShp(shpData, dbfData, indices, options);
          options.success(layer);
        };
        dbfReader.readAsBinaryString(dbfFile);
      };
      shpReader.readAsBinaryString(shpFile);
    };
    shxReader.readAsBinaryString(shxFile);
  };

  this.loadDBF = function (data) {
    var readHeader = function (offset) {
      var name = m_that.str(data, offset, 10);
      var type = m_that.str(data, offset + 11, 1);
      var length = m_that.int8(data, offset + 16);
      return {
        name: name,
        type: type,
        length: length
      };
    };

    // Level of the dBASE file
    var level = m_that.int8(data, 0);
    if (level == 4) {
      throw "Level 7 dBASE not supported";
    }

    // Date of last update
    var year = m_that.int8(data, 1);
    var month = m_that.int8(data, 2);
    var day = m_that.int8(data, 3);

    var num_entries = m_that.lint32(data, 4);
    var header_size = m_that.lint16(data, 8);
    var record_size = m_that.lint16(data, 10);

    var FIELDS_START = 32;
    var HEADER_LENGTH = 32;

    var header_offset = FIELDS_START;
    var headers = [];
    while (header_offset < header_size - 1) {
      headers.push (readHeader(header_offset));
      header_offset += HEADER_LENGTH;
    }

    var records = [];
    var record_offset = header_size;
    while (record_offset < header_size + num_entries * record_size) {
      var declare = m_that.str(data, record_offset, 1);
      if (declare == '*') {
        // Record size in the header include the size of the delete indicator
        record_offset += record_size;
      }
      else {
        // Move offset to the start of the actual data
        record_offset ++;
        var record = {};
        for (var i = 0; i < headers.length; i ++) {
          var header = headers[i];
          var value;
          if (header.type == 'C') {
              value = m_that.str(data, record_offset, header.length).trim ();
          }
          else if (header.type == 'N') {
              value = parseFloat (m_that.str (data, record_offset, header.length));
          }
          record_offset += header.length;
          record[header.name] = value;
        }
        records.push(record);
      }
    }
    return records;
  };

  this.loadShp = function (data, dbf_data, indices, options) {
    var features = [];
    var readRing = function (offset, start, end) {
      var ring = [];
      for (var i = end - 1; i >= start; i --) {
        var x = m_that.ldbl64(data, offset + 16 * i);
        var y = m_that.ldbl64(data, offset + 16 * i + 8);
        ring.push ([x, y]);
      }
      //if (ring.length <= 3)
      // return [];
      return ring;
    };

    var readRecord = function (offset) {
      var index = m_that.bint32(data, offset);
      var record_length = m_that.bint32(data, offset + 4);
      var record_offset = offset + 8;
      var geom_type = m_that.lint32(data, record_offset);

      if (geom_type == SHP_NULL) {
        console.log ("NULL Shape");
        //return offset + 12;
      }
      else if (geom_type == SHP_POINT) {
        var x = m_that.ldbl64(data, record_offset + 4);
        var y = m_that.ldbl64(data, record_offset + 12);

        features.push ({
          type: 'Point',
          attr: {},
          geom: [[x, y]]
        });
      }
      else if (geom_type == SHP_POLYGON) {
        var num_parts = m_that.lint32(data, record_offset + 36);
        var num_points = m_that.lint32(data, record_offset + 40);

        var parts_start = offset + 52;
        var points_start = offset + 52 + 4 * num_parts;

        var rings = [];
        for (var i = 0; i < num_parts; i ++) {
          var start = m_that.lint32(data, parts_start + i * 4);
          var end;
          if (i + 1 < num_parts) {
            end = m_that.lint32(data, parts_start + (i + 1) * 4);
          }
          else {
            end = num_points;
          }
          var ring = readRing (points_start, start, end);
          rings.push (ring);
        }
        features.push ({
          type: 'Polygon',
          attr: {},
          geom: [rings]
        });
      }
      else if (geom_type == SHP_POLYLINE) {
        var num_parts = m_that.lint32(data, record_offset + 36);
        var num_points = m_that.lint32(data, record_offset + 40);

        var parts_start = offset + 52;
        var points_start = offset + 52 + 4 * num_parts;

        var rings = [];
        for (var i = 0; i < num_parts; i ++) {
          var start = m_that.lint32(data, parts_start + i * 4);
          var end;
          if (i + 1 < num_parts) {
              end = m_that.lint32(data, parts_start + (i + 1) * 4);
          }
          else {
              end = num_points;
          }
          var ring = readRing (points_start, start, end);
          rings.push (ring);
        }
        features.push ({
          type: 'Polyline',
          attr: {},
          geom: [rings]
        });
      }
      else {
        throw "Not Implemented: " + geom_type;
      }
      //return offset + 2 * record_length + SHP_HEADER_LEN;
    };

    var attr = this.loadDBF(dbf_data);

    //var offset = 100;
    //while (offset < length * 2) {
    // offset = readRecord (offset);
    //}
    for (var i = 0; i < indices.length; i ++) {
      var offset = indices[i];
      readRecord (offset);
    }

    var layer = []; //new Layer ();

    for (var i = 0; i < features.length; i ++) {
      var feature = features[i];
      feature.attr = attr[i];
      layer.push (feature);
    }
    return layer;
  };

  return this;
};