

===============================================
vglModule.geojsonReader (class)
===============================================


.. contents::
   :local:

.. js:class:: vglModule.geojsonReader ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of geojson reader
   
   This contains code that reads a geoJSON file and produces rendering
   primitives from it.
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vglModule.geojsonReader
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readScalars(coordinates, geom, size_estimate, idx)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       :param  geom:
   
         
   
         
       
       :param  size_estimate:
   
         
   
         
       
       :param  idx:
   
         
   
         
       
       
   
       Read scalars
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readPoint(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read point data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readMultiPoint(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read multipoint data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readLineString(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read line string data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readMultiLineString(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read multi line string
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readPolygon(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read polygon data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readMultiPolygon(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read multi polygon data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vglModule.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readGJObjectInt(object)
   
       
   
       
       
       :param  object:
   
         
   
         
       
       
   
       
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readGJObject(object)
   
       
   
       
       
       :param  object:
   
         
   
         
       
       
   
       
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.linearizeGeoms(geoms, geom)
   
       
   
       
       
       :param  geoms:
   
         
   
         
       
       :param  geom:
   
         
   
         
       
       
   
       Linearize geometries
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.readGeomObject(object)
   
       
   
       
       
       :param  object:
   
         
   
         
       
       
   
       Read geometries from geojson object
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vglModule.geojsonReader.getPrimitives(buffer)
   
       
   
       
       
       :param  buffer:
   
         
   
         
       
       
   
       Given a buffer get rendering primitives
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   .. ============================== event details =========================
   
   

.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 using jsdoc-toolkit-rst-template_

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/
.. _jsdoc-toolkit-rst-template: http://code.google.com/p/jsdoc-toolkit-rst-template/
.. _sphinx: http://sphinx.pocoo.org/




.. vim: set ft=rst :
