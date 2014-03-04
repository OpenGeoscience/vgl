//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2, bitwise: true*/


/*global vgl, vec4, mat4, inherit, unescape*/
/*global Float32Array, Int8Array, gl, Uint16Array, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//
// vbgModule.vtkReader class
// This contains code that unpack a json base64 encoded vtkdataset,
// such as those produced by ParaView's webGL exporter (where much
// of the code originated from) and convert it to VGL representation.
//
//////////////////////////////////////////////////////////////////////////////

vgl.vtkReader = function() {
  'use strict';

  if (!(this instanceof vgl.vtkReader)) {
    return new vgl.vtkReader();
  }

  var m_base64Chars =
    ['A','B','C','D','E','F','G','H','I','J','K','L','M',
     'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
     'a','b','c','d','e','f','g','h','i','j','k','l','m',
     'n','o','p','q','r','s','t','u','v','w','x','y','z',
     '0','1','2','3','4','5','6','7','8','9','+','/'],
  m_reverseBase64Chars = [],
  m_vtkObjectList = {},
  m_vtkRenderedList = {},
  m_vtkObjHashList = [],
  m_vtkObjectCount = 0,
  m_vtkScene = null,
  m_node = null,
  END_OF_INPUT = -1,
  m_base64Str = "",
  m_base64Count = 0,
  m_pos = 0,
  m_viewer = null,
  i = 0;

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
    var unN;

    unN = n.toString(16);
    if (unN.length === 1) {
      unN = '0' + unN;
    }
    unN = '%' + unN;

    return unescape(unN);
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
    var test = new Int8Array(numberOfPoints*4*3),
        points = null, i;

    for(i = 0; i < numberOfPoints*4*3; i++) {
      test[i] = ss[m_pos++];
    }

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
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parseObject = function(vtkObject, renderer) {
    var geom = new vgl.geometryData(),
        mapper = vgl.mapper(),
        ss = [], type = null, data = null, size,
        matrix = null, material = null,
        actor = null, shaderProg, opacityUniform;

    //dehexlify
    data = this.decode64(vtkObject.data);
    for(i = 0; i < data.length; i++) {
      ss[i] = data.charCodeAt(i) & 0xff;
    }

    //Determine the Object type
    m_pos = 0;
    size = this.readNumber(ss);
    type = String.fromCharCode(ss[m_pos++]);
    geom.setName(type);

    // Lines
    if (type === 'L') {
      matrix = this.parseLineData(geom, ss);
      material = vgl.utils.createGeometryMaterial();
    }
    // Mesh
    else if (type === 'M') {
      matrix = this.parseMeshData(geom, ss);
      material = vgl.utils.createPhongMaterial();
    }
    // Points
    else if (type === 'P'){
      matrix = this.parsePointData(geom, ss);
      material = vgl.utils.createGeometryMaterial();
    }
    // ColorMap
    else if (type === 'C') {
      matrix = this.parseColorMapData(geom, ss, size);
      material = vgl.utils.createGeometryMaterial();
    }
    // Unknown
    else {
      console.log("Ignoring unrecognized encoded data type " + type);
    }

    mapper.setGeometryData(geom);

    //default opacity === solid. If were transparent, set it lower.
    if (vtkObject.hasTransparency) {
      shaderProg = material.shaderProgram();
      opacityUniform = shaderProg.uniform("opacity");
      shaderProg.addUniform(new vgl.floatUniform("opacity", 0.5));
      material.setBinNumber(1000);
    }

    actor = vgl.actor();
    actor.setMapper(mapper);
    actor.setMaterial(material);
    actor.setMatrix(mat4.transpose(mat4.create(), matrix));
    renderer.addActor(actor);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * parseLineData
   *
   * @param geom, ss
   * @returns matrix
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parseLineData = function(geom, ss) {
    var vglpoints = null, vglcolors = null, vgllines = null,
        matrix = mat4.create(),
        numberOfIndex, numberOfPoints, points,
        temp, index, size, m, i;

    numberOfPoints = this.readNumber(ss);

    //Getting Points
    vglpoints = new vgl.sourceDataP3fv();
    points = this.readF3Array(numberOfPoints, ss);
    for(i = 0; i < numberOfPoints; i++) {
      vglpoints.pushBack([points[i*3/*+0*/], points[i*3+1], points[i*3+2]]);
    }
    geom.addSource(vglpoints);

    //Getting Colors
    vglcolors = new vgl.sourceDataC3fv();
    this.readColorArray(numberOfPoints, ss, vglcolors);
    geom.addSource(vglcolors);

    //Getting connectivity
    vgllines = new vgl.lines();
    geom.addPrimitive(vgllines);
    numberOfIndex = this.readNumber(ss);

    temp = new Int8Array(numberOfIndex*2);
    for(i = 0; i < numberOfIndex*2; i++) {
      temp[i] = ss[m_pos++];
    }

    index = new Uint16Array(temp.buffer);
    vgllines.setIndices(index);
    vgllines.setPrimitiveType(gl.LINES);

    //Getting Matrix
    size = 16*4;
    temp = new Int8Array(size);
    for(i=0; i<size; i++) {
      temp[i] = ss[m_pos++];
    }

    m = new Float32Array(temp.buffer);
    mat4.copy(matrix, m);

    return matrix;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * parseMeshData
   *
   * @param geom, ss
   * @returns matrix
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parseMeshData = function(geom, ss) {
    var vglpoints = null, vglcolors = null, vgllines = null,
        normals = null, matrix = mat4.create(), v1 = null,
        vgltriangles = null, numberOfIndex, numberOfPoints,
    points, temp, index, size, m, i, tcoord;

    numberOfPoints = this.readNumber(ss);

    //Getting Points
    vglpoints = new vgl.sourceDataP3N3f();
    points = this.readF3Array(numberOfPoints, ss);

    //Getting Normals
    normals = this.readF3Array(numberOfPoints, ss);

    for(i = 0; i < numberOfPoints; i++) {
      v1 = new vgl.vertexDataP3N3f();
      v1.m_position = [points[i*3/*+0*/], points[i*3+1], points[i*3+2]];
      v1.m_normal = [normals[i*3/*+0*/], normals[i*3+1], normals[i*3+2]];
      vglpoints.pushBack(v1);
    }
    geom.addSource(vglpoints);

    //Getting Colors
    vglcolors = new vgl.sourceDataC3fv();
    this.readColorArray(numberOfPoints, ss, vglcolors);
    geom.addSource(vglcolors);

    //Getting connectivity
    temp = [];
    vgltriangles = new vgl.triangles();
    numberOfIndex = this.readNumber(ss);

    temp = new Int8Array(numberOfIndex*2);
    for(i = 0; i < numberOfIndex*2; i++) {
      temp[i] = ss[m_pos++];
    }

    index = new Uint16Array(temp.buffer);
    vgltriangles.setIndices(index);
    geom.addPrimitive(vgltriangles);

    //Getting Matrix
    size = 16*4;
    temp = new Int8Array(size);
    for(i = 0; i < size; i++) {
      temp[i] = ss[m_pos++];
    }

    m = new Float32Array(temp.buffer);
    mat4.copy(matrix, m);

    //Getting TCoord
    //TODO: renderer is not doing anything with this yet
    tcoord = null;

    return matrix;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * parsePointData
   *
   * @param geom, ss
   * @returns matrix
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parsePointData = function(geom, ss) {
    var numberOfPoints, points, indices, temp, size,
        matrix = mat4.create(), vglpoints = null,
        vglcolors = null, vglVertexes = null, m;

    numberOfPoints = this.readNumber(ss);

    //Getting Points and creating 1:1 connectivity
    vglpoints = new vgl.sourceDataP3fv();
    points = this.readF3Array(numberOfPoints, ss);

    indices = new Uint16Array(numberOfPoints);
    for (i = 0; i < numberOfPoints; i++) {
      indices[i] = i;
      vglpoints.pushBack([points[i*3/*+0*/],points[i*3+1],points[i*3+2]]);
    }
    geom.addSource(vglpoints);

    //Getting Colors
    vglcolors = new vgl.sourceDataC3fv();
    this.readColorArray(numberOfPoints, ss, vglcolors);
    geom.addSource(vglcolors);

    //Getting connectivity
    vglVertexes = new vgl.points();
    vglVertexes.setIndices(indices);
    geom.addPrimitive(vglVertexes);

    //Getting matrix
    size = 16*4;
    temp = new Int8Array(size);
    for(i = 0; i < size; i++) {
      temp[i] = ss[m_pos++];
    }

    m = new Float32Array(temp.buffer);
    mat4.copy(matrix, m);

    return matrix;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * parseColorMapData
   *
   * @param geom, ss
   * @returns matrix
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parseColorMapData = function(geom, ss, numColors) {

/******* NOTE:,
         This code is a copy of the webgl version, not yet implemented here.
    var tmpArray, size, xrgb, i, c;


    // Getting Position
    size = 2 * 4;
    tmpArray = new Int8Array(size);
    for(i=0; i < size; i++) {
      tmpArray[i] = ss[m_pos++];
    }
    obj.position = new Float32Array(tmpArray.buffer);

    // Getting Size
    size = 2 * 4;
    tmpArray = new Int8Array(2*4);
    for(i=0; i < size; i++) {
      tmpArray[i] = binaryArray[cursor++];
    }
    obj.size = new Float32Array(tmpArray.buffer);

    //Getting Colors
    obj.colors = [];
    for(c=0; c < obj.numOfColors; c++){
      tmpArray = new Int8Array(4);
      for(i=0; i < 4; i++) {
        tmpArray[i] = binaryArray[cursor++];
      }
      xrgb = [
        new Float32Array(tmpArray.buffer)[0],
        binaryArray[cursor++],
        binaryArray[cursor++],
        binaryArray[cursor++]
      ];
      obj.colors[c] = xrgb;
    }

    obj.orientation = binaryArray[cursor++];
    obj.numOfLabels = binaryArray[cursor++];
    obj.title = "";
    while(cursor < binaryArray.length) {
      obj.title += String.fromCharCode(binaryArray[cursor++]);
    }

*/
    return null;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * parseSceneMetadata
   *
   * @param data
   * @returns renderer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parseSceneMetadata = function(renderer, layer) {

    var sceneRenderer = m_vtkScene.Renderers[layer],
        camera = renderer.camera(), bgc, localWidth, localHeight;

    localWidth = (sceneRenderer.size[0] - sceneRenderer.origin[0])*m_node.width;
    localHeight = (sceneRenderer.size[1] - sceneRenderer.origin[1])*m_node.height;
    renderer.resize(localWidth, localHeight);

    /// We are setting the center to the focal point because of
    /// a possible paraview web bug. The center of rotation isn't
    /// getting updated correctly on resetCamera.
    camera.setCenterOfRotation(
      [sceneRenderer.LookAt[1], sceneRenderer.LookAt[2],
       sceneRenderer.LookAt[3]]);
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

    if (layer === 0)
    {
      bgc = sceneRenderer.Background1;
      renderer.setBackgroundColor(bgc[0], bgc[1], bgc[2], 1);
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * updateViewer
   *
   * @param node
   * @returns viewer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.updateViewer = function() {
    var renderer, objIdx, vtkObject, layer, layerList, tmpList;

    tmpList = this.clearVtkObjectData();
    for(layer = m_vtkScene.Renderers.length - 1; layer >= 0; layer--) {
      layerList = tmpList[layer];
      if (layerList === null || typeof layerList === 'undefined') {
        continue;
      }

      renderer = this.getRenderer(layer);
      this.parseSceneMetadata(renderer, layer);

      //We've done an initial resize, so prevent further
      if (layer > 0) {
        renderer.setResizable(false);
      }

      for(objIdx = 0; objIdx < layerList.length; objIdx++) {
        vtkObject = layerList[objIdx];
        this.parseObject(vtkObject, renderer);
      }
    }

    return m_viewer;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * createViewer - Creates a new viewer object.
   *
   * @param
   *
   * @returns void
   */
  ////////////////////////////////////////////////////////////////////////////
  this.createNewViewer = function(node) {
    var interactorStyle;

    if(m_viewer === null) {
      m_node = node;
      m_viewer = vgl.viewer(node);
      m_viewer.init();
      m_vtkRenderedList[0] = m_viewer.renderWindow().activeRenderer();
      m_viewer.renderWindow().resize(node.width, node.height);
      interactorStyle = vgl.pvwInteractorStyle();
      m_viewer.setInteractorStyle(interactorStyle);
    }

    return m_viewer;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * updateCanvas -
   *
   * @param
   *
   * @returns void
   */
  ////////////////////////////////////////////////////////////////////////////
  this.updateCanvas = function(node) {
    m_node = node;
    m_viewer.renderWindow().resize(node.width, node.height);

    return m_viewer;
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
    var layerList, i, md5;

    if ( m_vtkObjectList.hasOwnProperty(vtkObject.layer) === false ) {
      m_vtkObjectList[vtkObject.layer] = [];
    }

    layerList = m_vtkObjectList[vtkObject.layer];
    if (typeof layerList === 'undefined') {
      console.log("Layer list undefined for layer: " + vtkObject.layer);
    }

    for (i = 0; i < m_vtkObjHashList.length; ++i) {
      md5 = m_vtkObjHashList[i];
      if (vtkObject.md5 === md5) {
        return;
      }
    }

    // Add the md5 for this object so we don't add it again.
    m_vtkObjHashList.push(vtkObject.md5);
    m_vtkObjectList[vtkObject.layer].push(vtkObject);
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
  this.numObjects = function() {
    return m_vtkObjectCount;
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
    var tmpList = m_vtkObjectList;
    m_vtkObjectList = {};
    return tmpList;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * getRenderer - Gets (or creates) the renderer for a layer.
   *
   * @param layer
   * @returns renderer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.getRenderer = function(layer) {
    var renderer;

    renderer = m_vtkRenderedList[layer];
    if (renderer === null || typeof renderer === 'undefined') {
      if (layer === 0) {
        console.log(
          "Error: layer 0 redererer is active render but is missing from list");
        renderer = m_viewer.renderWindow().activeRenderer();
        m_vtkRenderedList[layer] = renderer;
        return renderer;
      }

      renderer = new vgl.renderer();
      m_viewer.renderWindow().addRenderer(renderer);

      //We're assuming this is not layer 0.
      //That renderer is created by default.
      renderer.camera().setClearMask(vgl.GL.DepthBufferBit);
      m_vtkRenderedList[layer] = renderer;
    }

    return renderer;
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
