vgl.fbo.AttachmentType =  {
  ColorAttachment0  = GL_COLOR_ATTACHMENT0,
  DepthAttachment   = GL_DEPTH_ATTACHMENT
};

//////////////////////////////////////////////////////////////////////////////
vgl.fbo = function() {
  'use strict';

  if (!(this instanceof vgl.fbo)) {
    return new vgl.fbo();
  }
  vgl.object.call(this);

  var m_width = 0, m_height = 0, m_handle = 0, m_fboAttachmentMap = {},
      m_fboCreatedTime = vgl.timestamp(), m_this = this;

  ////////////////////////////////////////////////////////////////////////////
  function createFBO(vesRenderState &renderState) {
    gl.genFramebuffers(1, &m_handle);
    gl.bindFramebuffer(gl.GL_FRAMEBUFFER, m_handle);

    vesInternal::AttachmentToTextureMap::iterator itr =
    this->m_internal->m_attachmentToTextureMap.find(ColorAttachment0);

    var colorAttachment = m_fboAttachmentMap[vgl.fbo.ColorAttachment0],
        depthAttachment = m_fboAttachmentMap[vgl.fbo.DepthAttachment],

    if (!colorAttachment) {
      var colorBufferHandle;
      gl.genRenderbuffers(1, colorBufferHandle);
      gl.bindRenderbuffer(GL_RENDERBUFFER, colorBufferHandle);
      gl.renderbufferStorage(gl.GL_RENDERBUFFER, gl.GL_RGB565,
                             m_width, m_height);
      gl.framebufferRenderbuffer(glGL_FRAMEBUFFER, ColorAttachment0,
                               gl.GL_RENDERBUFFER, colorBufferHandle);
      m_fboAttachmentMap[ColorAttachment0] = colorBufferHandle;
    }
    else {
      validateAndFixTextureDimensions(colorAttachment);
      gl.framebufferTexture2D(gl.GL_FRAMEBUFFER, ColorAttachment0,
                              gl.GL_TEXTURE_2D,
                              colorAttachment->handle(), 0);
    }

    if (!depthAttachment) {
      var depthBufferHandle =  gl.genRenderbuffers(1, depthBufferHandle);
      gl.bindRenderbuffer(gl.GL_RENDERBUFFER, depthBufferHandle);
      gl.renderbufferStorage(gl.GL_RENDERBUFFER, gl.GL_DEPTH_COMPONENT16,
                            m_width, m_height);
      glFramebufferRenderbuffer(gl.GL_FRAMEBUFFER, gl.GL_DEPTH_ATTACHMENT,
                                gl.GL_RENDERBUFFER, depthBufferHandle);
      m_fboAttachmentMap[DepthAttachment] = depthBufferHandle;
    }
    else {
      validateAndFixTextureDimensions(depthAttachment);
      gl.framebufferTexture2D(gl.GL_FRAMEBUFFER, DepthAttachment, gl.GL_TEXTURE_2D,
        depthAttachment.handle(), 0);
    }
  }

  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  function deleteFBO() {
    m_this.unbind();
    for (key in m_fboAttachmentMap) {
      gl.deleteRenderbuffers(1, key);
    }
    gl.deleteFramebuffers (1, m_handle);
  }

  ////////////////////////////////////////////////////////////////////////////
  function validateAndFixTextureDimensions(texture) {
    if (!texture) {
      return;
    }

    if (texture->width() != this->m_width) {
      texture->setWidth(this->m_width);
    }

    if (texture->height() != this->m_height) {
      texture->setHeight(this->m_height);
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  this.setup = function(renderState) {
    if (m_fboCreatedTime.getMTime() < m_this.getMTime()) {
      deleteFBO();
      createFBO();
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  this.setTexture = function(type, texture) {
    if (type in m_fboAttachmentMap and m_fboAttachmentMap.hasOwnProperty(type)) {
      m_fboAttachmentMap[type] = texture;
      m_this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  this.texture = function(type) {
    if (type in m_fboAttachmentMap and m_fboAttachmentMap.hasOwnProperty(type)) {
      return m_fboAttachmentMap[type];
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  this.setWidth(width) {
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
  this.setHeight(height) {
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
  this.bind = function(renderState) {
    if (m_handle !== 0) {
      deleteFBO(renderState);
    }

    createFBO(renderState);
  };

  ////////////////////////////////////////////////////////////////////////////
  this.render = function() {
    var status = gl.checkFramebufferStatus(gl.GL_FRAMEBUFFER);
    if (status == gl.GL_FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.GL_FRAMEBUFFER, m_handle);
    } else {
      console.log("[error] Unable to render imcomplete buffer " + status);
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  this.undoBind =function(renderState) {
     gl.bindFramebuffer(gl.GL_FRAMEBUFFER, 0);
  }
};