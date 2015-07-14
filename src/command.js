//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class command
 *
 * @class command
 * @returns {vgl.command}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.command = function () {
  'use strict';

  if (!(this instanceof vgl.command)) {
    return new vgl.command();
  }
  vgl.object.call(this);

  return this;
};

inherit(vgl.command, vgl.object);

//////////////////////////////////////////////////////////////////////////////
/**
 * Event types
 */
//////////////////////////////////////////////////////////////////////////////
vgl.command.keyPressEvent = 'keyPressEvent';
vgl.command.mousePressEvent = 'mousePressEvent';
vgl.command.mouseReleaseEvent = 'mouseReleaseEvent';
vgl.command.contextMenuEvent = 'contextMenuEvent';
vgl.command.configureEvent = 'configureEvent';
vgl.command.enableEvent = 'enableEvent';
vgl.command.mouseWheelBackwardEvent = 'mouseWheelBackwardEvent';
vgl.command.keyReleaseEvent = 'keyReleaseEvent';
vgl.command.middleButtonPressEvent = 'middleButtonPressEvent';
vgl.command.startInteractionEvent = 'startInteractionEvent';
vgl.command.enterEvent = 'enterEvent';
vgl.command.rightButtonPressEvent = 'rightButtonPressEvent';
vgl.command.middleButtonReleaseEvent = 'middleButtonReleaseEvent';
vgl.command.charEvent = 'charEvent';
vgl.command.disableEvent = 'disableEvent';
vgl.command.endInteractionEvent = 'endInteractionEvent';
vgl.command.mouseMoveEvent = 'mouseMoveEvent';
vgl.command.mouseOutEvent = 'mouseOutEvent';
vgl.command.mouseWheelForwardEvent = 'mouseWheelForwardEvent';
vgl.command.exposeEvent = 'exposeEvent';
vgl.command.timerEvent = 'timerEvent';
vgl.command.leftButtonPressEvent = 'leftButtonPressEvent';
vgl.command.leaveEvent = 'leaveEvent';
vgl.command.rightButtonReleaseEvent = 'rightButtonReleaseEvent';
vgl.command.leftButtonReleaseEvent = 'leftButtonReleaseEvent';
