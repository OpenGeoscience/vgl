cmake_minimum_required(VERSION 2.8)

project(vgl NONE)

include(CTest)
enable_testing()

set(VGL_CMAKE_DIR ${${PROJECT_NAME}_SOURCE_DIR}/cmake)

# set up targets for node programs
set(NODE_MODULES_PATH "${CMAKE_CURRENT_SOURCE_DIR}/node_modules")
set(PHANTOMJS_EXECUTABLE "${NODE_MODULES_PATH}/.bin/phantomjs")
set(GRUNT_EXECUTABLE "${NODE_MODULES_PATH}/.bin/grunt")
set(PHANTOMJS_TESTS ON CACHE BOOL "Generate phantomjs unit tests.")
set(COVERAGE_TESTS ON CACHE BOOL "Generate coverage reports.")

set(ESLINT_TESTS ON CACHE BOOL "Generate eslint style tests for JS source files.")

find_package(PythonInterp REQUIRED)
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")

site_name(HOSTNAME)
set(TESTING_HOST "${HOSTNAME}" CACHE STRING "The host to connect to for unit tests")
set(TESTING_PORT 30101 CACHE STRING "The port number to use for the testing web server")
mark_as_advanced(TESTING_PORT)

# set the path where grunt builds the sources
set(VGL_DEPLOY_DIR "${CMAKE_CURRENT_SOURCE_DIR}/dist")


function(add_vgl_test test_name)
  add_test(
    NAME "${test_name}"
    WORKING_DIRECTORY "${VGL_DEPLOY_DIR}"
    COMMAND ${PYTHON_EXECUTABLE}
            ${CMAKE_CURRENT_BINARY_DIR}/test/vgl_test_runner.py
            ${ARGN}
  )
  if (COVERAGE_TESTS)
    set_property(TEST "${test_name}" APPEND PROPERTY DEPENDS "coverage-reset")
    set_property(TEST "coverage-report" APPEND PROPERTY DEPENDS "${test_name}")
  endif()
endfunction()

# copy blanket JS files
configure_file(
  ${CMAKE_CURRENT_SOURCE_DIR}/testing/js/blanket.min.js
  ${VGL_DEPLOY_DIR}/test/lib/blanket.min.js
  COPYONLY
)
configure_file(
  ${CMAKE_CURRENT_SOURCE_DIR}/testing/js/jasmine-boot.js
  ${VGL_DEPLOY_DIR}/test/lib/jasmine-boot.js
  COPYONLY
)
configure_file(
  ${CMAKE_CURRENT_SOURCE_DIR}/testing/js/testUtils.js
  ${VGL_DEPLOY_DIR}/test/lib/testUtils.js
  COPYONLY
)
configure_file(
  ${CMAKE_CURRENT_SOURCE_DIR}/testing/test-runners/aggregate-json-reporter.js.in
  ${VGL_DEPLOY_DIR}/test/lib/aggregate-json-reporter.js
)
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/testing/test-runners/vgl_test_runner.py.in
               ${CMAKE_CURRENT_BINARY_DIR}/test/vgl_test_runner.py
)


if (COVERAGE_TESTS)
  set(SOURCES_INCLUDE <script src=/built/vgl.all.dev.js data-cover></script>)
  set(BLANKET_INCLUDE <script src=/test/lib/blanket.min.js></script>)
  find_program(CURL_EXECUTABLE curl)
  add_test(
    NAME "coverage-reset"
    WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
    COMMAND "${CURL_EXECUTABLE}" -X DELETE "http://${TESTING_HOST}:${TESTING_PORT}/coverage"
  )

  add_test(
    NAME "coverage-report"
    WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
    COMMAND "${CURL_EXECUTABLE}" -X POST "http://${TESTING_HOST}:${TESTING_PORT}/coverage"
      --data "path=${CMAKE_CURRENT_BINARY_DIR}/coverage.xml" -G
  )
  set_property(TEST "coverage-report" APPEND PROPERTY DEPENDS "coverage-reset")

  # We need to put sources under the build path for ctest to pick them up
  file(COPY "${VGL_DEPLOY_DIR}/src" DESTINATION "${CMAKE_CURRENT_BINARY_DIR}")
else()

  set(SOURCES_INCLUDE <script src=/built/vgl.all.dev.js></script>)
  set(BLANKET_INCLUDE "")

endif()

