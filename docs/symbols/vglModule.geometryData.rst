

===============================================
vgl.geometryData (class)
===============================================


.. contents::
   :local:

.. js:class:: vgl.geometryData ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class geometryData
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vgl.geometryData
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vgl.geometryData.type()
   
       
   
       
   
       Return type
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.name()
   
       
   
       
   
       Return ID of the geometry data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.setName(name)
   
       
   
       
       
       :param  name:
   
         
   
         
       
       
   
       Set name of the geometry data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.addSource(source)
   
       
   
       
       
       :param  source:
   
         
   
         
       
       
   
       Add new source
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.source(index)
   
       
   
       
       
       :param  index:
   
         
   
         
       
       
   
       Return source for a given index. Returns 0 if not found.
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.numberOfSources()
   
       
   
       
   
       Return number of sources
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.sourceData(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Return source data given a key
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.addPrimitive(primitive)
   
       
   
       
       
       :param  primitive:
   
         
   
         
       
       
   
       Add new primitive
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.primitive(index)
   
       
   
       
       
       :param  index:
   
         
   
         
       
       
   
       Return primitive for a given index. Returns null if not found.
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.numberOfPrimitives()
   
       
   
       
   
       Return number of primitives
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.bounds()
   
       
   
       
   
       Return bounds [minX, maxX, minY, maxY, minZ, maxZ]
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.resetBounds()
   
       
   
       
   
       Reset bounds
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.setBounds(minX, maxX, minY, maxY, minZ, maxZ)
   
       
   
       
       
       :param  minX:
   
         
   
         
       
       :param  maxX:
   
         
   
         
       
       :param  minY:
   
         
   
         
       
       :param  maxY:
   
         
   
         
       
       :param  minZ:
   
         
   
         
       
       :param  maxZ:
   
         
   
         
       
       
   
       Set bounds
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.computeBounds()
   
       
   
       
   
       Compute bounds
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.findClosestVertex(point)
   
       
   
       
       
       :param  point:
   
         
   
         
       
       
   
       Returns the vertex closest to a given position
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.getPosition(index)
   
       
   
       
       
       :param  index:
   
         
   
         
       
       
   
       Returns the requested vertex position
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geometryData.getScalar(index)
   
       
   
       
       
       :param  index:
   
         
   
         
       
       
   
       Returns the scalar corresponding to a given vertex index
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
