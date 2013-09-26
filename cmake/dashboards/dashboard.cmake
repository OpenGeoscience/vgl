###############################################################################
#
# Usage: ctest -S dashboard.cmake,"branch_name;build_prefix;target_file"
#
###############################################################################

cmake_minimum_required(VERSION 2.8.10)
set(CTEST_PROJECT_NAME "VGL")

###############################################################################
#
# Setup
#

# Requires DASHROOT to be set
if(NOT DEFINED ENV{DASHROOT})
  message(FATAL_ERROR "[ERROR] DASHROOT environment variable is not set")
endif()

file(TO_CMAKE_PATH "$ENV{DASHROOT}" DASHROOT)

# Fetch the hostname of the current machine (assumes at kitware)
execute_process(COMMAND hostname OUTPUT_VARIABLE HOSTNAME OUTPUT_STRIP_TRAILING_WHITESPACE)

# Helpful macro
macro(read_args branch_name system_name target_cmake_file)
  set(PROJECT_BRANCH "${branch_name}")
  set(BUILD_NAME "${system_name}")
  set(TARGET_CMAKE_FILE "${target_cmake_file}")
endmacro(read_args)

# Get the branch name from the script argument, default to master
if(CTEST_SCRIPT_ARG)
  read_args(${CTEST_SCRIPT_ARG})
else(CTEST_SCRIPT_ARG)
  read_args(master ${CMAKE_SYSTEM_VERSION} "${HOSTNAME}.cmake")
endif(CTEST_SCRIPT_ARG)

# Display build name and project branch we are currently building
message("[INFO] BUILD_NAME is ${BUILD_NAME}")
message("[INFO] PROJECT_BRANCH is ${PROJECT_BRANCH}")

# Detect the processor architecture (should be x86 or X86_64)
set(PROJECT_BUILD_ARCH ${CMAKE_SYSTEM_PROCESSOR})

# Select the dashboard root and type from environment variables, default to Experimental
set(PROJECT_BUILD_INTERVAL "$ENV{DASHTYPE}")
if(NOT PROJECT_BUILD_INTERVAL MATCHES "^(Nightly|Continuous)$")
  set(PROJECT_BUILD_INTERVAL Experimental)
endif(NOT PROJECT_BUILD_INTERVAL MATCHES "^(Nightly|Continuous)$")

# For dynamic analysis and coverage tests (made optional)
set(PERFORM_MEMCHECK TRUE)
set(PERFORM_COVERAGE TRUE)

# Provide CTest with some auxilliary information
set(CTEST_CMAKE_COMMAND "\"${CMAKE_EXECUTABLE_NAME}\"")
set(CTEST_NOTES_FILES "${CTEST_SCRIPT_DIRECTORY}/${CTEST_SCRIPT_NAME}")

find_program(CTEST_GIT_COMMAND NAMES git git.exe git.cmd)

set(CTEST_UPDATE_COMMAND "${CTEST_GIT_COMMAND}")
set(CTEST_BUILD_CONFIGURATION Debug)
set(CTEST_SITE "${HOSTNAME}.kitware")
set(CTEST_BUILD_NAME "${BUILD_NAME}-${PROJECT_BUILD_ARCH}-${PROJECT_BRANCH}")

# Set specific properties dependent on build platform (unix/w32/w64)
if(UNIX)
  set(CTEST_CMAKE_GENERATOR "Unix Makefiles")
  set(CTEST_BUILD_COMMAND "/usr/bin/make -j9 -k")

  find_program(CTEST_MEMCHECK_COMMAND NAMES valgrind)
  find_program(CTEST_COVERAGE_COMMAND NAMES gcov44 gcov)

  if(CTEST_COVERAGE_COMMAND)
    set(CTEST_COVERAGE_FLAGS "-fprofile-arcs -ftest-coverage")
    set(ENV{LDFLAGS} "$ENV{LDFLAGS} ${CTEST_COVERAGE_FLAGS}")
  endif()

  set(CTEST_USE_LAUNCHERS 1)
  set(PROJECT_STATIC_LIB_EXT)