if(PHANTOMJS_TESTS)
  set(PHANTOMJS_REL_DIR "test/phantomjs")
  set(PHANTOMJS_ABS_DIR "${VGL_DEPLOY_DIR}/${PHANTOMJS_REL_DIR}")

  configure_file(
    ${CMAKE_CURRENT_SOURCE_DIR}/testing/js/jasmine-blanket.js
    ${VGL_DEPLOY_DIR}/test/lib/jasmine-blanket.js
    COPYONLY
  )

  configure_file(
    ${CMAKE_CURRENT_SOURCE_DIR}/node_modules/phantomjs-polyfill/bind-polyfill.js
    ${VGL_DEPLOY_DIR}/test/lib/bind-polyfill.js
    COPYONLY
  )

  file(GLOB JS_UNIT_TEST_CASES
    ${CMAKE_CURRENT_SOURCE_DIR}/testing/cases/phantomjs/*.js
  )

  list(APPEND TESTING_DEPENDENCIES ${_min_js_file})

  # add phantomjs unit tests
  foreach(js ${JS_UNIT_TEST_CASES})
    get_filename_component(f "${js}" NAME_WE)
    set(html "${PHANTOMJS_ABS_DIR}/${f}.html")

    add_custom_command(OUTPUT ${html}
      COMMAND ${CMAKE_COMMAND} -DTEST_HTML="${html}"
                               -DSOURCE_DIR="${CMAKE_CURRENT_SOURCE_DIR}"
                               -DSOURCE_FILE="${js}"
                               -DSOURCES_INCLUDE="${SOURCES_INCLUDE}"
                               -DBLANKET_INCLUDE="${BLANKET_INCLUDE}"
                               -P ${CMAKE_SOURCE_DIR}/cmake/configure-js-unit-test.cmake
      COMMAND ${CMAKE_COMMAND} -E touch ${html}
      DEPENDS ${js} ${Girder_DOWNLOAD_FILES} ${CMAKE_SOURCE_DIR}/testing/test-runners/jasmine-runner.html.in
      COMMENT "Generating phantomjs unit test ${f}"
    )
    list(APPEND JS_UNIT_TEST_FILES ${html})

    add_vgl_test(phantomjs:${f}
      ${PHANTOMJS_EXECUTABLE} ${CMAKE_CURRENT_SOURCE_DIR}/testing/test-runners/run-jasmine.js
              http://${TESTING_HOST}:${TESTING_PORT}/${PHANTOMJS_REL_DIR}/${f}.html
    )
  endforeach()

  add_custom_target(
    phantomjs_tests
    ALL
    DEPENDS ${PHANTOMJS_EXECUTABLE} ${JS_UNIT_TEST_FILES} ${Girder_DOWNLOAD_FILES}
  )

endif() # PHANTOMJS_TESTS

if(${ESLINT_TESTS})

  find_program(NPM_EXECUTABLE npm)
  if(NOT NPM_EXECUTABLE)
    message(FATAL_ERROR "npm is required for style checks")
  endif()
  add_test(
    NAME "eslint"
    WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
    COMMAND "${NPM_EXECUTABLE}" "run" "lint"
  )

endif() # ESLINT_TESTS


set(REBUILD_JSDOC OFF CACHE BOOL "Enable rebuilding of docs/*.rst")
set(BUILD_DOCUMENTATION OFF CACHE BOOL "Build documentation")


# Documentation

if (BUILD_DOCUMENTATION)
  # Find sphinx-build
  find_program(SPHINX_EXECUTABLE NAMES sphinx-build DOC
               "The sphinx build tool")
  if(NOT SPHINX_EXECUTABLE)
    message(FATAL_ERROR "Can not find sphinx build tool: sphinx-build")
  endif()

  # Copy config to the docs directory
  add_custom_command(
    OUTPUT "${vgl_BINARY_DIR}/docs/conf.py"
    COMMAND ${CMAKE_COMMAND} -E copy_if_different "${vgl_SOURCE_DIR}/docs/conf_jsdoc.py"
            "${vgl_BINARY_DIR}/docs/conf.py"
  )
  add_custom_target(vgl_copy_sphinx_config ALL DEPENDS
                    "${vgl_BINARY_DIR}/docs/conf.py")

  add_custom_command(
    OUTPUT ${vgl_BINARY_DIR}/docs/sphinx
    COMMAND ${SPHINX_EXECUTABLE} -b html "${vgl_SOURCE_DIR}/docs"
            "${vgl_BINARY_DIR}/docs/sphinx"
  )
  add_custom_target(vgl_build_docs_sphinx ALL DEPENDS
                    "${vgl_BINARY_DIR}/docs/sphinx")
  add_dependencies(vgl_build_docs_sphinx vgl_copy_sphinx_config)
  # add_dependencies(${PROJECT_NAME} vgl_build_docs_sphinx)
endif()

if (REBUILD_JSDOC)
  # Find jsdoc-toolkit-rst-template
  find_package(JSDocToolkitTemplate)

  # Find jsdoc-toolkit
  find_package(JSDocToolkit)

  # Find ant
  find_program(ANT_EXECUTABLE NAMES ant DOC "The ant build tool")
  if(NOT ANT_EXECUTABLE)
    message(FATAL_ERROR "Can not find ant build tool: ant")
  endif()

  add_custom_command(
    OUTPUT ${vgl_BINARY_DIR}/docs
    COMMAND ${ANT_EXECUTABLE} -Djs.src.dir=${vgl_SOURCE_DIR}/src
            -Djs.rst.dir=${vgl_SOURCE_DIR}/docs
            -Djsdoc-toolkit.dir=${JSDOC_TOOLKIT_DIR}
    WORKING_DIRECTORY "${JSDOC_TOOLKIT_TEMPLATE_DIR}"
  )
  add_custom_target(vgl_build_docs ALL DEPENDS "${vgl_BINARY_DIR}/docs")
  add_dependencies(vgl_copy_sphinx_config vgl_build_docs)
endif()
