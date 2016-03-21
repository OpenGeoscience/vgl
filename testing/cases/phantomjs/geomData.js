/* global describe, it, expect, vgl */

describe('vgl.primitive', function () {
  describe('Create', function () {
    it('create function', function () {
      var prim = vgl.primitive();
      expect(prim instanceof vgl.primitive).toBe(true);
    });
  });
  describe('Public methods', function () {
    var prim;
    it('indices, createIndices, numberOfIndices, sizeInBytes, and setIndices', function () {
      prim = vgl.primitive();
      expect(prim.indices()).toBe(null);
      prim.createIndices();
      expect(prim.indices() instanceof Uint16Array).toBe(true);
      expect(prim.numberOfIndices()).toBe(0);
      prim.setIndices([1, 3, 5, 7]);
      expect(prim.numberOfIndices()).toBe(4);
      expect(prim.sizeInBytes()).toBe(4 * 2);
      expect(prim.indices()[0]).toBe(1);
      expect(prim.indices()[1]).toBe(3);
      expect(prim.indices()[2]).toBe(5);
      expect(prim.indices()[3]).toBe(7);
    });
    it('primitiveType, setPrimitiveType, indicesPerPrimitive, setIndicesPerPrimitive, indicesValueType, and setIndicesValueType', function () {
      var getfunctions = [prim.primitiveType, prim.indicesPerPrimitive, prim.indicesValueType];
      var setfunctions = [prim.setPrimitiveType, prim.setIndicesPerPrimitive, prim.setIndicesValueType];
      for (var i = 0; i < getfunctions.length; i += 1) {
        expect(getfunctions[i]()).toBe(0);
        setfunctions[i](10);
        expect(getfunctions[i]()).toBe(10);
      }
    });
  });
});

var simpleClasses = [{
  'name': 'triangleStrip',
  'primitiveType': vgl.GL.TRIANGLE_STRIP,
  'valueType': vgl.GL.UNSIGNED_SHORT,
  'count': 3
}, {
  'name': 'triangles',
  'primitiveType': vgl.GL.TRIANGLES,
  'valueType': vgl.GL.UNSIGNED_SHORT,
  'count': 3
}, {
  'name': 'lines',
  'primitiveType': vgl.GL.LINES,
  'valueType': vgl.GL.UNSIGNED_SHORT,
  'count': 2
}, {
  'name': 'lineStrip',
  'primitiveType': vgl.GL.LINE_STRIP,
  'valueType': vgl.GL.UNSIGNED_SHORT,
  'count': 2
}, {
  'name': 'points',
  'primitiveType': vgl.GL.POINTS,
  'valueType': vgl.GL.UNSIGNED_SHORT,
  'count': 1
}];

$.each(simpleClasses, function (idx, cls) {
  describe('vgl.' + cls.name, function () {
    it('create function', function () {
      var prim = vgl[cls.name]();
      expect(prim instanceof vgl[cls.name]).toBe(true);
      expect(prim.primitiveType()).toBe(cls.primitiveType);
      expect(prim.indicesValueType()).toBe(cls.valueType);
      expect(prim.indicesPerPrimitive()).toBe(cls.count);
    });
  });
});

describe('vgl.vertexDataP3f', function () {
  describe('Create', function () {
    it('create function', function () {
      var data = vgl.vertexDataP3f();
      expect(data instanceof vgl.vertexDataP3f).toBe(true);
      expect(data.m_position).toEqual([]);
    });
  });
});

describe('vgl.vertexDataP3N3f', function () {
  describe('Create', function () {
    it('create function', function () {
      var data = vgl.vertexDataP3N3f();
      expect(data instanceof vgl.vertexDataP3N3f).toBe(true);
      expect(data.m_position).toEqual([]);
      expect(data.m_normal).toEqual([]);
    });
  });
});

describe('vgl.vertexDataP3T3f', function () {
  describe('Create', function () {
    it('create function', function () {
      var data = vgl.vertexDataP3T3f();
      expect(data instanceof vgl.vertexDataP3T3f).toBe(true);
      expect(data.m_position).toEqual([]);
      expect(data.m_texCoordinate).toEqual([]);
    });
  });
});

