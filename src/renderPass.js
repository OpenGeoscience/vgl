//////////////////////////////////////////////////////////////////////////////
vgl.renderPass = function() {
  'use strict';

  if (!(this instanceof vgl.renderPass)) {
    return new vgl.renderPass();
  }
  vgl.object.call(this);

  var m_this = this,
      m_renderTarget = null,
      m_renderer = vgl.renderer();

  this.setRenderer = function(ren) {
    if (ren !== m_renderer) {
      m_renderer = ren;
      m_this.modified();
    }
  };

  this.renderer = function() {
    return m_renderer;
  };

  this.setRenderTarget = function(renTgt) {
    if (m_renderTarget !== renTgt) {
      m_renderTarget = renTgt;
      m_this.modified();
    }
  };

  this.renderTarget = function() {
    return m_renderTarget;
  };

  this.render = function(renderState) {
    if (m_renderTarget) {
      return m_renderTarget.render(renderState);
    }
  };
};