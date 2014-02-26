//////////////////////////////////////////////////////////////////////////////
/**
 * @module ogs.vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec4, inherit, $, Uint16Array*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of geojson reader
 *
 * This contains code that reads a geoJSON file and produces rendering
 * primitives from it.
 *
 * @class
 * @returns {vgl.geojsonReader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.geojsonReader = function() {
  'use strict';

  if (!(this instanceof vgl.geojsonReader)) {
    return new vgl.geojsonReader();
  }

  var m_scalarFormat = "none",
      m_scalarRange = null;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read scalars
   *
   * @param coordinates
   * @param geom
   * @param size_estimate
   * @param idx
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readScalars = function(coordinates, geom, size_estimate, idx) {
    var array = null,
        s = null,
        r  = null,
        g = null,
        b = null;

    if (this.m_scalarFormat === "values" && coordinates.length === 4)
    {
      s = coordinates[3];
      array = geom.sourceData(vgl.vertexAttributeKeys.Scalar);

      if (!array) {
        array = new vgl.sourceDataSf();
        if (this.m_scalarRange) {
          array.setScalarRange(this.m_scalarRange[0],this.m_scalarRange[1]);
        }
        if (size_estimate !== undefined) {
          array.length = size_estimate;
        }
        geom.addSource(array);
      }
      if (size_estimate === undefined) {
        array.pushBack(s);
      } else {
        array.insertAt(idx, s);
      }
    } else if (this.m_scalarFormat === "rgb" && coordinates.length === 6) {
      array = geom.sourceData(vgl.vertexAttributeKeys.Color);
      if (!array) {
        array = new vgl.sourceDataC3fv();
        if (size_estimate !== undefined) {
          array.length = size_estimate*3;
        }
        geom.addSource(array);
      }
      r = coordinates[3];
      g = coordinates[4];
      b = coordinates[5];
      if (size_estimate === undefined) {
        array.pushBack([r,g,b]);
      } else {
        array.insertAt(idx, [r,g,b]);
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read point data
   *
   * @param coordinates
   * @returns {vgl.geometryData}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readPoint = function(coordinates) {
    var geom = new vgl.geometryData(),
        vglpoints = new vgl.points(),
        vglcoords = new vgl.sourceDataP3fv(),
        indices = new Uint16Array(1),
        x = null,
        y = null,
        z = null,
        i = null;

    geom.addSource(vglcoords);
    for (i = 0; i < 1; i++) {
      indices[i] = i;

      x = coordinates[0];
      y = coordinates[1];
      z = 0.0;
      if (coordinates.length>2) {
        z = coordinates[2];
      }

      //console.log("read " + x + "," + y + "," + z);
      vglcoords.pushBack([x,y,z]);

      //attributes
      this.readScalars(coordinates, geom);
    }

    vglpoints.setIndices(indices);
    geom.addPrimitive(vglpoints);
    geom.setName("aPoint");
    return geom;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read multipoint data
   *
   * @param coordinates
   * @returns {vgl.geometryData}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readMultiPoint = function(coordinates) {
    var geom = new vgl.geometryData(),
        vglpoints = new vgl.points(),
        vglcoords = new vgl.sourceDataP3fv(),
        indices = new Uint16Array(coordinates.length),
        pntcnt = 0,
        estpntcnt = coordinates.length,
        x = null,
        y = null,
        z = null,
        i;

    //preallocate with size estimate
    vglcoords.data().length = estpntcnt * 3; //x,y,z

    for (i = 0; i < coordinates.length; i++) {
      indices[i] = i;
      x = coordinates[i][0];
      y = coordinates[i][1];
      z = 0.0;
      if (coordinates[i].length>2) {
        z = coordinates[i][2];
      }

      //console.log("read " + x + "," + y + "," + z);
      vglcoords.insertAt(pntcnt, [x,y,z]);

      //attributes
      this.readScalars(coordinates[i], geom, estpntcnt, pntcnt);

      pntcnt++;
    }

    vglpoints.setIndices(indices);
    geom.addPrimitive(vglpoints);
    geom.addSource(vglcoords);
    geom.setName("manyPoints");
    return geom;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read line string data
   *
   * @param coordinates
   * @returns {vgl.geometryData}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readLineString = function(coordinates) {
    var geom = new vgl.geometryData(),
        vglline = new vgl.lineStrip(),
        vglcoords = new vgl.sourceDataP3fv(),
        indices = [],
        i = null,
        x = null,
        y = null,
        z = null;

    vglline.setIndicesPerPrimitive(coordinates.length);

    for (i = 0; i < coordinates.length; i++) {
      indices.push(i);
      x = coordinates[i][0];
      y = coordinates[i][1];
      z = 0.0;
      if (coordinates[i].length>2) {
        z = coordinates[i][2];
      }

      //console.log("read " + x + "," + y + "," + z);
      vglcoords.pushBack([x,y,z]);

      //attributes
      this.readScalars(coordinates[i], geom);
    }

    vglline.setIndices(indices);
    geom.addPrimitive(vglline);
    geom.addSource(vglcoords);
    geom.setName("aLineString");
    return geom;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read multi line string
   *
   * @param coordinates
   * @returns {vgl.geometryData}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readMultiLineString = function(coordinates) {
    var geom = new vgl.geometryData(),
        vglcoords = new vgl.sourceDataP3fv(),
        pntcnt = 0,
        //lines should be at least 2 verts long, underest OK
        estpntcnt = coordinates.length * 2,
        i = null,
        j = null,
        x = null,
        y = null,
        z = null,
        indices = null,
        vglline = null,
        thisLineLength = null;

    // Preallocate with size estimate
    vglcoords.data().length = estpntcnt*3; //x,y,z

    for (j = 0; j < coordinates.length; j++) {
      indices = [];
      //console.log("getting line " + j);
      vglline = new vgl.lineStrip();
      thisLineLength = coordinates[j].length;
      vglline.setIndicesPerPrimitive(thisLineLength);
      for (i = 0; i < thisLineLength; i++) {
        indices.push(pntcnt);
        x = coordinates[j][i][0];
        y = coordinates[j][i][1];
        z = 0.0;
        if (coordinates[j][i].length>2) {
          z = coordinates[j][i][2];
        }

        //console.log("read " + x + "," + y + "," + z);
        vglcoords.insertAt(pntcnt, [x,y,z]);

        //attributes
        this.readScalars(coordinates[j][i], geom, estpntcnt*2, pntcnt);

        pntcnt++;
      }

      vglline.setIndices(indices);
      geom.addPrimitive(vglline);
    }

    geom.setName("aMultiLineString");
    geom.addSource(vglcoords);
    return geom;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read polygon data
   *
   * @param coordinates
   * @returns {vgl.geometryData}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readPolygon = function(coordinates) {
    //TODO: ignoring holes given in coordinates[1...]
    //TODO: ignoring convex
    //TODO: implement ear clipping in VGL instead of this to handle both
    var geom = new vgl.geometryData(),
        vglcoords = new vgl.sourceDataP3fv(),
        x = null,
        y = null,
        z  = null,
        thisPolyLength = coordinates[0].length,
        vl = 1,
        i = null,
        indices = null,
        vgltriangle = null;


    for (i = 0; i < thisPolyLength; i++) {
      x = coordinates[0][i][0];
      y = coordinates[0][i][1];
      z = 0.0;
      if (coordinates[0][i].length>2) {
        z = coordinates[0][i][2];
      }

      //console.log("read " + x + "," + y + "," + z);
      vglcoords.pushBack([x,y,z]);

      //attributes
      this.readScalars(coordinates[0][i], geom);

      if (i > 1) {
        //console.log("Cutting new triangle 0,"+ vl+ ","+ i);
        indices = new Uint16Array([0,vl,i]);
        vgltriangle = new vgl.triangles();
        vgltriangle.setIndices(indices);
        geom.addPrimitive(vgltriangle);
        vl = i;
      }
    }

    geom.setName("POLY");
    geom.addSource(vglcoords);
    return geom;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read multi polygon data
   *
   * @param coordinates
   * @returns {vgl.geometryData}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readMultiPolygon = function(coordinates) {
    var geom = new vgl.geometryData(),
        vglcoords = new vgl.sourceDataP3fv(),
        ccount = 0,
        numPolys = coordinates.length,
        pntcnt = 0,
        estpntcnt = numPolys* 3, // assume triangles, underest is fine
        vgltriangle = new vgl.triangles(),
        indexes = [],
        i = null,
        j = null,
        x = null,
        y = null,
        z  = null,
        thisPolyLength = null,
        vf = null,
        vl = null,
        flip = null,
        flipped = false;


    //var time1 = new Date().getTime()
    //var a = 0;
    //var b = 0;
    //var c = 0;
    //var d = 0;

    //preallocate with size estimate
    vglcoords.data().length = numPolys*3; //x,y,z

    for (j = 0; j < numPolys; j++) {
      //console.log("getting poly " + j);

      thisPolyLength = coordinates[j][0].length;
      vf = ccount;
      vl = ccount+1;
      flip = [false,false,false];
      for (i = 0; i < thisPolyLength; i++) {
        //var timea = new Date().getTime()

        x = coordinates[j][0][i][0];
        y = coordinates[j][0][i][1];
        z = 0.0;
        if (coordinates[j][0][i].length>2) {
          z = coordinates[j][0][i][2];
        }
         flipped = false;
        if (x > 180) {
          flipped = true;
          x = x - 360;
        }
        if (i === 0) {
          flip[0] = flipped;
        } else {
          flip[1+(i-1)%2] = flipped;
        }
        //var timeb = new Date().getTime();
        //console.log("read " + x + "," + y + "," + z);

        vglcoords.insertAt(pntcnt, [x,y,z]);
        //var timec = new Date().getTime();

        //attributes
        this.readScalars(coordinates[j][0][i], geom, estpntcnt, pntcnt);
        pntcnt++;
        //var timed = new Date().getTime()

        if (i > 1) {
          //console.log("Cutting new triangle "+ vf + "," + vl + "," + ccount);
          if (flip[0] === flip[1] && flip[1] === flip[2]) {
            indexes = indexes.concat([vf,vl,ccount]);
          }
          //else {
          //  //TODO: duplicate triangles that straddle boundary on either side
          //}

          vl = ccount;
        }
        ccount++;
        //var timee = new Date().getTime()
        //a = a + (timeb-timea)
        //b = b + (timec-timeb)
        //c = c + (timed-timec)
        //d = d + (timee-timed)
      }
    }
    vgltriangle.setIndices(indexes);
    geom.addPrimitive(vgltriangle);

    //console.log("NUMPOLYS " + pntcnt);
    //console.log("RMP: ", a, ",", b, ",", c, ",", d)
    //var time2 = new Date().getTime()

    geom.setName("aMultiPoly");
    geom.addSource(vglcoords);
    //var time3 = new Date().getTime()
    //console.log("RMP: ", time2-time1, ",", time3-time2)

    return geom;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * @param object
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readGJObjectInt = function(object) {
    if (!object.hasOwnProperty('type')) {
      //console.log("uh oh, not a geojson object");
      return null;
    }

    //look for properties type annotation
    if (object.properties &&
        object.properties.ScalarFormat &&
        object.properties.ScalarFormat === "values") {
      this.m_scalarFormat = "values";
      if (object.properties.ScalarRange) {
        this.m_scalarRange = object.properties.ScalarRange;
      }
    }
    if (object.properties &&
        object.properties.ScalarFormat &&
        object.properties.ScalarFormat === "rgb") {
      this.m_scalarFormat = "rgb";
    }

    //TODO: ignoring "crs" and "bbox" and misc meta data on all of these,
    //best to handle as references into original probably
    var ret,
        type = object.type,
        next = null,
        nextset = null,
        i = null;

    switch (type) {
      case "Point":
        //console.log("parsed Point");
        ret = this.readPoint(object.coordinates);
        break;
      case "MultiPoint":
        //console.log("parsed MultiPoint");
        ret = this.readMultiPoint(object.coordinates);
        break;
      case "LineString":
        //console.log("parsed LineString");
        ret = this.readLineString(object.coordinates);
        break;
      case "MultiLineString":
        //console.log("parsed MultiLineString");
        ret = this.readMultiLineString(object.coordinates);
        break;
      case "Polygon":
        //console.log("parsed Polygon");
        ret = this.readPolygon(object.coordinates);
        break;
      case "MultiPolygon":
        //console.log("parsed MultiPolygon");
        ret = this.readMultiPolygon(object.coordinates);
        break;
      case "GeometryCollection":
        //console.log("parsed GeometryCollection");
        nextset = [];
        for (i = 0; i < object.geometries.length; i++) {
          next = this.readGJObject(object.geometries[i]);
          nextset.push(next);
        }
        ret = nextset;
        break;
      case "Feature":
        //console.log("parsed Feature");
        next = this.readGJObject(object.geometry);
        ret = next;
        break;
      case "FeatureCollection":
        //console.log("parsed FeatureCollection");
        nextset = [];
        for (i = 0; i < object.features.length; i++) {
          next = this.readGJObject(object.features[i]);
          nextset.push(next);
        }
        ret = nextset;
        break;
      default:
        console.log("Don't understand type " + type);
        ret = null;
      break;
    }
    return ret;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * @param object
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readGJObject = function(object) {
    //var time1, time2;
    var ret;
    //time1 = new Date().getTime()
    ret = this.readGJObjectInt(object);
    //time2 = new Date().getTime()
    //console.log("ELAPSED: ", time2-time1)
    return ret;
  };

  /**
   * Linearize geometries
   *
   * @param geoms
   * @param geom
   */
  this.linearizeGeoms = function(geoms, geom) {
    var i = null;

    if( Object.prototype.toString.call( geom ) === '[object Array]' ) {
      for (i = 0; i < geom.length; i++) {
        this.linearizeGeoms(geoms, geom[i]);
      }
    }
    else {
     geoms.push(geom);
   }
 };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Read geometries from geojson object
   *
   * @param object
   * @returns {Array}
   */
 ////////////////////////////////////////////////////////////////////////////
 this.readGeomObject = function(object) {
    var geom,
        geoms = [];

    geom = this.readGJObject(object);
    this.linearizeGeoms(geoms, geom);
    return geoms;
 };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Given a buffer get rendering primitives
   *
   * @param buffer
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.getPrimitives = function(buffer) {
    //console.log("Parsing geoJSON");
    if (!buffer) {
      return [];
    }

    var obj = JSON.parse(buffer),
      geom = this.readGJObject(obj),
      geoms = [];

    this.m_scalarFormat = "none";
    this.m_scalarRange = null;

    this.linearizeGeoms(geoms, geom);

    return { "geoms":geoms,
             "scalarFormat":this.m_scalarFormat,
             "scalarRange":this.m_scalarRange };
  };

  return this;
};