describe('vgl.sourceData', function () {
  describe('Create', function () {
    it('create function', function () {
      var data = vgl.sourceData();
      expect(data instanceof vgl.sourceData).toBe(true);
      expect(data.name().indexOf('Source ')).toBe(0);
      data = vgl.sourceData({name: 'sample'});
      expect(data.name()).toBe('sample');
    });
  });
  describe('Public methods', function () {
    var data;
    it('data, getData, setData, dataToFloat32Array, lengthOfArray, and sizeOfArray', function () {
      data = vgl.sourceData();
      expect(data.data()).toEqual([]);
      expect(data.getData()).toEqual([]);
      expect(data.data() instanceof Float32Array).toBe(false);
      expect(data.getData() instanceof Float32Array).toBe(false);
      expect(data.dataToFloat32Array() instanceof Float32Array).toBe(true);
      expect(data.data() instanceof Float32Array).toBe(true);
      expect(data.getData() instanceof Float32Array).toBe(true);
      expect(data.lengthOfArray()).toBe(0);
      expect(data.sizeOfArray()).not.toBeLessThan(0);
      data.setData([1, 2, 3]);
      expect(data.data()).toEqual([1, 2, 3]);
      expect(data.getData()).toEqual([1, 2, 3]);
      expect(data.data() instanceof Float32Array).toBe(false);
      expect(data.getData() instanceof Float32Array).toBe(false);
      expect(data.lengthOfArray()).toBe(3);
      expect(data.sizeOfArray()).not.toBeLessThan(3);
      expect(data.dataToFloat32Array() instanceof Float32Array).toBe(true);
      expect(data.data() instanceof Float32Array).toBe(true);
      expect(data.getData() instanceof Float32Array).toBe(true);
      expect(data.dataToFloat32Array()[2]).toBe(3);
      expect(data.lengthOfArray()).toBe(3);
      expect(data.sizeOfArray()).not.toBeLessThan(3);
      data.setData('notanarray');
      expect(data.dataToFloat32Array()[2]).toBe(3);
      var newData = new Float32Array([4, 5, 6, 7]);
      data.setData(newData);
      expect(data.data() instanceof Float32Array).toBe(true);
      expect(data.getData() instanceof Float32Array).toBe(true);
      expect(data.lengthOfArray()).toBe(4);
      expect(data.sizeOfArray()).not.toBeLessThan(4);
      expect(data.dataToFloat32Array() instanceof Float32Array).toBe(true);
      expect(data.data()[2]).toBe(6);
      expect(data.getData()[2]).toBe(6);
      expect(data.dataToFloat32Array()[2]).toBe(6);
      expect(data.data()).toBe(newData);
      expect(data.getData()).toBe(newData);
      expect(data.dataToFloat32Array()).toBe(newData);
    });
    it('addAttribute, hasKey, keys, numberOfAtributes, and sizeInBytes', function () {
      expect(data.keys()).toEqual([]);
      expect(data.hasKey('attr1')).toBe(false);
      expect(data.numberOfAttributes()).toBe(0);
      expect(data.sizeInBytes()).toBe(0);
      data.addAttribute('attr1', 1, 2, 3, 4, 5, false);
      expect(data.keys()).toEqual(['attr1']);
      expect(data.hasKey('attr1')).toBe(true);
      expect(data.numberOfAttributes()).toBe(1);
      expect(data.sizeInBytes()).toBe(2 * 5 * data.sizeOfArray());
      data.addAttribute('attr2', 2, 3, 4, 5, 6, false);
      expect(data.hasKey('attr2')).toBe(true);
      expect(data.numberOfAttributes()).toBe(2);
      expect(data.sizeInBytes()).toBe((2 * 5 + 3 * 6) * data.sizeOfArray());
      data.addAttribute('attr1', 6, 7, 8, 9, 10, false);
      expect(data.hasKey('attr1')).toBe(true);
      expect(data.numberOfAttributes()).toBe(2);
      /* addAttribute shouldn't have changed attr1, so the size should be the
       * same. */
      expect(data.sizeInBytes()).toBe((2 * 5 + 3 * 6) * data.sizeOfArray());
    });
    it('attributeNumberOfComponents, normalized, sizeOfAttributeDataType, attributeDataType, attributeOffset, attributeStride', function () {
      expect(data.attributeNumberOfComponents('attr3')).toBe(0);
      expect(data.normalized('attr3')).toBe(false);
      expect(data.sizeOfAttributeDataType('attr3')).toBe(0);
      expect(data.attributeDataType('attr3')).toBe(undefined);
      expect(data.attributeOffset('attr3')).toBe(0);
      expect(data.attributeStride('attr3')).toBe(0);
      data.addAttribute('attr3', 11, 12, 13, 14, 15, true);
      expect(data.attributeNumberOfComponents('attr3')).toBe(15);
      expect(data.normalized('attr3')).toBe(true);
      expect(data.sizeOfAttributeDataType('attr3')).toBe(12);
      expect(data.attributeDataType('attr3')).toBe(11);
      expect(data.attributeOffset('attr3')).toBe(13);
      expect(data.attributeStride('attr3')).toBe(14);
    });
    it('pushBack', function () {
      expect(data.pushBack()).toBe(undefined);
    });
    it('insert', function () {
      data = vgl.sourceData();
      var newData = new Float32Array([4, 5, 6, 7]);
      data.insert(newData);
      expect(data.data()).toBe(newData);
      data.insert(8);
      expect(data.data().length).toBe(5);
      expect(data.data()[3]).toBe(7);
      expect(data.data()[4]).toBe(8);
      data = vgl.sourceData();
      data.insert([1, 3, 5, 7]);
      expect(data.data()).toEqual([1, 3, 5, 7]);
      data.insert([9, 11]);
      expect(data.data()).toEqual([1, 3, 5, 7, 9, 11]);
      data.dataToFloat32Array();
      data.insert([13, 15]);
      expect(data.data().length).toBe(8);
    });
    it('insertAt', function () {
      data = vgl.sourceData();
      data.setData([1, 3, 5, 7, 9, 11, 13]);
      data.insertAt(3, 4);
      expect(data.data().length).toBe(7);
      expect(data.data()[3]).toBe(4);
      data.insertAt(1, [2, 6]);
      expect(data.data()[1]).toBe(3);
      expect(data.data()[2]).toBe(2);
      expect(data.data()[3]).toBe(6);
      expect(data.data()[4]).toBe(9);
    });
    it('name and setName', function () {
      data.setName('test');
      expect(data.name()).toBe('test');
    });
  });
});

