vgl.fbo = function() {
  'use strict';

  if (!(this instanceof vgl.fbo)) {
    return new vgl.fbo();
  }
  vgl.object.call(this);

  var m_width = 0, m_height = 0, m_handle = 0, m_textureMap = {},
      m_this = this;

  function createFBO(vesRenderState &renderState) {
  }

  function deleteFBO() {
  }

  this.setTexture(type, texture) {
    if (type in m_textureMap and m_textureMap.hasOwnProperty(type)) {
      m_textureMap[type] = texture;
      m_this.modified();
    }
  }
  this.texture(type) {
    if (type in m_textureMap and m_textureMap.hasOwnProperty(type)) {
      return m_textureMap[type];
    }
  }

  this.setWidth(width) {
    if (m_width !== width) {
      m_width = width;
      m_this.modified();
    }
  }
  this.width = function() {
    return m_width;
  }

  this.setHeight(height) {
    if (m_height !== height) {
      m_height = height;
      m_this.modified();
    }
  }
  this.height = function() {
    return m_height;
  }

  this.bind() {
    if (m_handle !== 0) {
      deleteFBO();
    }

    createFBO();
  }

  this.render() {
    gl.genFramebuffers(1, &m_handle);
    gl.bindFramebuffer(gl.GL_FRAMEBUFFER, m_handle);

    vesInternal::AttachmentToTextureMap::iterator itr =
    this->m_internal->m_attachmentToTextureMap.find(ColorAttachment0);

  if(itr == this->m_internal->m_attachmentToTextureMap.end()) {
    unsigned int colorBufferHandle;
    glGenRenderbuffers(1, &colorBufferHandle);
    glBindRenderbuffer(GL_RENDERBUFFER, colorBufferHandle);
#ifdef VES_USE_DESKTOP_GL
    glRenderbufferStorage(GL_RENDERBUFFER, GL_RGBA4,
                          this->m_internal->m_width,
                          this->m_internal->m_height);
#else
    glRenderbufferStorage(GL_RENDERBUFFER, GL_RGB565,
                          this->m_internal->m_width,
                          this->m_internal->m_height);
#endif

    glFramebufferRenderbuffer(GL_FRAMEBUFFER, ColorAttachment0,
                              GL_RENDERBUFFER, colorBufferHandle);
    this->m_internal->m_attachmentToRBOMap[ColorAttachment0] = colorBufferHandle;
  }
  else {
    this->m_internal->validateAndFixTextureDimensions(itr->second);
    itr->second->setup(renderState);
    glFramebufferTexture2D(GL_FRAMEBUFFER, ColorAttachment0, GL_TEXTURE_2D,
      this->m_internal->m_attachmentToTextureMap[ColorAttachment0]->textureHandle(), 0);
  }

  itr = this->m_internal->m_attachmentToTextureMap.find(DepthAttachment);
  if(itr == this->m_internal->m_attachmentToTextureMap.end()) {
    unsigned int depthBufferHandle;
    glGenRenderbuffers(1, &depthBufferHandle);
    glBindRenderbuffer(GL_RENDERBUFFER, depthBufferHandle);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT16,
                          this->m_internal->m_width,
                          this->m_internal->m_height);

    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
                              GL_RENDERBUFFER, depthBufferHandle);
    this->m_internal->m_attachmentToRBOMap[DepthAttachment] = depthBufferHandle;
  }
  else {
    this->m_internal->validateAndFixTextureDimensions(itr->second);
    glFramebufferTexture2D(GL_FRAMEBUFFER, DepthAttachment, GL_TEXTURE_2D,
      this->m_internal->m_attachmentToTextureMap[DepthAttachment]->textureHandle(), 0);
  }

  this->setDirtyStateOff();
  }

  this.unbind() {
  }
};

vgl.fbo.AttachmentType =  {
  ColorAttachment0  = GL_COLOR_ATTACHMENT0,
  DepthAttachment   = GL_DEPTH_ATTACHMENT
};

#endif // VESFBO_H