Build
*****

You will need cmake_ to build VGL. Follow documentation on _cmake on how
to get it installed on your system. Once installed, follow these steps::

   $ git clone git//github.com:OpenGeoscience/vgl.git
   $ mkdir build
   $ cd build
   $ ccmake ../vgl

If you have installed uglifyjs_, then set UglifyJS_EXECUTABLE to the uglify
executable, and then *configure* again. Finally, when you are satisfied
with all the options, then you can run make to generate the library.::
   $ make

.. _cmake: http://cmake.org
.. _uglifyjs: https://github.com/mishoo/UglifyJS