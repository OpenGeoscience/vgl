////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class renderer *
 *
 * @returns {vgl.renderer}
 */
////////////////////////////////////////////////////////////////////////////
vgl.depthPeelRenderer = function() {
  'use strict';

  if (!(this instanceof vgl.depthPeelRenderer)) {
    return new vgl.depthPeelRenderer();
  }
  vgl.renderer.call(this);

  var m_this = this, fbo = [], texID = [], depthTexID = [],
      colorBlenderTexID, colorBlenderFBOID, setupTime = vgl.timestamp(),
      fpMaterial = vgl.material(), blMaterial = vgl.material(),
      fiMaterial = vgl.material(), frontPeelShader = null, blendShader = null,
      finalShader, NUM_PASSES = 6, m_quad = null, fpwidth, fpheight, blwidth, blheight,
      fiwidth, fiheight, fpopacity, fibackgroundColor;


  function drawFullScreenQuad(renderState, material) {
    m_quad.setMaterial(material);

    renderState.m_mapper = m_quad.mapper();
    renderState.m_material = material;

    renderState.m_material.bind(renderState);
    renderState.m_mapper.render(renderState);
    renderState.m_material.undoBind(renderState);

    m_quad.setMaterial(null);
  }

  function initScreenQuad(renderState, width, height) {
    console.log(width);
    console.log(height);
    m_quad = vgl.utils.createPlane(0.0, 0.0, 0.0,
                                   1.0, 0.0, 0.0,
                                   0.0, 1.0, 0.0);
  }

  function initShaders(renderState, WIDTH, HEIGHT) {
    var fpmv, fpproj, fpvertex, fpcolor, fpdepthTex, fpnormal, fpnr, fpblend,
        blmv, blproj, blvertex, blColorSamp, blPrevDepthSamp, blCurrDepthSamp,
        fimv, fiproj, fivertex, fitempTex;

    // Load the front to back peeling shader
    fpvertex = new vgl.vertexAttribute("vertexPosition");
    fpnormal = new vgl.vertexAttribute("vertexNormal");
    fpcolor = new vgl.vertexAttribute("vertexColor");
    fpmv = new vgl.modelViewUniform("modelViewMatrix");
    fpnr = new vgl.modelViewUniform("normalMatrix");
    fpproj = new vgl.projectionUniform("projectionMatrix");
    fpwidth = new vgl.floatUniform("width");
    fpheight = new vgl.floatUniform("height");
    fpopacity = new vgl.floatUniform("opacity", 1.0);
    fpdepthTex = new vgl.uniform(vgl.GL.INT, "depthTexture");
    fpblend = new vgl.blend();
    fpdepthTex.set(0);

    frontPeelShader = new vgl.shaderProgram();
    frontPeelShader.loadShader(vgl.GL.VERTEX_SHADER, "front_peel.vert");
    frontPeelShader.loadShader(vgl.GL.FRAGMENT_SHADER, "front_peel.frag");

    frontPeelShader.addUniform(fpmv);
    frontPeelShader.addUniform(fpnr);
    frontPeelShader.addUniform(fpproj);
    frontPeelShader.addUniform(fpdepthTex);
    frontPeelShader.addUniform(fpwidth);
    frontPeelShader.addUniform(fpheight);
    frontPeelShader.addUniform(fpopacity);
    frontPeelShader.addVertexAttribute(fpvertex, vgl.vertexAttributeKeys.Position);
    frontPeelShader.addVertexAttribute(fpnormal, vgl.vertexAttributeKeys.Normal);
    frontPeelShader.addVertexAttribute(fpcolor, vgl.vertexAttributeKeys.Color);

    // Compile and link the shader
    frontPeelShader.compileAndLink();
    //fpMaterial.addAttribute(fpblend);
    fpMaterial.addAttribute(frontPeelShader);

    //     //add attributes and uniforms
    //     frontPeelShader.AddAttribute("vVertex");
    //     frontPeelShader.AddUniform("MVP");
    //     frontPeelShader.AddUniform("vColor");
    //     frontPeelShader.AddUniform("depthTexture");
    //     //pass constant uniforms at initialization
    //     glUniform1i(frontPeelShader("depthTexture"), 0);
    // frontPeelShader.UnUse();

    // Load the blending shader
    blendShader = new vgl.shaderProgram();
    blendShader.loadShader(vgl.GL.VERTEX_SHADER,   "blend.vert");
    blendShader.loadShader(vgl.GL.FRAGMENT_SHADER, "blend.frag");
    blColorSamp = new vgl.uniform(vgl.GL.INT, "currColorTexture");
    blPrevDepthSamp = new vgl.uniform(vgl.GL.INT, "prevDepthTexture");
    blCurrDepthSamp = new vgl.uniform(vgl.GL.INT, "currDepthTexture");

    blwidth = new vgl.floatUniform("width");
    blheight = new vgl.floatUniform("height");
    blColorSamp.set(0);
    blPrevDepthSamp.set(1);
    blCurrDepthSamp.set(2);

    blvertex = new vgl.vertexAttribute("vertexPosition");

    blendShader.addUniform(blColorSamp);
    blendShader.addUniform(blPrevDepthSamp);
    blendShader.addUniform(blPrevDepthSamp);
    blendShader.addUniform(blwidth);
    blendShader.addUniform(blheight);
    blendShader.addVertexAttribute(blvertex,
      vgl.vertexAttributeKeys.Position);

    // Compile and link the shader
    blendShader.compileAndLink();
    blMaterial.addAttribute(blendShader);

    //     //add attributes and uniforms
    //     blendShader.AddAttribute("vVertex");
    //     blendShader.AddUniform("currColorTexture");
    //     //pass constant uniforms at initialization
    //     glUniform1i(blendShader("currColorTexture"), 0);
    // blendShader.UnUse();

    //Load the final shader
    finalShader = new vgl.shaderProgram();
    finalShader.loadShader(vgl.GL.VERTEX_SHADER,   "blend.vert");
    finalShader.loadShader(vgl.GL.FRAGMENT_SHADER, "final.frag");


    //fimv = new vgl.modelViewUniform("modelViewMatrix");
    //fiproj = new vgl.projectionUniform("projectionMatrix");
    fitempTex = new vgl.uniform(vgl.GL.INT, "colorTexture");
    fiwidth = new vgl.floatUniform("width");
    fiheight = new vgl.floatUniform("height");
    fibackgroundColor = new vgl.uniform(vgl.GL.FLOAT_VEC3, "backgroundColor");
    fitempTex.set(0);
    fivertex = new vgl.vertexAttribute("vertexPosition");

    //finalShader.addUniform(fimv);
    //finalShader.addUniform(fiproj);
    finalShader.addUniform(fitempTex);
    finalShader.addUniform(fiwidth);
    finalShader.addUniform(fiheight);
    finalShader.addUniform(fibackgroundColor);
    finalShader.addVertexAttribute(fivertex, vgl.vertexAttributeKeys.Position);
    finalShader.compileAndLink();
    fiMaterial.addAttribute(finalShader);
  }

  function initFBO(renderState, WIDTH, HEIGHT) {
    var i, textureFloatExt, textureFloatLinearExt, depthTextureExt, filtering;

    // Or browser-appropriate prefix
    var depthTextureExt = gl.getExtension("WEBKIT_WEBGL_depth_texture");
    if(!depthTextureExt) {
        depthTextureExt = gl.getExtension("WEBGL_depth_texture");

        if(!depthTextureExt) {
            console.log("Depth textures are not supported");
        }
    }

    var floatTextureExt = gl.getExtension("OES_texture_float");
    if(!floatTextureExt) {
        console.log("float textures are not supported");
    }

    textureFloatExt = gl.getExtension("OES_texture_float");
    textureFloatLinearExt = gl.getExtension("OES_texture_float_linear");
    depthTextureExt = gl.getExtension("WEBGL_depth_texture");

    if(!depthTextureExt){
        console.log("Extension Depth texture is not working");
        alert(":( Sorry, Your browser doesn't support depth texture extension.");
        return;
    }

    filtering = textureFloatLinearExt ? vgl.GL.LINEAR : vgl.GL.NEAREST;

    //FBO initialization function
    // Generate 2 FBO
    fbo.push(gl.createFramebuffer());
    fbo.push(gl.createFramebuffer());

    // Create two textures
    texID.push(gl.createTexture());
    texID.push(gl.createTexture());

    //The FBO has two depth attachments
    depthTexID.push(gl.createTexture());
    depthTexID.push(gl.createTexture());

    // For each attachment
    for (i = 0; i < 2; i++) {
        // First initialize the depth texture
        gl.bindTexture(vgl.GL.TEXTURE_2D, depthTexID[i]);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_MAG_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_MIN_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP_TO_EDGE);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP_TO_EDGE);
        gl.texImage2D(vgl.GL.TEXTURE_2D , 0, vgl.GL.DEPTH_COMPONENT,
                      WIDTH, HEIGHT, 0, vgl.GL.DEPTH_COMPONENT, vgl.GL.UNSIGNED_SHORT, null);

        // Second initialize the color attachment
        gl.bindTexture(vgl.GL.TEXTURE_2D,texID[i]);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_MAG_FILTER, filtering);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_MIN_FILTER, filtering);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP_TO_EDGE);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP_TO_EDGE);
        gl.texImage2D(vgl.GL.TEXTURE_2D , 0, vgl.GL.RGBA, WIDTH, HEIGHT, 0,
                      vgl.GL.RGBA, vgl.GL.FLOAT, null);

        // Bind FBO and attach the depth and color attachments
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, fbo[i]);
        gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT,
                                vgl.GL.TEXTURE_2D, depthTexID[i], 0);
        gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.COLOR_ATTACHMENT0,
                                vgl.GL.TEXTURE_2D, texID[i], 0);
    }

    // Now setup the color attachment for color blend FBO
    colorBlenderTexID = gl.createTexture();
    gl.bindTexture(vgl.GL.TEXTURE_2D, colorBlenderTexID);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP_TO_EDGE);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP_TO_EDGE);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_MIN_FILTER, vgl.GL.NEAREST);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_MAG_FILTER, vgl.GL.NEAREST);
    gl.texImage2D(vgl.GL.TEXTURE_2D, 0, vgl.GL.RGBA, WIDTH, HEIGHT,
                  0, vgl.GL.RGBA, vgl.GL.FLOAT, null);

    // Generate the color blend FBO ID
    colorBlenderFBOID = gl.createFramebuffer();
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

    // Set the depth attachment of previous FBO as depth attachment for this FBO
    gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT,
                            vgl.GL.TEXTURE_2D, depthTexID[0], 0);

    // Set the color blender texture as the FBO color attachment
    gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.COLOR_ATTACHMENT0,
                            vgl.GL.TEXTURE_2D, colorBlenderTexID, 0);

    // Check the FBO completeness status
    status = gl.checkFramebufferStatus(vgl.GL.FRAMEBUFFER);
    if(status == vgl.GL.FRAMEBUFFER_COMPLETE )
        console.log("FBO setup successful !!! \n");
    else
        console.log("Problem with FBO setup");

    // Unbind FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, null);
  }

  function setup(renderState) {
    if (setupTime.getMTime() < m_this.getMTime()) {
      initScreenQuad(renderState, m_this.width(), m_this.height());
      initShaders(renderState, m_this.width(), m_this.height());
      initFBO(renderState, m_this.width(), m_this.height());
      setupTime.modified();
    }
  }

  function drawScene(renderState, sortedActors, material) {

    var i, actor, mvMatrixInv = mat4.create();

    // // Enable alpha blending with over compositing
    // gl.enable(vgl.GL.BLEND);
    // gl.blendFunc(vgl.GL.SRC_ALPHA, vgl.GL.ONE_MINUS_SRC_ALPHA);

    for ( i = 0; i < sortedActors.length; ++i) {
      actor = sortedActors[i][2];

      if (actor.referenceFrame() ===
          vgl.boundingObject.ReferenceFrame.Relative) {
        mat4.multiply(renderState.m_modelViewMatrix, m_this.m_camera.viewMatrix(),
          actor.matrix());
        renderState.m_projectionMatrix = m_this.m_camera.projectionMatrix();
      } else {
        renderState.m_modelViewMatrix = actor.matrix();
        renderState.m_projectionMatrix = mat4.create();
        mat4.ortho(renderState.m_projectionMatrix, 0,
                   m_this.m_width, 0, m_this.m_height, -1, 1);
      }

      mat4.invert(mvMatrixInv, renderState.m_modelViewMatrix);
      mat4.transpose(renderState.m_normalMatrix, mvMatrixInv);
      renderState.m_mapper = actor.mapper();

      // TODO Fix this shortcut
      if (!material) {
          renderState.m_material = actor.material();
          renderState.m_material.bind(renderState);
          renderState.m_mapper.render(renderState);
          renderState.m_material.undoBind(renderState);
      } else {

        var ou = actor.material().shaderProgram().uniform("opacity");
        if (ou) {
          fpopacity.set(ou.get()[0]);
        } else {
          fpopacity.set(1.0);
        }
        renderState.m_material = material;
        renderState.m_material.bind(renderState);
        renderState.m_mapper.render(renderState);
        renderState.m_material.undoBind(renderState);
      }
    }
  }

  function depthPeelRender(renderState, actors) {
    var layer;

    fpwidth.set(m_this.width());
    fpheight.set(m_this.height());
    blwidth.set(m_this.width());
    blheight.set(m_this.height());
    fiwidth.set(m_this.width());
    fiheight.set(m_this.height());

    // Clear color and depth buffer
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(vgl.GL.OLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);

    // Bind the color blending FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

    // 1. In the first pass, we render normally with depth test enabled to get the nearest surface
    gl.enable(vgl.GL.DEPTH_TEST);
    gl.disable(vgl.GL.BLEND);

    var clearColor = m_this.m_camera.clearColor();
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 0.0);
    gl.clear(vgl.GL.COLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT );

    drawScene(renderState, actors);

    // 2. Depth peeling + blending pass
    var numLayers = (NUM_PASSES - 1) * 2;

    // For each pass
    for (layer = 1; layer < numLayers; layer++) {
        var currId = layer % 2;
        var prevId = 1 - currId;

        // Bind the current FBO
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, fbo[currId]);

        // Disbale blending and enable depth testing
        gl.disable(vgl.GL.BLEND);
        gl.enable(vgl.GL.DEPTH_TEST);

        // Bind the depth texture from the previous step
        gl.bindTexture(vgl.GL.TEXTURE_2D, depthTexID[prevId]);

        // Set clear color to black
        gl.clearColor(0., 0., 0., 0.0);

        // Clear the color and depth buffers
        gl.clear(vgl.GL.COLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);

        // Render scene with the front to back peeling shader
        drawScene(renderState, actors, fpMaterial);

        // Bind the color blender FBO
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

        // Enable blending but disable depth testing
        gl.disable(vgl.GL.DEPTH_TEST);
        gl.enable(vgl.GL.BLEND);

        // Change the blending equation to add
        gl.blendEquation(vgl.GL.FUNC_ADD);

        // Use separate blending function
        gl.blendFuncSeparate(vgl.GL.DST_ALPHA, vgl.GL.ONE,
                             vgl.GL.ZERO, vgl.GL.ONE_MINUS_SRC_ALPHA);

        // Bind the result from the previous iteration as texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(vgl.GL.TEXTURE_2D, texID[currId]);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(vgl.GL.TEXTURE_2D, depthTexID[prevId]);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(vgl.GL.TEXTURE_2D, depthTexID[currId]);

        drawFullScreenQuad(renderState, blMaterial);

        gl.activeTexture(gl.TEXTURE0);

        // Disable blending
        gl.disable(vgl.GL.BLEND);
    }

    // 3. Final render pass
    //remove the FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, null);

    // Disable depth testing and blending
    gl.disable(vgl.GL.DEPTH_TEST);
    gl.disable(vgl.GL.BLEND);

    // Bind the color blender texture
    gl.bindTexture(vgl.GL.TEXTURE_2D, colorBlenderTexID);

    fibackgroundColor.set(m_this.m_camera.clearColor());

    // Draw full screen quad
    drawFullScreenQuad(renderState, fiMaterial);

    gl.bindTexture(vgl.GL.TEXTURE_2D, null);
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Render the scene
   */
  ////////////////////////////////////////////////////////////////////////////
  this.render = function() {
    var i, renSt, children, actor = null, sortedActors = [],
        mvMatrixInv = mat4.create();

    renSt = new vgl.renderState();

    // Set the viewport for this renderer
    gl.viewport(m_this.m_x, m_this.m_y, m_this.m_width, m_this.m_height);

    // Check if we have initialized
    setup(renSt);

    children = m_this.m_sceneRoot.children();

    if (children.length > 0 && m_this.m_resetScene) {
      this.resetCamera();
      m_this.m_resetScene = false;
    }

    for ( i = 0; i < children.length; ++i) {
      actor = children[i];
      actor.computeBounds();
      if (!actor.visible()) {
        continue;
      }

      sortedActors.push([actor.material().binNumber(),
        actor.material().shaderProgram().uniform("opacity").get()[0], actor]);
    }

    // Now perform sorting
    sortedActors.sort(function(a, b) {return a[0] - b[0];});
    sortedActors.sort(function(a, b) {return b[1] - a[1];});

    depthPeelRender(renSt, sortedActors);
  };
};

inherit(vgl.depthPeelRenderer, vgl.renderer);
