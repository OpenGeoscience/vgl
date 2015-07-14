//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of clas blendFunction
 *
 * @class
 * @param source
 * @param destination
 * @returns {vgl.blendFunction}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.blendFunction = function (source, destination) {
  'use strict';

  if (!(this instanceof vgl.blendFunction)) {
    return new vgl.blendFunction(source, destination);
  }

  /** @private */
  var m_source = source,
      m_destination = destination;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Apply blend function to the current state
   *
   * @param {vgl.renderState}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.apply = function (renderState) {
    renderState.m_context.blendFuncSeparate(m_source, m_destination,
                         vgl.GL.ONE, vgl.GL.ONE_MINUS_SRC_ALPHA);
  };

  return this;
};

////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class blend
 *
 * @returns {vgl.blend}
 */
////////////////////////////////////////////////////////////////////////////
vgl.blend = function () {
  'use strict';

  if (!(this instanceof vgl.blend)) {
    return new vgl.blend();
  }
  vgl.materialAttribute.call(
    this, vgl.materialAttributeType.Blend);

  /** @private */
  var m_wasEnabled = false,
      m_blendFunction = vgl.blendFunction(vgl.GL.SRC_ALPHA,
                                          vgl.GL.ONE_MINUS_SRC_ALPHA);

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Bind blend attribute
   *
   * @param {vgl.renderState}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bind = function (renderState) {
    m_wasEnabled = renderState.m_context.isEnabled(vgl.GL.BLEND);

    if (this.enabled()) {
      renderState.m_context.enable(vgl.GL.BLEND);
      m_blendFunction.apply(renderState);
    } else {
      renderState.m_context.disable(vgl.GL.BLEND);
    }

    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Undo bind blend attribute
   *
   * @param {vgl.renderState}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.undoBind = function (renderState) {
    if (m_wasEnabled) {
      renderState.m_context.enable(vgl.GL.BLEND);
    } else {
      renderState.m_context.disable(vgl.GL.BLEND);
    }

    return true;
  };

  return this;
};

inherit(vgl.blend, vgl.materialAttribute);
