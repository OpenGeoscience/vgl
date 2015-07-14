vgl.DataBuffers = function (initialSize) {
  'use strict';
  if (!(this instanceof vgl.DataBuffers)) {
    return new vgl.DataBuffers(initialSize);
  }

  var data = {};

  var size;
  if (!initialSize && initialSize !== 0) {
    size = 256;
  } else {
    size = initialSize;
  }

  var current = 0;

  var copyArray = function (dst, src, start, count) {
    if (!dst) {
      console.log ('ack');
    }
    if (!start) {
      start = 0;
    }
    if (!count) {
      count = src.length;
    }
    for (var i = 0; i < count; i += 1) {
      dst[start + i] = src[i];
    }
  };

  var resize = function (min_expand) {
    var new_size = size;
    /* If the array would increase substantially, don't just double its
     * size.  If the array has been increasing gradually, double it as the
     * expectation is that it will increase again. */
    if (new_size * 2 < min_expand) {
      new_size = min_expand;
    }
    while (new_size < min_expand) {
      new_size *= 2;
    }
    size = new_size;
    for (var name in data) {
      if (data.hasOwnProperty(name)) {
        var newArray = new Float32Array (new_size * data[name].len);
        var oldArray = data[name].array;
        copyArray (newArray, oldArray);
        data[name].array = newArray;
        data[name].dirty = true;
      }
    }
  };

  this.create = function (name, len) {
    if (!len) {
      throw 'Length of buffer must be a positive integer';
    }
    var array = new Float32Array (size * len);
    data[name] = {
      array: array,
      len: len,
      dirty: false
    };
    return data[name].array;
  };

  this.alloc = function (num) {
    if ((current + num) >= size) {
      resize (current + num);
    }
    var start = current;
    current += num;
    return start;
  };

  this.get = function (name) {
    return data[name].array;
  };

  this.write = function (name, array, start, count) {
    copyArray (data[name].array, array, start * data[name].len, count * data[name].len);
    data[name].dirty = true;
  };

  this.repeat = function (name, elem, start, count) {
    for (var i = 0; i < count; i += 1) {
      copyArray (data[name].array, elem,
                 (start + i) * data[name].len, data[name].len);
    }
    data[name].dirty = true;
  };

  this.count = function () {
    return current;
  };

  this.data = function (name) {
    return data[name].array;
  };
};