describe('vgl.sourceData*', function () {
  it('vgl.sourceDataAnyfv', function () {
    var data = vgl.sourceDataAnyfv(2, 'attr', {name: 'testname'});
    expect(data instanceof vgl.sourceDataAnyfv).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType('attr')).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType('attr')).toBe(4);
    expect(data.attributeOffset('attr')).toBe(0);
    expect(data.attributeStride('attr')).toBe(2 * 4);
    expect(data.attributeNumberOfComponents('attr')).toBe(2);
    expect(data.normalized('attr')).toBe(false);
    expect(data.data().length).toBe(0);
    data.pushBack([1, 3, 5, 7]);
    expect(data.data()).toEqual([1, 3, 5, 7]);
  });

  it('vgl.sourceDataP3T3f', function () {
    var data = vgl.sourceDataP3T3f({name: 'testname'});
    expect(data instanceof vgl.sourceDataP3T3f).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType(vgl.vertexAttributeKeys.Position)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.Position)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.Position)).toBe(0);
    expect(data.attributeStride(vgl.vertexAttributeKeys.Position)).toBe(6 * 4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.Position)).toBe(3);
    expect(data.normalized(vgl.vertexAttributeKeys.Position)).toBe(false);
    expect(data.attributeDataType(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(12);
    expect(data.attributeStride(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(6 * 4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(3);
    expect(data.normalized(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(false);
    expect(data.data().length).toBe(0);
    data.pushBack({m_position: [1, 3, 5], m_texCoordinate: [2, 4, 6]});
    expect(data.data()).toEqual([1, 3, 5, 2, 4, 6]);
  });

  it('vgl.sourceDataP3N3f', function () {
    var data = vgl.sourceDataP3N3f({name: 'testname'});
    expect(data instanceof vgl.sourceDataP3N3f).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType(vgl.vertexAttributeKeys.Position)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.Position)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.Position)).toBe(0);
    expect(data.attributeStride(vgl.vertexAttributeKeys.Position)).toBe(6 * 4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.Position)).toBe(3);
    expect(data.normalized(vgl.vertexAttributeKeys.Position)).toBe(false);
    expect(data.attributeDataType(vgl.vertexAttributeKeys.Normal)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.Normal)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.Normal)).toBe(12);
    expect(data.attributeStride(vgl.vertexAttributeKeys.Normal)).toBe(6 * 4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.Normal)).toBe(3);
    expect(data.normalized(vgl.vertexAttributeKeys.Normal)).toBe(false);
    expect(data.data().length).toBe(0);
    data.pushBack({m_position: [1, 3, 5], m_normal: [2, 4, 6]});
    expect(data.data()).toEqual([1, 3, 5, 2, 4, 6]);
    expect(data.data().length).toBe(6);
  });

  it('vgl.sourceDataP3fv', function () {
    var data = vgl.sourceDataP3fv({name: 'testname'});
    expect(data instanceof vgl.sourceDataP3fv).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType(vgl.vertexAttributeKeys.Position)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.Position)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.Position)).toBe(0);
    expect(data.attributeStride(vgl.vertexAttributeKeys.Position)).toBe(3 * 4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.Position)).toBe(3);
    expect(data.normalized(vgl.vertexAttributeKeys.Position)).toBe(false);
    expect(data.data().length).toBe(0);
    data.pushBack([1, 3, 5, 7]);
    expect(data.data()).toEqual([1, 3, 5, 7]);
    expect(data.data().length).toBe(4);
  });

  it('vgl.sourceDataT2fv', function () {
    var data = vgl.sourceDataT2fv({name: 'testname'});
    expect(data instanceof vgl.sourceDataT2fv).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(0);
    expect(data.attributeStride(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(2 * 4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(2);
    expect(data.normalized(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(false);
    expect(data.data().length).toBe(0);
    data.pushBack([1, 3, 5, 7]);
    expect(data.data()).toEqual([1, 3, 5, 7]);
    expect(data.data().length).toBe(4);
  });

  it('vgl.sourceDataC3fv', function () {
    var data = vgl.sourceDataC3fv({name: 'testname'});
    expect(data instanceof vgl.sourceDataC3fv).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType(vgl.vertexAttributeKeys.Color)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.Color)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.Color)).toBe(0);
    expect(data.attributeStride(vgl.vertexAttributeKeys.Color)).toBe(3 * 4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.Color)).toBe(3);
    expect(data.normalized(vgl.vertexAttributeKeys.Color)).toBe(false);
    expect(data.data().length).toBe(0);
    data.pushBack([1, 3, 5, 7]);
    expect(data.data()).toEqual([1, 3, 5, 7]);
    expect(data.data().length).toBe(4);
  });

  it('vgl.sourceDataSf', function () {
    var data = vgl.sourceDataSf({name: 'testname'});
    expect(data instanceof vgl.sourceDataSf).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType(vgl.vertexAttributeKeys.Scalar)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.Scalar)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.Scalar)).toBe(0);
    expect(data.attributeStride(vgl.vertexAttributeKeys.Scalar)).toBe(4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.Scalar)).toBe(1);
    expect(data.normalized(vgl.vertexAttributeKeys.Scalar)).toBe(false);
    expect(data.data().length).toBe(0);
    expect(data.scalarRange()).toEqual([null, null]);
    data.pushBack(3);
    data.pushBack(1);
    data.pushBack(7);
    data.pushBack(5);
    expect(data.data()).toEqual([3, 1, 7, 5]);
    expect(data.data().length).toBe(4);
    expect(data.scalarRange()).toEqual([1, 7]);
    data.insertAt(1, 9);
    expect(data.data()).toEqual([3, 9, 7, 5]);
    expect(data.scalarRange()).toEqual([1, 9]);
    data.insertAt(1, -1);
    expect(data.data()).toEqual([3, -1, 7, 5]);
    expect(data.scalarRange()).toEqual([-1, 9]);
    data.setScalarRange(4, 5);
    expect(data.scalarRange()).toEqual([4, 5]);
    data.insertAt(1, -1);
    expect(data.scalarRange()).toEqual([4, 5]);
  });

  it('vgl.sourceDataDf', function () {
    var data = vgl.sourceDataDf({name: 'testname'});
    expect(data instanceof vgl.sourceDataDf).toBe(true);
    expect(data.name()).toBe('testname');
    expect(data.attributeDataType(vgl.vertexAttributeKeys.Scalar)).toBe(vgl.GL.FLOAT);
    expect(data.sizeOfAttributeDataType(vgl.vertexAttributeKeys.Scalar)).toBe(4);
    expect(data.attributeOffset(vgl.vertexAttributeKeys.Scalar)).toBe(0);
    expect(data.attributeStride(vgl.vertexAttributeKeys.Scalar)).toBe(4);
    expect(data.attributeNumberOfComponents(vgl.vertexAttributeKeys.Scalar)).toBe(1);
    expect(data.normalized(vgl.vertexAttributeKeys.Scalar)).toBe(false);
    expect(data.data().length).toBe(0);
    expect(data.scalarRange).toBe(undefined);
    data.pushBack(3);
    data.pushBack(1);
    data.pushBack(7);
    data.pushBack(5);
    expect(data.data()).toEqual([3, 1, 7, 5]);
    expect(data.data().length).toBe(4);
    data.insertAt(1, 9);
    expect(data.data()).toEqual([3, 9, 7, 5]);
  });
});

