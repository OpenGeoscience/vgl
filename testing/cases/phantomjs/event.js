/*global describe, it, expect, vgl*/
describe('vgl.event', function () {
  describe('Create', function () {
    it('create function', function () {
      var evt = vgl.event();
      expect(evt instanceof vgl.event).toBe(true);
      expect(evt.getMTime()).toBeGreaterThan(0);
    });
  });
  describe('Constants', function () {
    it('class constants', function () {
      var list = [
        'keyPress', 'mousePress', 'mouseRelease', 'contextMenu', 'configure',
        'enable', 'mouseWheel', 'keyRelease', 'middleButtonPress',
        'startInteraction', 'enter', 'rightButtonPress', 'middleButtonRelease',
        'char', 'disable', 'endInteraction', 'mouseMove', 'mouseOut', 'expose',
        'timer', 'leftButtonPress', 'leave', 'rightButtonRelease',
        'leftButtonRelease', 'click', 'dblClick'
      ];
      for (var i =0; i < list.length; i += 1) {
        expect(vgl.event[list[i]]).toBe('vgl.event.' + list[i]);
      }
    });
  });
});
