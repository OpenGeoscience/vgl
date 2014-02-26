

===============================================
vgl.geojsonReader (class)
===============================================


.. contents::
   :local:

.. js:class:: vgl.geojsonReader ()

      
   
   .. ============================== constructor details ====================
   
   
   
   
   
   
   
   
   Create a new instance of geojson reader
   
   This contains code that reads a geoJSON file and produces rendering
   primitives from it.
   
   
   
   
   
   
   
   
   
   
   
   
   
   :returns:
     
           
   
     :rtype: vgl.geojsonReader
     
   
   
   
   
   
   
   
   
   
   
   
   
   
   .. ============================== properties summary =====================
   
   
   
   .. ============================== events summary ========================
   
   
   
   
   
   .. ============================== field details ==========================
   
   
   
   .. ============================== method details =========================
   
   
   
   
   
   
   .. js:function:: vgl.geojsonReader.readScalars(coordinates, geom, size_estimate, idx)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       :param  geom:
   
         
   
         
       
       :param  size_estimate:
   
         
   
         
       
       :param  idx:
   
         
   
         
       
       
   
       Read scalars
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readPoint(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read point data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vgl.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readMultiPoint(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read multipoint data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vgl.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readLineString(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read line string data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vgl.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readMultiLineString(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read multi line string
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vgl.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readPolygon(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read polygon data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vgl.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readMultiPolygon(coordinates)
   
       
   
       
       
       :param  coordinates:
   
         
   
         
       
       
   
       Read multi polygon data
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: vgl.geometryData
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readGJObjectInt(object)
   
       
   
       
       
       :param  object:
   
         
   
         
       
       
   
       
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readGJObject(object)
   
       
   
       
       
       :param  object:
   
         
   
         
       
       
   
       
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: *
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.linearizeGeoms(geoms, geom)
   
       
   
       
       
       :param  geoms:
   
         
   
         
       
       :param  geom:
   
         
   
         
       
       
   
       Linearize geometries
   
       
   
   
     
   
     
   
     
   
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.readGeomObject(object)
   
       
   
       
       
       :param  object:
   
         
   
         
       
       
   
       Read geometries from geojson object
   
       
   
   
     
   
     
   
     
   
     
       
       :returns:
         
   
       :rtype: Array
       
     
   
     
   
     
   
   
   
   
   .. js:function:: vgl.geojsonReader.getPrimitives(buffer)
   
       
   
       
       
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
