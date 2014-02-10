//////////////////////////////////////////////////////////////////////////////
/**
 * @module ogs.vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2, bitwise: true*/

/*global vglModule, gl, ogs, vec3, vec4, mat4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Wrap GL enums. Currently to get values of the enums we need to create
 * or access the context.
 *
 * Using enums from here:
 * https://github.com/toji/dart-gl-enums/blob/master/lib/gl_enums.dart
 *
 * @class
 */
//////////////////////////////////////////////////////////////////////////////
vglModule.GL = {
   ColorBufferBit : 0x00004000,
   DepthBufferBit : 0x00000100
};