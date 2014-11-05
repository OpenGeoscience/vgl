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
      cubeShader = null, frontPeelShader = null, NUM_PASSES = 6;

  function renderScene(actors, material) {

  }

  function renderQuad() {

  }

  function initShaders(renderState, WIDTH, HEIGHT) {

  }

  function initFBO(renderState, WIDTH, HEIGHT) {
    var i;

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
        gl.bindTexture(vgl.GL.TEXTURE_RECTANGLE, depthTexID[i]);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_MAG_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_MIN_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP);
        glTexImage2D(vgl.GL.TEXTURE_RECTANGLE , 0, vgl.GL.DEPTH_COMPONENT32F,
                     WIDTH, HEIGHT, 0, vgl.GL.DEPTH_COMPONENT, vgl.GL.FLOAT, NULL);

        // Second initialize the colour attachment
        gl.bindTexture(vgl.GL.TEXTURE_RECTANGLE,texID[i]);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_MAG_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_MIN_FILTER, vgl.GL.NEAREST);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP);
        gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE , vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP);
        gl.texImage2D(vgl.GL.TEXTURE_RECTANGLE , 0,vgl.GL.RGBA, WIDTH, HEIGHT, 0,
                      vgl.GL.RGBA, vgl.GL.FLOAT, NULL);

        // Bind FBO and attach the depth and colour attachments
        glBindFramebuffer(vgl.GL.FRAMEBUFFER, fbo[i]);
        glFramebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT,
                               vgl.GL.TEXTURE_RECTANGLE, depthTexID[i], 0);
        glFramebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.COLOR_ATTACHMENT0,
                               vgl.GL.TEXTURE_RECTANGLE, texID[i], 0);
    }

    // Now setup the colour attachment for colour blend FBO
    colorBlenderTexID = gl.createTexture();
    gl.bindTexture(vgl.GL.TEXTURE_RECTANGLE, colorBlenderTexID);
    gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE, vgl.GL.TEXTURE_WRAP_S, vgl.GL.CLAMP);
    gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE, vgl.GL.TEXTURE_WRAP_T, vgl.GL.CLAMP);
    gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE, vgl.GL.TEXTURE_MIN_FILTER, vgl.GL.NEAREST);
    gl.texParameteri(vgl.GL.TEXTURE_RECTANGLE, vgl.GL.TEXTURE_MAG_FILTER, vgl.GL.NEAREST);
    gl.texImage2D(vgl.GL.TEXTURE_RECTANGLE, 0, vgl.GL.RGBA, WIDTH, HEIGHT,
                  0, vgl.GL.RGBA, vgl.GL.FLOAT, 0);

    // Generate the colour blend FBO ID
    colorBlenderFBOID = gl.createFramebuffer();
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

    // Set the depth attachment of previous FBO as depth attachment for this FBO
    gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT,
                            vgl.GL.TEXTURE_RECTANGLE, depthTexID[0], 0);
    // Set the colour blender texture as the FBO colour attachment
    gl.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.COLOR_ATTACHMENT0,
                            vgl.GL.TEXTURE_RECTANGLE, colorBlenderTexID, 0);

    // Check the FBO completeness status
    GLenum status = gl.checkFramebufferStatus(vgl.GL.FRAMEBUFFER);
    if(status == vgl.GL.FRAMEBUFFER_COMPLETE )
        printf("FBO setup successful !!! \n");
    else
        printf("Problem with FBO setup");

    // Unbind FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, 0);
  }

  function setup(renderState) {
    if (setupTime.getMTime() < m_this.getMTime()) {
      initShaders(renderState, m_this.width(), m_this.height());
      initFBO(renderState, m_this.width(), m_this.height());
    }
  }

  function drawScene(renderState, shader) {

  }

  function depthPeelRender(renderState) {
    var layer;

    // Clear colour and depth buffer
    gl.clear(vgl.GL.OLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);

    // Bind the colour blending FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

    // Set the first colour attachment as the draw buffer
    gl.drawBuffer(vgl.GL.COLOR_ATTACHMENT0);

    //clear the colour and depth buffer
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

    // 1. In the first pass, we render normally with depth test enabled to get the nearest surface
    gl.enable(GL_DEPTH_TEST);

    drawScene(renderState, cubeShader);

    // 2. Depth peeling + blending pass
    var numLayers = (NUM_PASSES - 1) * 2;

    // For each pass
    for (layer = 1; layer < numLayers; layer++) {
        var currId = layer % 2;
        var prevId = 1 - currId;

        // Bind the current FBO
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, fbo[currId]);

        //set the first colour attachment as draw buffer
        gl.drawBuffer(vgl.GL.COLOR_ATTACHMENT0);

        // Set clear colour to black
        gl.clearColor(0, 0, 0, 0);

        // Clear the colour and depth buffers
        gl.clear(vgl.GL.COLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);

        // Disbale blending and depth testing
        gl.disable(vgl.GL.BLEND);
        gl.enable(vgl.GL.DEPTH_TEST);

        // Bind the depth texture from the previous step
        gl.bindTexture(vgl.GL.TEXTURE_RECTANGLE, depthTexID[prevId]);

        // Render scene with the front to back peeling shader
        drawScene(renderState, frontPeelShader);

        // Bind the colour blender FBO
        gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, colorBlenderFBOID);

        // Render to its first colour attachment
        gl.drawBuffer(vgl.GL.COLOR_ATTACHMENT0);

        // Enable blending but disable depth testing
        gl.disable(vgl.GL.DEPTH_TEST);
        gl.enable(vgl.GL.BLEND);

        // Change the blending equation to add
        gl.blendEquation(GL_FUNC_ADD);

        // Use separate blending function
        gl.blendFuncSeparate(vgl.GL.DST_ALPHA, vgl.GL.ONE,
                             vgl.GL.ZERO, vgl.GL.ONE_MINUS_SRC_ALPHA);

        // Bind the result from the previous iteration as texture
        gl.bindTexture(vgl.GL.TEXTURE_RECTANGLE, texID[currId]);

        // Bind the blend shader and then draw a fullscreen quad
        blendShader.Use();
            drawFullScreenQuad();
        blendShader.UnUse();

        // Disable blending
        gl.disable(vgl.GL.BLEND);
    }

    // 3. Final render pass
    //remove the FBO
    gl.bindFramebuffer(vgl.GL.FRAMEBUFFER, 0);

    // Restore the default back buffer
    gl.drawBuffer(vgl.GL.GL_BACK_LEFT);

    // Disable depth testing and blending
    gl.disable(vgl.GL.DEPTH_TEST);
    gl.disable(vgl.GL.BLEND);

    // Bind the colour blender texture
    gl.bindTexture(vgl.GL.TEXTURE_RECTANGLE, colorBlenderTexID);

    // Bind the final shader
    // TODO FIXME
    finalShader.Use();
        // Set shader uniforms
        // TODO FIXME
        glUniform4fv(finalShader("vBackgroundColor"), 1, &bg.x);

        // Draw full screen quad
        drawFullScreenQuad();
    // TODO FIXME
    finalShader.UnUse();
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

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    if (m_camera.clearMask() & vgl.GL.COLOR_BUFFER_BIT) {
      clearColor = m_camera.clearColor();
      gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    }

    if (m_camera.clearMask() & vgl.GL.DEPTH_BUFFER_BIT) {
      gl.clearDepth(m_camera.clearDepth());
    }

    gl.clear(m_camera.clearMask());

    // Set the viewport for this renderer
    gl.viewport(m_x, m_y, m_width, m_height);

    // Check if we have initialized
    setup(renderSt);

    children = m_sceneRoot.children();

    if (children.length > 0 && m_resetScene) {
      this.resetCamera();
      m_resetScene = false;
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

    for ( i = 0; i < sortedActors.length; ++i) {
      actor = sortedActors[i][1];

      if (actor.referenceFrame() ===
          vgl.boundingObject.ReferenceFrame.Relative) {
        mat4.multiply(renSt.m_modelViewMatrix, m_camera.viewMatrix(),
          actor.matrix());
        renSt.m_projectionMatrix = m_camera.projectionMatrix();
      } else {
        renSt.m_modelViewMatrix = actor.matrix();
        renSt.m_projectionMatrix = mat4.create();
        mat4.ortho(renSt.m_projectionMatrix, 0, m_width, 0, m_height, -1, 1);
      }

      mat4.invert(mvMatrixInv, renSt.m_modelViewMatrix);
      mat4.transpose(renSt.m_normalMatrix, mvMatrixInv);
      renSt.m_material = actor.material();
      renSt.m_mapper = actor.mapper();

      // TODO Fix this shortcut
      renSt.m_material.render(renSt);
      renSt.m_mapper.render(renSt);
      renSt.m_material.remove(renSt);
    }
  };
};

inherit(vgl.depthPeelRenderer, vgl.renderer);
