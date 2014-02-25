

===============================================
vglModule.renderWindow (class)
===============================================


.. contents::
   :local:

.. js:class:: vglModule.renderWindow (canvas)

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class renderWindow
   
   
   
   
   :param  canvas:
     
   
       
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vglModule.renderWindow
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vglModule.renderWindow.windowSize()
   
       
   
       
   
       Get size of the render window
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.setWindowSize(width, height)
   
       
   
       
       
       :param  width:
   
         
   
         
       
       :param  height:
   
         
   
         
       
       
   
       Set size of the render window
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.windowPosition()
   
       
   
       
   
       Get window position (top left coordinates)
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.setWindowPosition(x, y)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       
   
       Set window position (top left coordinates)
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.renderers()
   
       
   
       
   
       Return all renderers contained in the render window
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.activeRenderer()
   
       
   
       
   
       Get active renderer of the the render window
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         vglModule.renderer
   
       
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.addRenderer(ren)
   
       
   
       
       
       :param  ren:
   
         
   
         
       
       
   
       Add renderer to the render window
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.removeRenderer(ren)
   
       
   
       
       
       :param  ren:
   
         
   
         
       
       
   
       Remove renderer from the render window
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.getRenderer(index)
   
       
   
       
       
       :param  index:
   
         
   
         
       
       
   
       Return a renderer at a given index
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.renderer
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.hasRenderer(ren)
   
       
   
       
       
       :param  ren:
   
         
   
         
       
       
   
       Check if the renderer exists
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.resize(width, height)
   
       
   
       
       
       :param  width:
   
         
   
         
       
       :param  height:
   
         
   
         
       
       
   
       Resize window
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.positionAndResize(x, y, width, height)
   
       
   
       
       
       :param  x:
   
         
   
         
       
       :param  y:
   
         
   
         
       
       :param  width:
   
         
   
         
       
       :param  height:
   
         
   
         
       
       
   
       Resize and reposition the window
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.createWindow()
   
       
   
       
   
       Create the window
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.deleteWindow()
   
       
   
       
   
       Delete this window and release any graphics resources
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.render()
   
       
   
       
   
       Render the scene
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.focusDisplayPoint()
   
       
   
       
   
       Get the focusDisplayPoint from the activeRenderer
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vec4
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.renderWindow.displayToWorld(x, y, focusDisplayPoint)
   
       
   
       
       
       :param Number x:
   
         
   
         
       
       :param Number y:
   
         
   
         
       
       :param vec4 focusDisplayPoint:
   
         
   
         
       
       
   
       Transform a point in display space to world space
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vec4
       
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
