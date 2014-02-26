

===============================================
vgl.camera (class)
===============================================


.. contents::
   :local:

.. js:class:: vgl.camera ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class camera
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vgl.camera
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vgl.camera.viewAngle()
   
       
   
       
   
       Get view angle of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setViewAngleDegrees(a)
   
       
   
       
       
       :param  a:
   
         
   
         
       
       
   
       Set view angle of the camera in degrees, which is converted to radians.
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setViewAngle(a)
   
       
   
       
       
       :param  a:
   
         
   
         
       
       
   
       Set view angle of the camera in degrees, which is converted to radians.
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.position()
   
       
   
       
   
       Get position of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setPosition(x, y, z)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       :param  z:
   
         
   
         
       
       
   
       Set position of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.focalPoint()
   
       
   
       
   
       Get focal point of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setFocalPoint(x, y, z)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       :param  z:
   
         
   
         
       
       
   
       Set focal point of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.viewUpDirection()
   
       
   
       
   
       Get view-up direction of camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setViewUpDirection(x, y, z)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       :param  z:
   
         
   
         
       
       
   
       Set view-up direction of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.centerOfRotation()
   
       
   
       
   
       Get center of rotation for camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setCenterOfRotation(centerOfRotation)
   
       
   
       
       
       :param  centerOfRotation:
   
         
   
         
       
       
   
       Set center of rotation for camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.getClippingRange()
   
       
   
       
   
       Get clipping range of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setClippingRange(near, far)
   
       
   
       
       
       :param  near:
   
         
   
         
       
       :param  far:
   
         
   
         
       
       
   
       Set clipping range of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.viewAspect()
   
       
   
       
   
       Get view aspect
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setViewAspect(aspect)
   
       
   
       
       
       :param  aspect:
   
         
   
         
       
       
   
       Set view aspect
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.isEnabledParallelProjection()
   
       
   
       
   
       Return if parallel projection is enabled
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.enableParallelProjection(flag)
   
       
   
       
       
       :param  flag:
   
         
   
         
       
       
   
       Enable / disable parallel projection
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setParallelProjection(left, right, top, bottom)
   
       
   
       
       
       :param  left:
   
         
   
         
       
       :param  right:
   
         
   
         
       
       :param  top:
   
         
   
         
       
       :param  bottom:
   
         
   
         
       
       
   
       Set parallel projection parameters
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.directionOfProjection()
   
       
   
       
   
       Return direction of projection
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.viewPlaneNormal()
   
       
   
       
   
       Return view plane normal direction
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.viewMatrix()
   
       
   
       
   
       Return view-matrix for the camera This method does not compute the
       view-matrix for the camera. It is assumed that a call to computeViewMatrix
       has been made earlier.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: mat4
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.projectionMatrix()
   
       
   
       
   
       Return camera projection matrix This method does not compute the
       projection-matrix for the camera. It is assumed that a call to
       computeProjectionMatrix has been made earlier.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: mat4
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.clearMask()
   
       
   
       
   
       Return clear mask used by this camera
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setClearMask(mask)
   
       
   
       
       
       :param  mask:
   
         
   
         
       
       
   
       Set clear mask for camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.clearColor()
   
       
   
       
   
       Get clear color (background color) of the camera
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setClearColor(color, g, b, a)
   
       
   
       
       
       :param  color:
   
         RGBA
   
         
       
       :param  g:
   
         
   
         
       
       :param  b:
   
         
   
         
       
       :param  a:
   
         
   
         
       
       
   
       Set clear color (background color) for the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.clearDepth()
   
       
   
       
   
       
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: {1.0: null}
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.setClearDepth(depth)
   
       
   
       
       
       :param  depth:
   
         
   
         
       
       
   
       
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.computeDirectionOfProjection()
   
       
   
       
   
       Compute direction of projection
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.computeViewPlaneNormal()
   
       
   
       
   
       Compute view plane normal
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.zoom(d)
   
       
   
       
       
       :param  d:
   
         
   
         
       
       
   
       Move camera closer or further away from the scene
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.pan(dx, dy, dz)
   
       
   
       
       
       :param  dx:
   
         
   
         
       
       :param  dy:
   
         
   
         
       
       :param  dz:
   
         
   
         
       
       
   
       Move camera sideways
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.computeOrthogonalAxes()
   
       
   
       
   
       Compute camera coordinate axes
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.rotate(dx, dy)
   
       
   
       
       
       :param  dx:
   
         Rotation around vertical axis in degrees
   
         
       
       :param  dy:
   
         Rotation around horizontal axis in degrees
   
         
       
       
   
       Rotate camera around center of rotation
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.computeViewMatrix()
   
       
   
       
   
       Compute camera view matrix
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.camera.computeProjectionMatrix()
   
       
   
       
   
       Compute camera projection matrix
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
