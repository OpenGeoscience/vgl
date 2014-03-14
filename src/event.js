//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class event
 *
 * @class event
 * @returns {vgl.event}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.event = function() {
  'use strict';

  if (!(this instanceof vgl.event)) {
    return new vgl.event();
  }
  vgl.object.call(this);

  return this;
};

inherit(vgl.event, vgl.object);

//////////////////////////////////////////////////////////////////////////////
/**
 *  types
 */
//////////////////////////////////////////////////////////////////////////////
vgl.event.keyPress = "vgl.event.keyPress";
vgl.event.mousePress = "vgl.event.mousePress";
vgl.event.mouseRelease = "vgl.event.mouseRelease";
vgl.event.contextMenu = "vgl.event.contextMenu";
vgl.event.configure = "vgl.event.configure";
vgl.event.enable = "vgl.event.enable";
vgl.event.mouseWheel = "vgl.event.mouseWheel";
vgl.event.keyRelease = "vgl.event.keyRelease";
vgl.event.middleButtonPress = "vgl.event.middleButtonPress";
vgl.event.startInteraction = "vgl.event.startInteraction";
vgl.event.enter = "vgl.event.enter";
vgl.event.rightButtonPress = "vgl.event.rightButtonPress";
vgl.event.middleButtonRelease = "vgl.event.middleButtonRelease";
vgl.event.char = "vgl.event.char";
vgl.event.disable = "vgl.event.disable";
vgl.event.endInteraction = "vgl.event.endInteraction";
vgl.event.mouseMove = "vgl.event.mouseMove";
vgl.event.expose = "vgl.event.expose";
vgl.event.timer = "vgl.event.timer";
vgl.event.leftButtonPress = "vgl.event.leftButtonPress";
vgl.event.leave = "vgl.event.leave";
vgl.event.rightButtonRelease = "vgl.event.rightButtonRelease";
vgl.event.leftButtonRelease = "vgl.event.leftButtonRelease";
