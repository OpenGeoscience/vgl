

===============================================
vglModule.material (class)
===============================================


.. contents::
   :local:

.. js:class:: vglModule.material ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class material
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vglModule.material
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vglModule.material.binNumber()
   
       
   
       
   
       Return bin number for the material
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.setBinNumber(binNo)
   
       
   
       
       
       :param  binNo:
   
         
   
         
       
       
   
       Set bin number for the material
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.exists(attr)
   
       
   
       
       
       :param  attr:
   
         
   
         
       
       
   
       Check if incoming attribute already exists in the material
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.setAttribute(attr)
   
       
   
       
       
       :param  attr:
   
         
   
         
       
       
   
       Set a new attribute for the material
       
       This method replace any existing attribute except for textures as
       materials can have multiple textures.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.addAttribute(attr)
   
       
   
       
       
       :param  attr:
   
         
   
         
       
       
   
       Add a new attribute to the material.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.shaderProgram()
   
       
   
       
   
       Return shader program used by the material
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.shaderProgram
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.render(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Activate the material
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.remove(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Deactivate the material
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.bind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Bind and activate material states
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.undoBind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Undo-bind and de-activate material states
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.bindVertexData(renderState, key)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       :param  key:
   
         
   
         
       
       
   
       Bind vertex data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.material.undoBindVertexData(renderState, key)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       :param  key:
   
         
   
         
       
       
   
       Undo bind vertex data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
