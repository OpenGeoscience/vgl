

===============================================
vglModule.shaderProgram (class)
===============================================


.. contents::
   :local:

.. js:class:: vglModule.shaderProgram ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instace of class shaderProgram
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vglModule.shaderProgram
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vglModule.shaderProgram.queryUniformLocation(name)
   
       
   
       
       
       :param  name:
   
         
   
         
       
       
   
       Query uniform location in the program
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.queryAttributeLocation(name)
   
       
   
       
       
       :param  name:
   
         
   
         
       
       
   
       Query attribute location in the program
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.addShader(shader)
   
       
   
       
       
       :param  shader:
   
         
   
         
       
       
   
       Add a new shader to the program
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.addUniform(uniform)
   
       
   
       
       
       :param  uniform:
   
         
   
         
       
       
   
       Add a new uniform to the program
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.addVertexAttribute(attr, key)
   
       
   
       
       
       :param  attr:
   
         
   
         
       
       :param  key:
   
         
   
         
       
       
   
       Add a new vertex attribute to the program
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.uniformLocation(name)
   
       
   
       
       
       :param  name:
   
         
   
         
       
       
   
       Get uniform location
       
       This method does not perform any query into the program but relies on
       the fact that it depends on a call to queryUniformLocation earlier.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.attributeLocation(name)
   
       
   
       
       
       :param  name:
   
         
   
         
       
       
   
       Get attribute location
       
       This method does not perform any query into the program but relies on the
       fact that it depends on a call to queryUniformLocation earlier.
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: number
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.uniform(name)
   
       
   
       
       
       :param  name:
   
         
   
         
       
       
   
       Get uniform object using name as the key
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.updateUniforms()
   
       
   
       
   
       Update all uniforms
       
       This method should be used directly unless required
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.link()
   
       
   
       
   
       Link shader program
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.use()
   
       
   
       
   
       Use the shader program
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.cleanUp()
   
       
   
       
   
       Peform any clean up required when the program gets deleted
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.deleteProgram()
   
       
   
       
   
       Delete the shader program
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.deleteVertexAndFragment()
   
       
   
       
   
       Delete vertex and fragment shaders
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.bind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Bind the program with its shaders
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: boolean
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.undoBind(renderState)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       
   
       Undo binding of the shader program
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.bindVertexData(renderState, key)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       :param  key:
   
         
   
         
       
       
   
       Bind vertex data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.undoBindVertexData(renderState, key)
   
       
   
       
       
       :param  renderState:
   
         
   
         
       
       :param  key:
   
         
   
         
       
       
   
       Undo bind vetex data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.bindUniforms()
   
       
   
       
   
       Bind uniforms
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.shaderProgram.bindAttributes()
   
       
   
       
   
       Bind vertex attributes
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
