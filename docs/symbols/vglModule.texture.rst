

===============================================
vglModule.texture (class)
===============================================


.. contents::
   :local:

.. js:class:: vglModule.texture ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class texture
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vglModule.texture
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vglModule.texture.setup(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Create texture, update parameters, and bind data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.bind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Create texture and if already created use it
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.undoBind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Turn off the use of this texture
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.image()
   
       
   
       
   
       Get image used by the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.image
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.setImage(image)
   
       
   
       
       
       :param vglModule.image image:
   
         
   
         
       
       
   
       Set image for the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.textureUnit()
   
       
   
       
   
       Get texture unit of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.setTextureUnit(unit)
   
       
   
       
       
       :param number unit:
   
         
   
         
       
       
   
       Set texture unit of the texture. Default is 0.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.width()
   
       
   
       
   
       Get width of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.setWidth(width)
   
       
   
       
       
       :param number width:
   
         
   
         
       
       
   
       Set width of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.depth()
   
       
   
       
   
       Get depth of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.setDepth(depth)
   
       
   
       
       
       :param number depth:
   
         
   
         
       
       
   
       Set depth of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.textureHandle()
   
       
   
       
   
       Get the texture handle (id) of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.internalFormat()
   
       
   
       
   
       Get internal format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.setInternalFormat(internalFormat)
   
       
   
       
       
       :param  internalFormat:
   
         
   
         
       
       
   
       Set internal format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.pixelFormat()
   
       
   
       
   
       Get pixel format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.setPixelFormat(pixelFormat)
   
       
   
       
       
       :param  pixelFormat:
   
         
   
         
       
       
   
       Set pixel format of the texture
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.pixelDataType()
   
       
   
       
   
       Get pixel data type
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.setPixelDataType(pixelDataType)
   
       
   
       
       
       :param  pixelDataType:
   
         
   
         
       
       
   
       Set pixel data type
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.computeInternalFormatUsingImage()
   
       
   
       
   
       Compute internal format of the texture
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.texture.updateDimensions()
   
       
   
       
   
       Update texture dimensions
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
