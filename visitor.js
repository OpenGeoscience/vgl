//////////////////////////////////////////////////////////////////////////////
/**
 * @module ogs.vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vglModule, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 *
 * @type {{TraverseNone: number, TraverseParents: number,
 *         TraverseAllChildren: number, TraverseActiveChildren: number}}
 */
  //////////////////////////////////////////////////////////////////////////////
var TraversalMode = {
  "TraverseNone" : 0x1,
  "TraverseParents" : 0x2,
  "TraverseAllChildren" : 0x4,
  "TraverseActiveChildren" : 0x8
};

//////////////////////////////////////////////////////////////////////////////
/**
 *
 * @type {{ActorVisitor: number, UpdateVisitor: number, EventVisitor: number,
 *         CullVisitor: number}}
 */
//////////////////////////////////////////////////////////////////////////////
var VisitorType = {
  "ActorVisitor" : 0x1,
  "UpdateVisitor" : 0x2,
  "EventVisitor" : 0x4,
  "CullVisitor" : 0x8
};

//////////////////////////////////////////////////////////////////////////////
/**
 *
 * @returns {*}
 */
//////////////////////////////////////////////////////////////////////////////
vglModule.visitor = function() {
  vglModule.object.call(this);

  var m_visitorType = VisitorType.UpdateVisitor,
      m_traversalMode = TraversalMode.TraverseAllChildren,
      m_modelViewMatrixStack = [],
      m_projectionMatrixStack = [];

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @param mat
   */
  ////////////////////////////////////////////////////////////////////////////
  this.pushModelViewMatrix = function(mat) {
    this.m_modelViewMatrixStack.push(mat);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  ////////////////////////////////////////////////////////////////////////////
  this..popModelViewMatrix = function() {
    this.m_modelViewMatrixStack.pop();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @param mat
   */
  ////////////////////////////////////////////////////////////////////////////
  this.pushProjectionMatrix = function(mat) {
    this.m_projectionMatrixStack.push(mat);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  ////////////////////////////////////////////////////////////////////////////
  this.popProjectionMatrix = function() {
    this.m_projectionMatrixStack.pop();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.modelViewMatrix = function() {
    mvMat = mat4.create();
    mat4.identity(mvMat);

    for ( var i = 0; i < this.m_modelViewMatrixStack.length; ++i) {
      mat4.multiply(mvMat, this.m_modelViewMatrixStack[i], mvMat);
    }

    return mvMat;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.projectionMatrix = function() {
    projMat = mat4.create();
    mat4.identity(projMat);

    for ( var i = 0; i < this.m_modelViewMatrixStack.length; ++i) {
      mat4.multiply(mvMat, this.m_modelViewMatrixStack[i], projMat);
    }

    return projMat;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @param node
   */
  ////////////////////////////////////////////////////////////////////////////
  this.traverse = function(node) {
    if (node instanceof node) {
      if (this.m_traversalMode === TraversalMode.TraverseParents) {
        node.ascend(this);
      }
      else {
        node.traverse(this);
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @param node
   */
  ////////////////////////////////////////////////////////////////////////////
  this.visit = function(node) {
    this.traverse(node);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @param actor
   */
  ////////////////////////////////////////////////////////////////////////////
  this.visit = function(actor) {
    this.traverse(actor);
  };

  return this;
}
inherit(visitor, vglModule.object);