//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, gl, inherit */
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
    /* For post-blending alpha, use the blendFuncSeparate call.  However, some
     * comptuers (notably MacBook Pros) don't accelerate blendFuncSeparate,
     * so it is often faster to use pre-blended alpha.
     * gl.blendFuncSeparate(m_source, m_destination, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
     */
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
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
      m_blendFunction = vgl.blendFunction(gl.SRC_ALPHA,
                                                gl.ONE_MINUS_SRC_ALPHA);

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Bind blend attribute
   *
   * @param {vgl.renderState}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bind = function (renderState) {
    m_wasEnabled = gl.isEnabled(gl.BLEND);

    if (this.enabled()) {
      gl.enable(gl.BLEND);
      m_blendFunction.apply(renderState);
    } else {
      gl.disable(gl.BLEND);
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
      gl.enable(gl.BLEND);
    } else {
      gl.disable(gl.BLEND);
    }

    return true;
  };

  return this;
};

inherit(vgl.blend, vgl.materialAttribute);