describe('vgl.geometryData', function () {
  describe('Create', function () {
    it('create function', function () {
      var data = vgl.geometryData();
      expect(data instanceof vgl.geometryData).toBe(true);
    });
  });
  describe('Public methods', function () {
    var data;
    it('type', function () {
      data = vgl.geometryData();
      expect(data.type()).toBe(vgl.data.geometry);
    });
    it('name and setName', function () {
      expect(data.name()).toBe('');
      data.setName('test');
      expect(data.name()).toBe('test');
    });
    it('addSource, source, sourceByName, numberOfSources, and sourceData', function () {
      var src1 = vgl.sourceDataP3T3f({name: 'name1'}),  // pos and texture
          src2 = vgl.sourceDataT2fv({name: 'name2'}),   // texture
          src3 = vgl.sourceDataC3fv({name: 'name3'}),   // color
          src4 = vgl.sourceDataSf({name: 'name4'});     // scalar
      expect(data.numberOfSources()).toBe(0);
      expect(data.sourceData(vgl.vertexAttributeKeys.Position)).toBe(null);
      expect(data.sourceByName('src1')).toBe(0);
      expect(data.source(0)).toBe(0);
      expect(data.boundsDirty()).toBe(false);
      expect(data.addSource(src1)).toBe(true);
      expect(data.boundsDirty()).toBe(true);
      expect(data.numberOfSources()).toBe(1);
      expect(data.sourceData(vgl.vertexAttributeKeys.Position)).toBe(src1);
      expect(data.sourceByName('src1')).toBe(0);
      expect(data.sourceByName('name1')).toBe(src1);
      expect(data.source(0)).toBe(src1);
      expect(data.addSource(src1, 'src1')).toBe(false);
      expect(data.numberOfSources()).toBe(1);
      expect(data.sourceData(vgl.vertexAttributeKeys.Position)).toBe(src1);
      expect(data.sourceByName('src1')).toBe(src1);
      expect(data.sourceByName('name1')).toBe(0);
      expect(data.source(0)).toBe(src1);
      expect(data.addSource(src2)).toBe(true);
      expect(data.addSource(src3)).toBe(true);
      expect(data.addSource(src4)).toBe(true);
      expect(data.sourceData(vgl.vertexAttributeKeys.TextureCoordinate)).toBe(src1);
      expect(data.numberOfSources()).toBe(4);
    });
    it('addPrimitive, primitive, and numberOfPrimitives', function () {
      var prim = vgl.triangles();
      expect(data.numberOfPrimitives()).toBe(0);
      expect(data.primitive(0)).toBe(null);
      expect(data.addPrimitive(prim)).toBe(true);
      expect(data.numberOfPrimitives()).toBe(1);
      expect(data.primitive(0)).toBe(prim);
    });
    it('bounds, boundsDirty, resetBounds, setBounds, computeBounds, and findClosestVertex', function () {
      var src1;
      expect(data.bounds()).toEqual([0, 0, 0, 0, 0, 0]);
      expect(data.boundsDirty()).toBe(false);
      expect(data.boundsDirty(true)).toBe(true);
      expect(data.findClosestVertex({x: 0, y: 0})).toBe(null);
      expect(data.setBounds(1, 2, 3, 4, 5, 6)).toBe(true);
      expect(data.boundsDirty()).toBe(false);
      expect(data.bounds()).toEqual([1, 2, 3, 4, 5, 6]);
      data.resetBounds();
      expect(data.bounds()).toEqual([0, 0, 0, 0, 0, 0]);
      src1 = data.sourceData(vgl.vertexAttributeKeys.Position);
      src1.pushBack({m_position: [1, 3, 5], m_texCoordinate: [2, 4, 6]});
      expect(data.findClosestVertex({x: 7, y: -4})).toBe(0);
      expect(data.findClosestVertex({x: 7, y: -4, z: -8})).toBe(0);
      src1.pushBack({m_position: [-2, -4, -6], m_texCoordinate: [2, 4, 6]});
      expect(data.findClosestVertex({x: 7, y: -4})).toBe(0);
      expect(data.findClosestVertex({x: 7, y: -4, z: -8})).toBe(1);
      src1.pushBack({m_position: [7, -8, 0], m_texCoordinate: [2, 4, 6]});
      expect(data.findClosestVertex({x: 7, y: -4})).toBe(2);
      expect(data.findClosestVertex({x: 7, y: -4, z: -8})).toBe(2);
      expect(data.boundsDirty(true)).toBe(true);
      data.computeBounds();
      expect(data.bounds()).toEqual([-2, 7, -8, 3, -6, 5]);
    });
    it('getPosition', function () {
      expect(data.getPosition(0)).toEqual([1, 3, 5]);
      expect(data.getPosition(1)).toEqual([-2, -4, -6]);
      expect(data.getPosition(2)).toEqual([7, -8, 0]);
    });
    it('getPosition and findClosestVertex in 2D', function () {
      var src1;
      data = vgl.geometryData();
      src1 = vgl.sourceData();
      src1.addAttribute(vgl.vertexAttributeKeys.Position, vgl.GL.FLOAT, 4, 0,
                        2 * 4, 2, false);
      expect(data.addSource(src1)).toBe(true);
      src1.setData([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(data.getPosition(0)).toEqual([1, 2, 3]);
      expect(data.getPosition(1)).toEqual([3, 4, 5]);
      expect(data.findClosestVertex({x: 3, y: 4, z: 5})).toBe(1);
    });
    it('getScalar', function () {
      var src1;
      expect(data.getScalar(0)).toBe(null);
      src1 = vgl.sourceDataSf({name: 'src2'});
      data.addSource(src1);
      expect(data.getScalar(0)).toBe(undefined);
      src1.pushBack(3);
      src1.pushBack(1);
      src1.pushBack(7);
      src1.pushBack(5);
      expect(data.getScalar(0)).toBe(3);
      expect(data.getScalar(3)).toBe(5);
    });
  });
});
