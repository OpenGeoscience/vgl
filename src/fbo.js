vgl.renderTarget = function() {
  'use strict';

  if (!(this instanceof vgl.fbo)) {
    return new vgl.fbo();
  }
  vgl.object.call(this);

  var m_preventRenderPropagation = false;


  this.preventRenderPropagation = function(val) {
    if (val) {
      m_preventRenderPropagation = val;
    }

    return m_preventRenderPropagation;
  }

  this.resize = function(width, height) {
  };

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
    m_handle = renderState.m_context.createFramebuffer();
    renderState.m_context.bindFramebuffer(vgl.GL.FRAMEBUFFER, m_handle);

    var colorBufferHandle, depthBufferHandle,
        colorTexture = m_fboAttachmentMap[vgl.GL.COLOR_ATTACHMENT0],
        depthTexture = m_fboAttachmentMap[vgl.GL.DEPTH_ATTACHMENT];

    if (!colorTexture) {
      colorBufferHandle = renderState.m_context.createRenderbuffer();
      renderState.m_context.bindRenderbuffer(vgl.GL.RENDERBUFFER, colorBufferHandle);
      renderState.m_context.renderbufferStorage(vgl.GL.RENDERBUFFER,
        vgl.GL.RGB565, m_width, m_height);
      renderState.m_context.framebufferRenderbuffer(vgl.GL.FRAMEBUFFER,
        vgl.GL.COLOR_ATTACHMENT0, vgl.GL.RENDERBUFFER, colorBufferHandle);
      m_fboAttachmentMap[vgl.COLOR_ATTACHMENT0] = colorBufferHandle;
    }
    else {
      updateTexture(colorTexture, renderState);
      colorTexture.bind(renderState);
      renderState.m_context.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.COLOR_ATTACHMENT0,
                              vgl.GL.TEXTURE_2D, colorTexture.textureHandle(), 0);
    }

    if (!depthTexture) {
      depthBufferHandle =  vgl.GL.createRenderbuffer();
      renderState.m_context.bindRenderbuffer(vgl.GL.RENDERBUFFER, depthBufferHandle);
      renderState.m_context.renderbufferStorage(vgl.GL.RENDERBUFFER, vgl.GL.DEPTH_COMPONENT16, m_width, m_height);
      renderState.m_context.framebufferRenderbuffer(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT,
                                 vgl.GL.RENDERBUFFER, depthBufferHandle);
      m_fboAttachmentMap[vgl.DEPTH_ATTACHMENT] = depthBufferHandle;
    }
    else {
      updateTexture(depthTexture, renderState);
      depthTexture.bind(renderState);
      renderState.m_context.framebufferTexture2D(vgl.GL.FRAMEBUFFER, vgl.GL.DEPTH_ATTACHMENT, vgl.GL.TEXTURE_2D,
        depthTexture.textureHandle(), 0);
    }

    m_fboCreationTime.modified();
  }

  ////////////////////////////////////////////////////////////////////////////
  function deleteFBO(renderState) {
    if (!m_handle) {
      return;
    }

    for (key in m_fboAttachmentMap) {
      renderState.m_context.deleteRenderbuffer(key);
    }
    renderState.m_context.deleteFramebuffer(m_handle);
  }

  ////////////////////////////////////////////////////////////////////////////
  function updateTexture(texture, renderState) {
    if (!texture) {
      return;
    }

    console.log('updateTexture ', m_width);
    console.log('updateTexture ', m_height);

    if (texture.width() != m_width) {
      texture.setWidth(m_width);
    }

    if (texture.height() != m_height) {
      texture.setHeight(m_height);
    }

    texture.setup(renderState);
  }

  ////////////////////////////////////////////////////////////////////////////
  this.setTexture = function(type, texture) {
    if (type in m_fboAttachmentMap &&
        m_fboAttachmentMap.hasOwnProperty(type)) {

      // TODO Release it
    }

    console.log(type);

    m_fboAttachmentMap[type] = texture;
    m_this.modified();
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
  this.resize = function(width, height) {
    m_width = width;
    m_height = height;
    m_this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  this.setup = function(renderState) {
    if (m_fboCreationTime.getMTime() < m_this.getMTime() ||
        renderState.m_contextChanged) {
      deleteFBO(renderState);
      createFBO(renderState);
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  this.render = function(renderState) {
    m_this.setup(renderState);

    var status = renderState.m_context.checkFramebufferStatus(vgl.GL.FRAMEBUFFER);
    if (status == vgl.GL.FRAMEBUFFER_COMPLETE) {
      renderState.m_context.bindFramebuffer(vgl.GL.FRAMEBUFFER, m_handle);
    } else {
      console.log("[error] Unable to render imcomplete buffer " + status);
    }

    return m_this.preventRenderPropagation();
  }

  ////////////////////////////////////////////////////////////////////////////
  this.remove = function(renderState) {
     renderState.m_context.bindFramebuffer(vgl.GL.FRAMEBUFFER, null);
  }
};

inherit(vgl.fbo, vgl.renderTarget);