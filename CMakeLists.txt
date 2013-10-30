cmake_minimum_required(VERSION 2.8.8)

project(vgl)

set(VGL_CMAKE_DIR ${${PROJECT_NAME}_SOURCE_DIR}/cmake)

set(MINIFY ON CACHE BOOL "Minify the JavaScript files prior to concatenating.")
set(MANGLE ON CACHE BOOL "When minifying, also mangle non-public symbol names.")
set(VGL_DATA_DIR "" CACHE PATH  "Path to directory containing data for testing.")
set(VGL_BASELINE_DIR "" CACHE PATH "Path to directory containing baseline images for testing.")
set(BUILD_TESTING OFF CACHE BOOL "Enable testing")

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")

# Find JSLint.
find_package(JSLint)

# Find UglifyJS.
find_package(UglifyJS)

set(_source_files
  init.js
  timestamp.js
  object.js
  command.js
  boundingObject.js
  node.js
  groupNode.js
  actor.js
  camera.js
  freezeObject.js
  defaultValue.js
  geojsonReader.js
  data.js
  geomData.js
  mapper.js
  groupMapper.js
  materialAttribute.js
  blend.js
  material.js
  renderer.js
  renderWindow.js
  interactorStyle.js
  trackballInteractorStyle.js
  viewer.js
  shader.js
  shaderProgram.js
  texture.js
  uniform.js
  vertexAttribute.js
  source.js
  planeSource.js
  pointSource.js
  lineSource.js
  utils.js
  picker.js
  shapefileReader.js
)

set(paths
  modules
)

# VGL requires a deployment directory
if(NOT DEFINED VGL_DEPLOY_DIR)
  set(VGL_DEPLOY_DIR "${CMAKE_CURRENT_BINARY_DIR}/deploy"
      CACHE PATH "PATH to deployment directory" FORCE)
endif()

# Useuful macro
macro(list_contains var value)
  set(${var})
  foreach(value2 ${ARGN})
    if(${value} STREQUAL ${value2})
      set(${var} TRUE)
    endif(${value} STREQUAL ${value2})
  endforeach(value2)
endmacro(list_contains)

#/////////////////////////////////////////////////////////////////////////////
#//
#//
#//
#/////////////////////////////////////////////////////////////////////////////

# Create deploy directory if it does not exists
if(NOT DEFINED VGL_DEPLOY_LIB_DIR)
 set(VGL_DEPLOY_LIB_DIR "${VGL_DEPLOY_DIR}/web/lib")
  add_custom_command(OUTPUT "${VGL_DEPLOY_LIB_DIR}"
    COMMAND ${CMAKE_COMMAND} -E make_directory "${VGL_DEPLOY_LIB_DIR}"
  )
  add_custom_target(vgl_pre_deploy ALL
    DEPENDS
      ${VGL_DEPLOY_LIB_DIR}
  )
endif()

set(_min_js_file ${VGL_DEPLOY_LIB_DIR}/vgl.min.js)
set(_js_lint_files)
set(_js_uglify_files)

foreach(d ${_source_files})
  list_contains(contains d ${_exclude_js_lint})
  if(NOT contains)
      set(_js_lint_files ${_js_lint_files} ${CMAKE_CURRENT_SOURCE_DIR}/src/${d})
  endif()
  set(_js_uglify_files ${_js_uglify_files} ${CMAKE_CURRENT_SOURCE_DIR}/src/${d})
endforeach()

if (UglifyJS_EXECUTABLE)
  add_custom_command(
    OUTPUT ${_min_js_file}
    COMMAND ${UglifyJS_EXECUTABLE} -o ${_min_js_file} ${_js_uglify_files}
            ${MINIFY_FLAG} ${MANGLE_FLAG}
    DEPENDS ${VGL_DEPLOY_LIB_DIR} ${_js_uglify_files}
  )
else()
  # Use custom command to call CMake script to cat files together
  add_custom_command(
    OUTPUT ${_min_js_file}
    COMMAND ${CMAKE_COMMAND} -DCAT_OUTPUT_FILE=${_min_js_file}
            # Note the quotes so we get the ; included
            "-DCAT_FILES=${_js_uglify_files}"
            -P ${CMAKE_CURRENT_SOURCE_DIR}/cmake/cat.cmake
    DEPENDS ${VGL_DEPLOY_LIB_DIR} ${_js_uglify_files}
    VERBATIM
  )
endif()

add_custom_target(${PROJECT_NAME} ALL DEPENDS ${_min_js_file})
add_dependencies(${PROJECT_NAME} vgl_pre_deploy)

# Copy directories / files to the deployment directory
foreach(m ${paths})
    set(copy_command "copy")
    if (IS_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/${m}")
      set(copy_command "copy_directory")
    endif()
    set(outpath ${VGL_DEPLOY_DIR}/${m})
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E ${copy_command}
          ${CMAKE_CURRENT_SOURCE_DIR}/${m} ${outpath}
        DEPENDS ${m}
    )
endforeach()

# Testing
if (BUILD_TESTING)
  include(CTest)
  enable_testing()

  if(EXISTS "${VGL_DATA_DIR}" AND IS_DIRECTORY "${VGL_DATA_DIR}")
    message("[info] VGL data directory is set to ${VGL_DATA_DIR}")
  else()
    message(FATAL_ERROR "VGL testing requires valid data directory")
  endif()

  # Setup testing environment
  add_custom_target(vgl_configure ALL
    COMMAND ${CMAKE_COMMAND}
      -DVGL_CMAKE_DIR=${VGL_CMAKE_DIR}
      -DVGL_BASELINE_DIR=${VGL_BASELINE_DIR}
      -DVGL_DATA_DIR=${VGL_DATA_DIR}
      -DVGL_DEPLOY_DIR=${VGL_DEPLOY_DIR}
      -P ${VGL_CMAKE_DIR}/configure.cmake
  )
  add_dependencies(${PROJECT_NAME} vgl_configure)

  # Non-GUI tests
  add_custom_command(
    OUTPUT "${VGL_DEPLOY_DIR}/data"
    COMMAND ${CMAKE_COMMAND} -E copy_directory "${VGL_DATA_DIR}"
            "${VGL_DEPLOY_DIR}/data"
  )
  add_custom_target(vgl_data ALL DEPENDS "${VGL_DEPLOY_DIR}/data")
  add_dependencies(${PROJECT_NAME} vgl_data)

  add_custom_command(
    OUTPUT "${VGL_DEPLOY_DIR}/testing"
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${CMAKE_CURRENT_SOURCE_DIR}/testing
            "${VGL_DEPLOY_DIR}/testing"
  )
  add_custom_target(vgl_testing ALL DEPENDS "${VGL_DEPLOY_DIR}/testing")
  add_dependencies(${PROJECT_NAME} vgl_testing)

  # GUI testing (requires python)
  find_package(PythonInterp REQUIRED)
  add_subdirectory(src)
endif()

# JSLint tests.
foreach(f ${_js_lint_files})
    add_test(jslint-${f} ${JSLint_EXECUTABLE} ${f})
endforeach()
