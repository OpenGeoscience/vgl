/*========================================================================
  VGL --- VTK WebGL Rendering Toolkit

  Copyright 2013 Kitware, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ========================================================================*/



/**
 * Not used right now
 */
function modelViewMatrixStack()
{
  var mvMatrixStack = [];

  this.pushMatrix = function(mat) {
    var copy = mat4.create();
    mat4.set(mat, copy);
    mvMatrixStack.push(copy);
  };

  this.popMatrix = function() {
    if (mvMatrixStack.length === 0)
    {
      throw "Invalid popMatrix!";
    }
    mat = mvMatrixStack.pop();

    return mat;
  };
}