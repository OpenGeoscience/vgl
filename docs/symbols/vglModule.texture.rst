

===============================================
vgl.texture (class)
===============================================


.. contents::
   :local:

.. js:class:: vgl.texture ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class texture
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vgl.texture
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vgl.texture.setup(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Create texture, update parameters, and bind data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.bind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Create texture and if already created use it
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.undoBind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Turn off the use of this texture
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.image()
   
       
   
       
   
       Get image used by the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vgl.image
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.setImage(image)
   
       
   
       
       
       :param vgl.image image:
   
         
   
         
       
       
   
       Set image for the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.textureUnit()
   
       
   
       
   
       Get texture unit of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.setTextureUnit(unit)
   
       
   
       
       
       :param number unit:
   
         
   
         
       
       
   
       Set texture unit of the texture. Default is 0.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.width()
   
       
   
       
   
       Get width of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.setWidth(width)
   
       
   
       
       
       :param number width:
   
         
   
         
       
       
   
       Set width of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.depth()
   
       
   
       
   
       Get depth of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.setDepth(depth)
   
       
   
       
       
       :param number depth:
   
         
   
         
       
       
   
       Set depth of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.textureHandle()
   
       
   
       
   
       Get the texture handle (id) of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.internalFormat()
   
       
   
       
   
       Get internal format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.setInternalFormat(internalFormat)
   
       
   
       
       
       :param  internalFormat:
   
         
   
         
       
       
   
       Set internal format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.pixelFormat()
   
       
   
       
   
       Get pixel format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.setPixelFormat(pixelFormat)
   
       
   
       
       
       :param  pixelFormat:
   
         
   
         
       
       
   
       Set pixel format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.pixelDataType()
   
       
   
       
   
       Get pixel data type
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.setPixelDataType(pixelDataType)
   
       
   
       
       
       :param  pixelDataType:
   
         
   
         
       
       
   
       Set pixel data type
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.computeInternalFormatUsingImage()
   
       
   
       
   
       Compute internal format of the texture
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.texture.updateDimensions()
   
       
   
       
   
       Update texture dimensions
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
