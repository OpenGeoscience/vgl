

===============================================
vglModule.camera (class)
===============================================


.. contents::
   :local:

.. js:class:: vglModule.camera ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class camera
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vglModule.camera
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vglModule.camera.viewAngle()
   
       
   
       
   
       Get view angle of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setViewAngleDegrees(a)
   
       
   
       
       
       :param  a:
   
         
   
         
       
       
   
       Set view angle of the camera in degrees, which is converted to radians.
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setViewAngle(a)
   
       
   
       
       
       :param  a:
   
         
   
         
       
       
   
       Set view angle of the camera in degrees, which is converted to radians.
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.position()
   
       
   
       
   
       Get position of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setPosition(x, y, z)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       :param  z:
   
         
   
         
       
       
   
       Set position of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.focalPoint()
   
       
   
       
   
       Get focal point of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setFocalPoint(x, y, z)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       :param  z:
   
         
   
         
       
       
   
       Set focal point of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.viewUpDirection()
   
       
   
       
   
       Get view-up direction of camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setViewUpDirection(x, y, z)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       :param  z:
   
         
   
         
       
       
   
       Set view-up direction of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.centerOfRotation()
   
       
   
       
   
       Get center of rotation for camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setCenterOfRotation(centerOfRotation)
   
       
   
       
       
       :param  centerOfRotation:
   
         
   
         
       
       
   
       Set center of rotation for camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.getClippingRange()
   
       
   
       
   
       Get clipping range of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setClippingRange(near, far)
   
       
   
       
       
       :param  near:
   
         
   
         
       
       :param  far:
   
         
   
         
       
       
   
       Set clipping range of the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.viewAspect()
   
       
   
       
   
       Get view aspect
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setViewAspect(aspect)
   
       
   
       
       
       :param  aspect:
   
         
   
         
       
       
   
       Set view aspect
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.isEnabledParallelProjection()
   
       
   
       
   
       Return if parallel projection is enabled
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.enableParallelProjection(flag)
   
       
   
       
       
       :param  flag:
   
         
   
         
       
       
   
       Enable / disable parallel projection
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setParallelProjection(left, right, top, bottom)
   
       
   
       
       
       :param  left:
   
         
   
         
       
       :param  right:
   
         
   
         
       
       :param  top:
   
         
   
         
       
       :param  bottom:
   
         
   
         
       
       
   
       Set parallel projection parameters
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.directionOfProjection()
   
       
   
       
   
       Return direction of projection
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.viewPlaneNormal()
   
       
   
       
   
       Return view plane normal direction
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.viewMatrix()
   
       
   
       
   
       Return view-matrix for the camera This method does not compute the
       view-matrix for the camera. It is assumed that a call to computeViewMatrix
       has been made earlier.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: mat4
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.projectionMatrix()
   
       
   
       
   
       Return camera projection matrix This method does not compute the
       projection-matrix for the camera. It is assumed that a call to
       computeProjectionMatrix has been made earlier.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: mat4
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.clearMask()
   
       
   
       
   
       Return clear mask used by this camera
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setClearMask(mask)
   
       
   
       
       
       :param  mask:
   
         
   
         
       
       
   
       Set clear mask for camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.clearColor()
   
       
   
       
   
       Get clear color (background color) of the camera
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setClearColor(color, g, b, a)
   
       
   
       
       
       :param  color:
   
         RGBA
   
         
       
       :param  g:
   
         
   
         
       
       :param  b:
   
         
   
         
       
       :param  a:
   
         
   
         
       
       
   
       Set clear color (background color) for the camera
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.clearDepth()
   
       
   
       
   
       
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: {1.0: null}
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.setClearDepth(depth)
   
       
   
       
       
       :param  depth:
   
         
   
         
       
       
   
       
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.computeDirectionOfProjection()
   
       
   
       
   
       Compute direction of projection
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.computeViewPlaneNormal()
   
       
   
       
   
       Compute view plane normal
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.zoom(d)
   
       
   
       
       
       :param  d:
   
         
   
         
       
       
   
       Move camera closer or further away from the scene
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.pan(dx, dy, dz)
   
       
   
       
       
       :param  dx:
   
         
   
         
       
       :param  dy:
   
         
   
         
       
       :param  dz:
   
         
   
         
       
       
   
       Move camera sideways
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.computeOrthogonalAxes()
   
       
   
       
   
       Compute camera coordinate axes
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.rotate(dx, dy)
   
       
   
       
       
       :param  dx:
   
         Rotation around vertical axis in degrees
   
         
       
       :param  dy:
   
         Rotation around horizontal axis in degrees
   
         
       
       
   
       Rotate camera around center of rotation
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.computeViewMatrix()
   
       
   
       
   
       Compute camera view matrix
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.camera.computeProjectionMatrix()
   
       
   
       
   
       Compute camera projection matrix
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
