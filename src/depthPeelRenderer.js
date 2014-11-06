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
      finalShader, NUM_PASSES = 6, m_quad = null;

  function drawFullScreenQuad(renderState, material) {
    m_quad.setMaterial(material);

    renderState.m_mapper = m_quad.mapper();
    renderState.m_material = material;

    renderState.m_material.render(renderState);
    renderState.m_mapper.render(renderState);
    renderState.m_material.remove(renderState);

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
    var fpmv, fpproj, fpvertex, fpcolor, fpdepthTex,
        blmv, blproj, blvertex, bltempTex,
        fimv, fiproj, fivertex, fitempTex;

    // Load the front to back peeling shader
    fpvertex = new vgl.vertexAttribute("vertexPosition");
    fpcolor = new vgl.vertexAttribute("vColor");
    fpmv = new vgl.modelViewUniform("modelViewMatrix");
    fpproj = new vgl.projectionUniform("projectionMatrix");
    fpdepthTex = new vgl.uniform(vgl.GL.INT, "depthTexture");
    fpdepthTex.set(0);

    frontPeelShader = new vgl.shaderProgram();
    frontPeelShader.loadFromFile(vgl.GL.VERTEX_SHADER,   "shaders/front_peel.vert");
    frontPeelShader.loadFromFile(vgl.GL.FRAGMENT_SHADER, "shaders/front_peel.frag");

    frontPeelShader.addUniform(fpmv);
    frontPeelShader.addUniform(fpproj);
    frontPeelShader.addUniform(fpdepthTex);
    frontPeelShader.addVertexAttribute(fpvertex, vgl.vertexAttributeKeys.Position);
    frontPeelShader.addVertexAttribute(fpcolor, vgl.vertexAttributeKeys.Color);

    // Compile and link the shader
    frontPeelShader.compileAndLink();
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
    blendShader.loadFromFile(vgl.GL.VERTEX_SHADER,   "shaders/blend.vert");
    blendShader.loadFromFile(vgl.GL.FRAGMENT_SHADER, "shaders/blend.frag");
    bltempTex = new vgl.uniform(vgl.GL.INT, "tempTexture");
    bltempTex.set(0);
    blvertex = new vgl.vertexAttribute("vertexPosition");

    blendShader.addUniform(bltempTex);
    blendShader.addVertexAttribute(blvertex, vgl.vertexAttributeKeys.Position);

    // Compile and link the shader
    blendShader.compileAndLink();
    blMaterial.addAttribute(blendShader);

    //     //add attributes and uniforms
    //     blendShader.AddAttribute("vVertex");
    //     blendShader.AddUniform("tempTexture");
    //     //pass constant uniforms at initialization
    //     glUniform1i(blendShader("tempTexture"), 0);
    // blendShader.UnUse();

    //Load the final shader
    finalShader = fiMaterial.shaderProgram();
    finalShader.loadFromFile(vgl.GL.VERTEX_SHADER,   "shaders/blend.vert");
    finalShader.loadFromFile(vgl.GL.FRAGMENT_SHADER, "shaders/final.frag");


    //fimv = new vgl.modelViewUniform("modelViewMatrix");
    //fiproj = new vgl.projectionUniform("projectionMatrix");
    fitempTex = new vgl.uniform(vgl.GL.INT, "colorTexture");
    fitempTex.set(0);
    fivertex = new vgl.vertexAttribute("vertexPosition");

    //finalShader.addUniform(fimv);
    //finalShader.addUniform(fiproj);
    finalShader.addUniform(fitempTex);
    finalShader.addVertexAttribute(fivertex, vgl.vertexAttributeKeys.Position);
    finalShader.compileAndLink();
    fiMaterial.addAttribute(finalShader);
  }

  function initFBO(renderState, WIDTH, HEIGHT) {
    var i;

    // Or browser-appropriate prefix
    var depthTextureExt = gl.getExtension("WEBKIT_WEBGL_depth_texture");
    if(!depthTextureExt) {
        console.log("depth textures are not supported");
    }

    var floatTextureExt = gl.getExtension("OES_texture_float");
    if(!floatTextureExt) {
        console.log("float textures are not supported");
    }

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

        // Second initialize the colour attachment
        gl.bindTexture(vgl.GL.TEXTURE_2D,texID[i]);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_MAG_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_MIN_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP_TO_EDGE);
        gl.texParameteri(vgl.GL.TEXTURE_2D , vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP_TO_EDGE);
        gl.texImage2D(vgl.GL.TEXTURE_2D , 0, vgl.GL.RGBA, WIDTH, HEIGHT, 0,
                      vgl.GL.RGBA, vgl.GL.FLOAT, null);

        // Bind FBO and attach the depth and colour attachments
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, fbo[i]);
        gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT,
                                vgl.GL.TEXTURE_2D, depthTexID[i], 0);
        gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.COLOR_ATTACHMENT0,
                                vgl.GL.TEXTURE_2D, texID[i], 0);
    }

    // Now setup the colour attachment for colour blend FBO
    colorBlenderTexID = gl.createTexture();
    gl.bindTexture(vgl.GL.TEXTURE_2D, colorBlenderTexID);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP_TO_EDGE);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP_TO_EDGE);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_MIN_FILTER, vgl.GL.NEAREST);
    gl.texParameteri(vgl.GL.TEXTURE_2D, vgl.GL.TEXTURE_MAG_FILTER, vgl.GL.NEAREST);
    gl.texImage2D(vgl.GL.TEXTURE_2D, 0, vgl.GL.RGBA, WIDTH, HEIGHT,
                  0, vgl.GL.RGBA, vgl.GL.FLOAT, null);

    // Generate the colour blend FBO ID
    colorBlenderFBOID = gl.createFramebuffer();
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

    // Set the depth attachment of previous FBO as depth attachment for this FBO
    gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT,
                            vgl.GL.TEXTURE_2D, depthTexID[0], 0);
    // Set the colour blender texture as the FBO colour attachment
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
    // TODO FIXME
    // // Enable alpha blending with over compositing
    // glEnable(GL_BLEND);
    // glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    for ( i = 0; i < sortedActors.length; ++i) {
      actor = sortedActors[i][1];

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
      renderState.m_material = actor.material();
      renderState.m_mapper = actor.mapper();

      // TODO Fix this shortcut
      if (!material) {
          renderState.m_material.render(renderState);
          renderState.m_mapper.render(renderState);
          renderState.m_material.remove(renderState);
      } else {
        renderState.m_material = material;
        renderState.m_material.render(renderState);
        renderState.m_mapper.render(renderState);
        renderState.m_material.remove(renderState);
      }
    }
  }

  function depthPeelRender(renderState, actors) {
    var layer;

    // Clear colour and depth buffer
    gl.clear(vgl.GL.OLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);

    // Bind the colour blending FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

    // Set the first colour attachment as the draw buffer
    //gl.drawBuffer(vgl.GL.COLOR_ATTACHMENT0);

    //clear the colour and depth buffer
    gl.clearColor(1, 0, 0, 0);
    gl.clear(vgl.GL.COLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT );

    // 1. In the first pass, we render normally with depth test enabled to get the nearest surface
    gl.enable(vgl.GL.DEPTH_TEST);

    drawScene(renderState, actors);

    // 2. Depth peeling + blending pass
    var numLayers = (NUM_PASSES - 1) * 2;

    // For each pass
    for (layer = 1; layer < numLayers; layer++) {
        var currId = layer % 2;
        var prevId = 1 - currId;

        // Bind the current FBO
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, fbo[currId]);

        //set the first colour attachment as draw buffer
        //gl.drawBuffer(vgl.GL.COLOR_ATTACHMENT0);

        // Set clear colour to black
        gl.clearColor(0, 0, 0, 0);

        // Clear the colour and depth buffers
        gl.clear(vgl.GL.COLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);

        // Disbale blending and depth testing
        gl.disable(vgl.GL.BLEND);
        gl.enable(vgl.GL.DEPTH_TEST);

        // Bind the depth texture from the previous step
        gl.bindTexture(vgl.GL.TEXTURE_2D, depthTexID[prevId]);

        // Render scene with the front to back peeling shader
        drawScene(renderState, actors, fpMaterial);

        // Bind the colour blender FBO
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

        // Render to its first colour attachment
        //gl.drawBuffer(vgl.GL.COLOR_ATTACHMENT0);

        // Enable blending but disable depth testing
        gl.disable(vgl.GL.DEPTH_TEST);
        gl.enable(vgl.GL.BLEND);

        // Change the blending equation to add
        gl.blendEquation(vgl.GL.FUNC_ADD);

        // Use separate blending function
        gl.blendFuncSeparate(vgl.GL.DST_ALPHA, vgl.GL.ONE,
                             vgl.GL.ZERO, vgl.GL.ONE_MINUS_SRC_ALPHA);

        // Bind the result from the previous iteration as texture
        gl.bindTexture(vgl.GL.TEXTURE_2D, texID[currId]);

        drawFullScreenQuad(renderState, blMaterial);

        // // Bind the blend shader and then draw a fullscreen quad
        // blendShader.Use();
        //     drawFullScreenQuad();
        // blendShader.UnUse();

        // Disable blending
        gl.disable(vgl.GL.BLEND);
    }

    // 3. Final render pass
    //remove the FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, null);

    // Set clear colour to black
    gl.clearColor(1, 0, 0, 0);

    // Clear the colour and depth buffers
    gl.clear(vgl.GL.COLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);

    // Restore the default back buffer
    //gl.drawBuffer(vgl.GL.GL_BACK_LEFT);

    // Disable depth testing and blending
    gl.disable(vgl.GL.DEPTH_TEST);
    gl.disable(vgl.GL.BLEND);

    // Bind the colour blender texture
    gl.bindTexture(vgl.GL.TEXTURE_2D, colorBlenderTexID);

    // Draw full screen quad
    drawFullScreenQuad(renderState, fiMaterial);

    // // Bind the final shader
    // // TODO FIXME
    // finalShader.Use();
    //     // Set shader uniforms
    //     // TODO FIXME
    //     glUniform4fv(finalShader("vBackgroundColor"), 1, &bg.x);

    //     // Draw full screen quad
    //     drawFullScreenQuad(finaShader);
    // // TODO FIXME
    // finalShader.UnUse();
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Render the scene
   */
  ////////////////////////////////////////////////////////////////////////////
  this.render = function() {
    var i, renSt, children, actor = null, sortedActors = [],
        mvMatrixInv = mat4.create(), clearColor = null;

    renSt = new vgl.renderState();

    clearColor = m_this.m_camera.clearColor();
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    gl.clearDepth(m_this.m_camera.clearDepth());
    gl.clear(m_this.m_camera.clearMask());

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

      sortedActors.push([actor.material().binNumber(), actor]);
    }

    // Now perform sorting
    sortedActors.sort(function(a, b) {return a[0] - b[0];});

    depthPeelRender(renSt, sortedActors);
  };
};

inherit(vgl.depthPeelRenderer, vgl.renderer);
