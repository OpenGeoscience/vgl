

===============================================
vglModule.sourceData (class)
===============================================


.. contents::
   :local:

.. js:class:: vglModule.sourceData ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of class sourceData
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vglModule.sourceData
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vglModule.sourceData.data()
   
       
   
       
   
       Return raw data for this source
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.addAttribute(key, dataType, sizeOfDataType, offset, stride, noOfComponents, normalized)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       :param  dataType:
   
         
   
         
       
       :param  sizeOfDataType:
   
         
   
         
       
       :param  offset:
   
         
   
         
       
       :param  stride:
   
         
   
         
       
       :param  noOfComponents:
   
         
   
         
       
       :param  normalized:
   
         
   
         
       
       
   
       Add new attribute data to the source
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.sizeOfArray()
   
       
   
       
   
       Return size of the source data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.lengthOfArray()
   
       
   
       
   
       Return length of array
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.sizeInBytes()
   
       
   
       
   
       Return size of the source data in bytes
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.hasKey(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Check if there is attribute exists of a given key type
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.keys()
   
       
   
       
   
       Return keys of all attributes
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.numberOfAttributes()
   
       
   
       
   
       Return number of attributes of source data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.attributeNumberOfComponents(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Return number of components of the attribute data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.normalized(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Return if the attribute data is normalized
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.sizeOfAttributeDataType(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Return size of the attribute data type
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.attributeDataType(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Return attribute data type
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.attributeOffset(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Return attribute offset
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.attributeStride(key)
   
       
   
       
       
       :param  key:
   
         
   
         
       
       
   
       Return attribute stride
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.pushBack(vertexData)
   
       
   
       
       
       :param  vertexData:
   
         
   
         
       
       
   
       Virtual function to insert new vertex data at the end
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.sourceData.insert(data)
   
       
   
       
       
       :param  data:
   
         
   
         
       
       
   
       Insert new data block to the raw data
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
