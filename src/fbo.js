vgl.renderTarget = function() {
  'use strict';

  if (!(this instanceof vgl.fbo)) {
    return new vgl.fbo();
  }
  vgl.object.call(this);

  this.setup = function(renderState) {
  };

  this.render = function(renderState) {
  };

  this.remove = function(renderState) {
  }
};

inherit(vgl.renderTarget, vgl.object);


//////////////////////////////////////////////////////////////////////////////
vgl.fbo = function() {
  'use strict';

  if (!(this instanceof vgl.fbo)) {
    return new vgl.fbo();
  }
  vgl.renderTarget.call(this);

  var m_width = 0, m_height = 0, m_handle = 0, m_fboAttachmentMap = {},
      m_fboCreationTime = vgl.timestamp(), m_this = this;

  ////////////////////////////////////////////////////////////////////////////
  function createFBO(renderState) {
    gl.genFramebuffers(1, m_handle);
    gl.bindFramebuffer(gl.FRAMEBUFFER, m_handle);

    var colorBufferHandle, depthBufferHandle,
        colorTexture = m_fboAttachmentMap[vgl.COLOR_ATTACHMENT0],
        depthTexture = m_fboAttachmentMap[vgl.DEPTH_ATTACHMENT];

    if (colorTexture) {
      colorBufferHandle = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, colorBufferHandle);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGB565, m_width, m_height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorBufferHandle);
      m_fboAttachmentMap[vgl.COLOR_ATTACHMENT0] = colorBufferHandle;
    }
    else {
      updateTextureDimensions(colorTexture);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                              gl.TEXTURE_2D, colorTexture.textureHandle(), 0);
    }

    if (!depthTexture) {
      depthBufferHandle =  gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthBufferHandle);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, m_width, m_height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                                 gl.RENDERBUFFER, depthBufferHandle);
      m_fboAttachmentMap[vgl.DEPTH_ATTACHMENT] = depthBufferHandle;
    }
    else {
      updateTextureDimensions(depthTexture);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D,
        depthTexture.textureHandle(), 0);
    }

    m_fboCreationTime.modified();
  }

  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  function deleteFBO() {
    m_this.unbind();
    for (key in m_fboAttachmentMap) {
      gl.deleteRenderbuffer(key);
    }
    gl.deleteFramebuffer(m_handle);
  }

  ////////////////////////////////////////////////////////////////////////////
  function updateTextureDimensions(texture) {
    if (!texture) {
      return;
    }

    if (texture.width() != m_width) {
      texture.setWidth(m_width);
    }

    if (texture.height() != m_height) {
      texture.setHeight(m_height);
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  this.setTexture = function(type, texture) {
    if (type in m_fboAttachmentMap &&
        m_fboAttachmentMap.hasOwnProperty(type)) {
      m_fboAttachmentMap[type] = texture;
      m_this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  this.texture = function(type) {
    if (type in m_fboAttachmentMap &&
        m_fboAttachmentMap.hasOwnProperty(type)) {
      return m_fboAttachmentMap[type];
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  this.setWidth = function(width) {
    if (m_width !== width) {
      m_width = width;
      m_this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  this.width = function() {
    return m_width;
  };

  ////////////////////////////////////////////////////////////////////////////
  this.setHeight = function(height) {
    if (m_height !== height) {
      m_height = height;
      m_this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  this.height = function() {
    return m_height;
  };

  ////////////////////////////////////////////////////////////////////////////
  this.setup = function(renderState) {
    if (m_fboCreationTime.getMTime() < m_this.getMTime()) {
      deleteFBO();
      createFBO();
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  this.render = function() {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status == gl.FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, m_handle);
    } else {
      console.log("[error] Unable to render imcomplete buffer " + status);
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  this.remove = function(renderState) {
     gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
  }
};

inherit(vgl.fbo, vgl.renderTarget);