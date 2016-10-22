function  newFunc() {
  return function () {};
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Convenient function to define JS inheritance
 */
//////////////////////////////////////////////////////////////////////////////
vgl.inherit = function (C, P) {
  var F = newFunc();
  F.prototype = P.prototype;
  C.prototype = new F();
  C.prototype.constructor = C;
};