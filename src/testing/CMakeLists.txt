set(_tests
  drawCountries.py
  pickObjects.py
)

foreach(_test ${_tests})
  add_test(python-${_test} ${PYTHON_EXECUTABLE}
             ${CMAKE_CURRENT_SOURCE_DIR}/${_test})
endforeach()
