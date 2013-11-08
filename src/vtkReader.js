//////////////////////////////////////////////////////////////////////////////
/**
 * @module ogs.vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vglModule, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//
// vbgModule.vtkReader class
// This contains code that unpack a json base64 encoded vtkdataset,
// such as those produced by ParaView's webGL exporter (where much
// of the code originated from) and convert it to VGL representation.
//
//////////////////////////////////////////////////////////////////////////////

vglModule.vtkReader = function() {
  'use strict';

  if (!(this instanceof vglModule.vtkReader)) {
    return new vglModule.vtkReader();
  }

  var m_base64Chars =
    ['A','B','C','D','E','F','G','H','I','J','K','L','M',
     'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
     'a','b','c','d','e','f','g','h','i','j','k','l','m',
     'n','o','p','q','r','s','t','u','v','w','x','y','z',
     '0','1','2','3','4','5','6','7','8','9','+','/'],
  m_reverseBase64Chars = [],
  m_vtkObjectList = [],
  m_vtkObjectCount = 0,
  m_vtkScene = null,
  END_OF_INPUT = -1,
  m_base64Str = "",
  m_base64Count = 0,
  m_pos = 0,
  i = null;

  //initialize the array here if not already done.
  if (m_reverseBase64Chars.length === 0) {
    for ( i = 0; i < m_base64Chars.length; i++) {
      m_reverseBase64Chars[m_base64Chars[i]] = i;
    }
  }



  ////////////////////////////////////////////////////////////////////////////
  /**
   * ntos
   *
   * @param n
   * @returns unescaped n
   */
  ////////////////////////////////////////////////////////////////////////////
  this.ntos = function (n) {
    var unN,
    uri;

    n = n.toString(16);
    if (n.length === 1) {
      n = '0' + n;
    }
    n = '%' + n;

    /*global unescape*/
    return unescape(n);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * readReverseBase64
   *
   * @returns
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readReverseBase64 = function () {
    var nextCharacter;

    if (!m_base64Str) {
      return END_OF_INPUT;
    }

    while (true) {
      if (m_base64Count >= m_base64Str.length) {
        return END_OF_INPUT;
      }
      nextCharacter = m_base64Str.charAt(m_base64Count);
      m_base64Count++;

      if (m_reverseBase64Chars[nextCharacter]) {
        return m_reverseBase64Chars[nextCharacter];
      }
      if (nextCharacter === 'A') {
        return 0;
      }
    }

    return END_OF_INPUT;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * decode64
   *
   * @param str
   * @returns result
   */
  ////////////////////////////////////////////////////////////////////////////
  this.decode64 = function(str) {
    var result = '',
    inBuffer = new Array(4),
    done = false;

    m_base64Str = str;
    m_base64Count = 0;

    /*jslint bitwise: true*/
    while (!done &&
           (inBuffer[0] = this.readReverseBase64()) !== END_OF_INPUT &&
           (inBuffer[1] = this.readReverseBase64()) !== END_OF_INPUT) {
      inBuffer[2] = this.readReverseBase64();
      inBuffer[3] = this.readReverseBase64();
      result += this.ntos((((inBuffer[0] << 2) & 0xff) | inBuffer[1] >> 4));
      if (inBuffer[2] !== END_OF_INPUT) {
        result +=  this.ntos((((inBuffer[1] << 4) & 0xff) | inBuffer[2] >> 2));
        if (inBuffer[3] !== END_OF_INPUT) {
          result +=  this.ntos((((inBuffer[2] << 6) & 0xff) | inBuffer[3]));
        } else {
          done = true;
        }
      } else {
        done = true;
      }
    }

    return result;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * readNumber
   *
   * @param ss
   * @returns v
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readNumber = function(ss) {
    /*jslint bitwise: true*/
    var v = ((ss[m_pos++]) +
             (ss[m_pos++] << 8) +
             (ss[m_pos++] << 16) +
             (ss[m_pos++] << 24));
    return v;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * readF3Array
   *
   * @param numberOfPoints
   * @param ss
   * @returns points
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readF3Array = function(numberOfPoints, ss) {
    /*global Int8Array*/
    var test = new Int8Array(numberOfPoints*4*3),
    points = null, i;

    for(i = 0; i < numberOfPoints*4*3; i++) {
      test[i] = ss[m_pos++];
    }

    /*global Float32Array*/
    points = new Float32Array(test.buffer);

    return points;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * readColorArray
   *
   * @param numberOfPoints
   * @param ss
   * @param vglcolors
   * @returns points
   */
  ////////////////////////////////////////////////////////////////////////////
  this.readColorArray = function (numberOfPoints, ss, vglcolors) {
    var i,r,g,b;
    for(i = 0; i < numberOfPoints; i++) {
      r = ss[m_pos++]/255.0;
      g = ss[m_pos++]/255.0;
      b = ss[m_pos++]/255.0;
      m_pos++;
      vglcolors.pushBack([r,g,b]);
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * parseObject
   *
   * @param buffer
   * @returns geom
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parseObject = function(buffer) {
    var geom = new vglModule.geometryData(), numberOfPoints,
    numberOfIndex, points, normals, colors, index,
    ss = [], test, i, size, type = null, data = null,
    vglpoints = null, vglVertexes = null, vglcolors = null,
    vgllines = null, indices = null, v1 = null,
    vgltriangles = null, tcoord, matrix;

    geom.setName("World");

    //dehexlify
    data = this.decode64(buffer);
    for(i = 0; i < data.length; i++) {
      /*jslint bitwise: true*/
      ss[i] = data.charCodeAt(i) & 0xff;
    }

    m_pos = 0;
    size = this.readNumber(ss);
    type = String.fromCharCode(ss[m_pos++]);

    //-=-=-=-=-=[ LINES ]=-=-=-=-=-
    if (type === 'L') {
      numberOfPoints = this.readNumber(ss);

      //Getting Points
      vglpoints = new vglModule.sourceDataP3fv();
      points = this.readF3Array(numberOfPoints, ss);
      for(i = 0; i < numberOfPoints; i++) {
        vglpoints.pushBack([points[i*3/*+0*/], points[i*3+1], points[i*3+2]]);
      }
      geom.addSource(vglpoints);

      //Getting Colors
      vglcolors = new vglModule.sourceDataC3fv();
      this.readColorArray(numberOfPoints, ss, vglcolors);
      geom.addSource(vglcolors);

      //Getting connectivity
      vgllines = new vglModule.lines();
      geom.addPrimitive(vgllines);
      numberOfIndex = this.readNumber(ss);

      /*global Int8Array*/
      test = new Int8Array(numberOfIndex*2);
      for(i = 0; i < numberOfIndex*2; i++) {
        test[i] = ss[m_pos++];
      }

      /*global Uint16Array*/
      index = new Uint16Array(test.buffer);
      vgllines.setIndices(index);

      /*global gl*/
      vgllines.setPrimitiveType(gl.LINES);

      /*
      //Getting Matrix
      //TODO: renderer is not doing anything with this yet
      test = new Int8Array(16*4);
      for(i=0; i<16*4; i++)
      test[i] = ss[m_pos++];
      matrix = new Float32Array(test.buffer);
      */
    }

    //-=-=-=-=-=[ MESH ]=-=-=-=-=-
    else if (type === 'M') {

      numberOfPoints = this.readNumber(ss);
      //console.log("MESH " + numberOfPoints)

      //Getting Points
      vglpoints = new vglModule.sourceDataP3N3f();
      points = this.readF3Array(numberOfPoints, ss);

      //Getting Normals
      normals = this.readF3Array(numberOfPoints, ss);

      for(i = 0; i < numberOfPoints; i++) {
        v1 = new vglModule.vertexDataP3N3f();
        v1.m_position = [points[i*3/*+0*/], points[i*3+1], points[i*3+2]];
        v1.m_normal = [normals[i*3/*+0*/], normals[i*3+1], normals[i*3+2]];
        vglpoints.pushBack(v1);
      }
      geom.addSource(vglpoints);

      //Getting Colors
      vglcolors = new vglModule.sourceDataC3fv();
      this.readColorArray(numberOfPoints, ss, vglcolors);
      geom.addSource(vglcolors);

      //Getting connectivity
      test = [];
      vgltriangles = new vglModule.triangles();
      geom.addPrimitive(vgltriangles);
      numberOfIndex = this.readNumber(ss);

      /*global Int8Array*/
      test = new Int8Array(numberOfIndex*2);
      for(i = 0; i < numberOfIndex*2; i++) {
        test[i] = ss[m_pos++];
      }

      /*global Uint16Array*/
      index = new Uint16Array(test.buffer);
      vgltriangles.setIndices(index);


      //Getting Matrix
      size = 16*4;
      test = new Int8Array(size);
      for(i = 0; i < size; i++) {
        test[i] = ss[m_pos++];
      }

      matrix = new Float32Array(test.buffer);

      //Getting TCoord
      //TODO: renderer is not doing anything with this yet
      tcoord = null;

    }

    // Points
    else if (type === 'P'){
      numberOfPoints = this.readNumber(ss);
      //console.log("POINTS " + numberOfPoints);

      //Getting Points and creating 1:1 connectivity
      vglpoints = new vglModule.sourceDataP3fv();
      points = this.readF3Array(numberOfPoints, ss);

      /*global Uint16Array*/
      indices = new Uint16Array(numberOfPoints);
      for (i = 0; i < numberOfPoints; i++) {
        indices[i] = i;
        vglpoints.pushBack([points[i*3/*+0*/],points[i*3+1],points[i*3+2]]);
      }
      geom.addSource(vglpoints);

      //Getting Colors
      vglcolors = new vglModule.sourceDataC3fv();
      this.readColorArray(numberOfPoints, ss, vglcolors);
      geom.addSource(vglcolors);

      //Getting connectivity
      vglVertexes = new vglModule.points();
      vglVertexes.setIndices(indices);
      geom.addPrimitive(vglVertexes);

      /*
      //Getting Matrix
      //TODO: not used yet
      test = new Int8Array(16*4);
      for(i=0; i<16*4; i++)
      test[i] = ss[m_pos++];
      matrix = new Float32Array(test.buffer);
      */
    }

    //ColorMap
    else if (type === 'C') {

    }

    // Unknown
    else {
      console.log("Ignoring unrecognized encoded data type " + type);
    }

    return geom;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * parseSceneMetadata
   *
   * @param data
   * @returns renderer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parseSceneMetadata = function(renderer, sceneJSON) {

    var sceneRenderer = sceneJSON.Renderers[0],
        camera = renderer.camera(), bgc;

    camera.setCenterOfRotation(sceneJSON.Center);
    camera.setViewAngleDegrees(sceneRenderer.LookAt[0]);
    camera.setPosition(
      sceneRenderer.LookAt[7], sceneRenderer.LookAt[8],
      sceneRenderer.LookAt[9]);
    camera.setFocalPoint(
      sceneRenderer.LookAt[1], sceneRenderer.LookAt[2],
      sceneRenderer.LookAt[3]);
    camera.setViewUpDirection(
      sceneRenderer.LookAt[4], sceneRenderer.LookAt[5],
      sceneRenderer.LookAt[6]);

    bgc = sceneRenderer.Background1;
    renderer.setBackgroundColor(bgc[0], bgc[1], bgc[2], 1);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * createViewer
   *
   * @param data
   * @returns renderer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.createViewer = function(node) {
    var viewer, renderer, mapper, material, objIdx = 0,
        actor, interactorStyle, bgc, geom, rawGeom, vtkObject,
        shaderProg, opacityUniform;

    if (m_vtkScene === null || m_vtkObjectCount === 0) {
      return null;
    }

    viewer = ogs.vgl.viewer(node);
    viewer.init();

    viewer.renderWindow().resize(node.width, node.height);
    renderer = viewer.renderWindow().activeRenderer();

    for(objIdx; objIdx < m_vtkObjectCount; objIdx++) {
      mapper = ogs.vgl.mapper();
      vtkObject = m_vtkObjectList[objIdx];
      rawGeom = vtkObject.data;
      geom = this.parseObject(rawGeom);
      mapper.setGeometryData(geom);
      material = ogs.vgl.utils.createBlinnPhongMaterial();
//createGeometryMaterial();

      //default opacity === solid. If were transparent, set it lower.
      if (vtkObject.hasTransparency) {
        shaderProg = material.shaderProgram();
        opacityUniform = shaderProg.uniform("opacity");
        opacityUniform = new ogs.vgl.floatUniform("opacity", 0.5);
        shaderProg.addUniform(opacityUniform);
      }

      actor = ogs.vgl.actor();
      actor.setMapper(mapper);
      actor.setMaterial(material);
      renderer.addActor(actor);
    }

    this.parseSceneMetadata(renderer, m_vtkScene);
    interactorStyle = ogs.vgl.trackballInteractorStyle();
    viewer.setInteractorStyle(interactorStyle);

    return viewer;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * addVtkObjectData - Adds binary VTK geometry data to the list for parsing.
   *
   * @param vtkObject
   *
   *        vtkObject = {
   *                      data:,
   *                      hasTransparency:,
   *                      layer:
   *                    };
   *
   *
   * @returns void
   */
  ////////////////////////////////////////////////////////////////////////////
  this.addVtkObjectData = function(vtkObject) {
    m_vtkObjectList[m_vtkObjectCount] = vtkObject;
    m_vtkObjectCount++;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * clearVtkObjectData - Clear out the list of VTK geometry data.
   *
   * @param void
   * @returns void
   */
  ////////////////////////////////////////////////////////////////////////////
  this.clearVtkObjectData = function() {
    m_vtkObjectList = [];
    m_vtkObjectCount = 0;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * setVtkScene - Set the VTK scene data for camera initialization.
   *
   * @param scene
   * @returns void
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setVtkScene = function(scene) {
    m_vtkScene = scene;
  };

  return this;
};