elseif(WIN32)
  # Windows machines don't have valgrind or gcov
  set(PERFORM_MEMCHECK FALSE)
  set(PERFORM_COVERAGE FALSE)

  # Select Win64 if applicable (isn't a 32-bit environment, or 64-bit forced)
  string(COMPARE NOTEQUAL "$ENV{WIN32DIR}" "" USE_32_BIT)
  string(COMPARE NOTEQUAL "$ENV{FORCE64BIT}" "" FORCE_64_BIT)

  if((USE_32_BIT OR ("${PROJECT_BUILD_ARCH}" STREQUAL "x86")) AND NOT FORCE_64_BIT)
    set(CTEST_CMAKE_GENERATOR "Visual Studio 9 2008")
    set(PROJECT_BUILD_ARCH "x86")
  else((USE_32_BIT OR ("${PROJECT_BUILD_ARCH}" STREQUAL "x86")) AND NOT FORCE_64_BIT)
    set(CTEST_CMAKE_GENERATOR "Visual Studio 9 2008 Win64")
    set(PROJECT_BUILD_ARCH "x86_64")
  endif()

  set(PROJECT_STATIC_LIB_EXT)
endif()

# Set up the source and build directories properly
string(REPLACE "/" "_" PROJECT_BRANCH_DIRECTORY "${PROJECT_BRANCH}") # Replace slashes with underscores for path
set(CTEST_BINARY_DIRECTORY "${DASHROOT}/${CTEST_PROJECT_NAME}/builds/${PROJECT_BRANCH_DIRECTORY}/VGL-${PROJECT_BUILD_INTERVAL}-${PROJECT_BUILD_ARCH}")
set(CTEST_SOURCE_DIRECTORY "${DASHROOT}/${CTEST_PROJECT_NAME}/source/${PROJECT_BRANCH_DIRECTORY}/VGL-${PROJECT_BUILD_INTERVAL}-${PROJECT_BUILD_ARCH}")

# Prepare to do an initial checkout, if necessary
if(CTEST_UPDATE_COMMAND AND NOT EXISTS "${CTEST_SOURCE_DIRECTORY}")
  set(CTEST_CHECKOUT_COMMAND "${CTEST_UPDATE_COMMAND} clone -b ${PROJECT_BRANCH} https://github.com/OpenGeoscience/vgl.git ${CTEST_SOURCE_DIRECTORY}")
endif()

# On non-continuous or first build of the day, clear the build directory
if((NOT "${PROJECT_BUILD_INTERVAL}" STREQUAL "Continuous") OR ("$ENV{FIRST_BUILD}" STREQUAL "TRUE"))
  ctest_empty_binary_directory("${CTEST_BINARY_DIRECTORY}")
endif()

# Populate CMakeCache using host/target specific settings
if(EXISTS "${CTEST_SCRIPT_DIRECTORY}/${TARGET_CMAKE_FILE}")
  message("[INFO] Including ${CTEST_SCRIPT_DIRECTORY}/${TARGET_CMAKE_FILE}")
  include("${CTEST_SCRIPT_DIRECTORY}/${TARGET_CMAKE_FILE}")
else()
  message(FATAL_ERROR "[ERROR] "${TARGET_CMAKE_FILE}" does not exist")
endif()

###############################################################################
#
# Perform actual dashboard execution
#

ctest_start("${PROJECT_BUILD_INTERVAL}")
ctest_update(SOURCE "${CTEST_SOURCE_DIRECTORY}" RETURN_VALUE NUM_FILES_UPDATED)

# Only configure, build, and test for nightlies, new continuous, or on updates
if((NOT "${PROJECT_BUILD_INTERVAL}" STREQUAL "Continuous") OR ("$ENV{FIRST_BUILD}" STREQUAL "TRUE") OR (NUM_FILES_UPDATED GREATER 0) OR ("$ENV{DASHSEND}" STREQUAL "TRUE"))

  ctest_configure()
  ctest_read_custom_files("${CTEST_BINARY_DIRECTORY}")

  ctest_build()
  ctest_test(BUILD "${CTEST_BINARY_DIRECTORY}" PARALLEL_LEVEL 1)

  if(PERFORM_COVERAGE AND CTEST_COVERAGE_COMMAND AND "${PROJECT_BUILD_INTERVAL}" STREQUAL "Nightly")
    ctest_coverage(BUILD "${CTEST_BINARY_DIRECTORY}")
  endif()

  if(PERFORM_MEMCHECK AND CTEST_MEMORYCHECK_COMMAND)
    set(CTEST_MEMORYCHECK_SUPPRESSIONS_FILE "${CTEST_SOURCE_DIRECTORY}/tests/valgrind.supp")
    ctest_memcheck(BUILD "${CTEST_BINARY_DIRECTORY}" PARALLEL_LEVEL 1)
  endif()

  ctest_submit()

endif()
