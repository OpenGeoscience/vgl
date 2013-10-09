//////////////////////////////////////////////////////////////////////////////
/**
 * @module ogs.vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vglModule, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//
// vbgModule.vtkReader class
// This contains code that unpack a json base64 encoded vtkdataset,
// such as those produced by ParaView's webGL exporter (where much
// of the code originated from) and convert it to VGL representation.
//
//////////////////////////////////////////////////////////////////////////////

vglModule.vtkReader = function() {
    'use strict';

    if (!(this instanceof vglModule.vtkReader)) {
        return new vglModule.vtkReader();
    }

    var m_base64Chars =
        ['A','B','C','D','E','F','G','H','I','J','K','L','M',
         'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
         'a','b','c','d','e','f','g','h','i','j','k','l','m',
         'n','o','p','q','r','s','t','u','v','w','x','y','z',
         '0','1','2','3','4','5','6','7','8','9','+','/'],
        m_reverseBase64Chars = [],
        END_OF_INPUT = -1,
        m_base64Str = "",
        m_base64Count = 0,
        m_pos = 0;


    for (var i=0; i < m_base64Chars.length; i++) {
        m_reverseBase64Chars[m_base64Chars[i]] = i;
    }

    ////////////////////////////////////////////////////////////////////////////
    /**
     * ntos
     *
     * @param n
     * @returns unescaped n
     */
    ////////////////////////////////////////////////////////////////////////////
    this.ntos = function (n) {
        n = n.toString(16);
        if (n.length == 1) {
            n = '0' + n;
        }
        n = '%' + n;

        return unescape(n);
    };

    ////////////////////////////////////////////////////////////////////////////
    /**
     * readReverseBase64
     *
     * @returns
     */
    ////////////////////////////////////////////////////////////////////////////
    this.readReverseBase64 = function () {
        if (!m_base64Str) {
            return END_OF_INPUT;
        }

        if (!m_reverseBase64Chars) {
            for (var i = 0; i < m_base64Chars.length; ++i) {
                m_reverseBase64Chars[m_base64Chars[i]] = i;
            }
        }

        while (true) {
            if (m_base64Count >= m_base64Str.length) {
                return END_OF_INPUT;
            }
            var nextCharacter = m_base64Str.charAt(m_base64Count);
            m_base64Count++;

            if (m_reverseBase64Chars[nextCharacter]) {
                return m_reverseBase64Chars[nextCharacter];
            }
            if (nextCharacter == 'A') {
                return 0;
            }
        }

        return END_OF_INPUT;
    };

    ////////////////////////////////////////////////////////////////////////////
    /**
     * decode64
     *
     * @param str
     * @returns result
     */
    ////////////////////////////////////////////////////////////////////////////
    this.decode64 = function(str) {
        m_base64Str = str;
        m_base64Count = 0;

        var result = '';
        var inBuffer = new Array(4);
        var done = false;
        while (!done &&
               (inBuffer[0] = this.readReverseBase64()) != END_OF_INPUT &&
               (inBuffer[1] = this.readReverseBase64()) != END_OF_INPUT) {
            inBuffer[2] = this.readReverseBase64();
            inBuffer[3] = this.readReverseBase64();
            result += this.ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
            if (inBuffer[2] != END_OF_INPUT) {
                result +=  this.ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
                if (inBuffer[3] != END_OF_INPUT) {
                    result +=  this.ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
                } else {
                    done = true;
                }
            } else {
                done = true;
            }
        }

        return result;
    };

    ////////////////////////////////////////////////////////////////////////////
    /**
     * readNumber
     *
     * @param ss
     * @returns v
     */
    ////////////////////////////////////////////////////////////////////////////
    this.readNumber = function(ss) {
        var v = ((ss[m_pos++]) +
                 (ss[m_pos++] << 8) +
                 (ss[m_pos++] << 16) +
                 (ss[m_pos++] << 24));
        return v;
    };

    ////////////////////////////////////////////////////////////////////////////
    /**
     * readF3Array
     *
     * @param numberOfPoints
     * @param ss
     * @returns points
     */
    ////////////////////////////////////////////////////////////////////////////
    this.readF3Array = function(numberOfPoints, ss) {
        var i;
        var test = new Int8Array(numberOfPoints*4*3);

        for(i = 0; i < numberOfPoints*4*3; ++i) {
            test[i] = ss[m_pos++];
        }

        var points = new Float32Array(test.buffer);

        return points;
    };

    ////////////////////////////////////////////////////////////////////////////
    /**
     * readColorArray
     *
     * @param numberOfPoints
     * @param ss
     * @param vglcolors
     * @returns points
     */
    ////////////////////////////////////////////////////////////////////////////
    this.readColorArray = function (numberOfPoints, ss, vglcolors) {
        var i,r,g,b;
        for(i = 0; i < numberOfPoints; ++i) {
            r = ss[m_pos++]/255.0;
            g = ss[m_pos++]/255.0;
            b = ss[m_pos++]/255.0;
            m_pos++;
            vglcolors.pushBack([r,g,b]);
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    /**
     * parseObject
     *
     * @param buffer
     * @returns geom
     */
    ////////////////////////////////////////////////////////////////////////////
    this.parseObject = function(buffer) {
        var ss = [];
        var test;
        var i;
        var size, type;
        var numberOfPoints, numberOfIndex;
        var points, normals, colors, index, tcoord;

        //create the VGL data structure that we populate
        var geom = new vglModule.geometryData();
        geom.setName("World");

        //dehexlify
        var data = this.decode64(buffer);
        for(i = 0; i < data.length; ++i) {
            ss[i] = data.charCodeAt(i) & 0xff;
        }

        m_pos = 0;
        size = this.readNumber(ss);
        type = String.fromCharCode(ss[m_pos++]);

        //-=-=-=-=-=[ LINES ]=-=-=-=-=-
        if (type == 'L') {
            numberOfPoints = this.readNumber(ss);

            //Getting Points
            var vglpoints = new vglModule.sourceDataP3fv();
            points = this.readF3Array(numberOfPoints, ss);
            for(i = 0; i < numberOfPoints; ++i) {
                vglpoints.pushBack([points[i*3+0], points[i*3+1], points[i*3+2]]);
            }
            geom.addSource(vglpoints);

            //Getting Colors
            var vglcolors = new vglModule.sourceDataC3fv();
            this.readColorArray(numberOfPoints, ss, vglcolors);
            geom.addSource(vglcolors);

            //Getting connectivity
            var vgllines = new vglModule.lines();
            geom.addPrimitive(vgllines);
            numberOfIndex = this.readNumber(ss);
            test = new Int8Array(numberOfIndex*2);
            for(i = 0; i < numberOfIndex*2; ++i) {
                test[i] = ss[m_pos++];
            }

            index = new Uint16Array(test.buffer);
            vgllines.setIndices(index);
            vgllines.setPrimitiveType(gl.LINES);
            /*
            //Getting Matrix
            //TODO: renderer is not doing anything with this yet
            test = new Int8Array(16*4);
            for(i=0; i<16*4; i++)
            test[i] = ss[m_pos++];
            matrix = new Float32Array(test.buffer);
            */
        }

        //-=-=-=-=-=[ MESH ]=-=-=-=-=-
        else if (type == 'M') {

            numberOfPoints = this.readNumber(ss);
            //console.log("MESH " + numberOfPoints)

            //Getting Points
            var vglpoints = new vglModule.sourceDataP3N3f();
            points = this.readF3Array(numberOfPoints, ss);

            //Getting Normals
            normals = this.readF3Array(numberOfPoints, ss);

            for(i = 0; i < numberOfPoints; ++i) {
                var v1 = new vglModule.vertexDataP3N3f();
                v1.m_position = new Array(points[i*3+0], points[i*3+1], points[i*3+2]);
                v1.m_normal = new Array(normals[i*3+0], normals[i*3+1], normals[i*3+2]);
                vglpoints.pushBack(v1);
            }
            geom.addSource(vglpoints);

            //Getting Colors
            var vglcolors = new vglModule.sourceDataC3fv();
            this.readColorArray(numberOfPoints, ss, vglcolors);
            geom.addSource(vglcolors);

            //Getting connectivity
            test = [];
            var vgltriangles = new vglModule.triangles();
            geom.addPrimitive(vgltriangles);
            numberOfIndex = this.readNumber(ss);
            test = new Int8Array(numberOfIndex*2);
            for(i = 0; i < numberOfIndex*2; ++i) {
                test[i] = ss[m_pos++];
            }
            index = new Uint16Array(test.buffer);
            vgltriangles.setIndices(index);

            /*
            //Getting Matrix
            //TODO: renderer is not doing anything with this yet
            test = new Int8Array(16*4);
            for(i=0; i<16*4; i++)
            test[i] = ss[m_pos++];
            matrix = new Float32Array(test.buffer);

            //Getting TCoord
            //TODO: renderer is not doing anything with this yet
            tcoord = null;
            */
        }

        // Points
        else if (type == 'P'){
            numberOfPoints = this.readNumber(ss);
            //console.log("POINTS " + numberOfPoints);

            //Getting Points and creating 1:1 connectivity
            var vglpoints = new vglModule.sourceDataP3fv();
            points = this.readF3Array(numberOfPoints, ss);
            var indices = new Uint16Array(numberOfPoints);
            for (i = 0; i < numberOfPoints; ++i) {
                indices[i] = i;
                vglpoints.pushBack([points[i*3+0],points[i*3+1],points[i*3+2]]);
            }
            geom.addSource(vglpoints);

            //Getting Colors
            var vglcolors = new vglModule.sourceDataC3fv();
            this.readColorArray(numberOfPoints, ss, vglcolors);
            geom.addSource(vglcolors);

            //Getting connectivity
            var vglVertexes = new vglModule.points();
            vglVertexes.setIndices(indices);
            geom.addPrimitive(vglVertexes);

            /*
            //Getting Matrix
            //TODO: not used yet
            test = new Int8Array(16*4);
            for(i=0; i<16*4; i++)
            test[i] = ss[m_pos++];
            matrix = new Float32Array(test.buffer);
            */
        }

        // Unknown
        else {
            console.log("Ignoring unrecognized encoded data type " + type)
        }

        return geom;
    };

    return this;
};
