include(FindPackageHandleStandardArgs)

if(NOT JSDOC_TOOLKIT_DIR)
    find_path(JSDOC_TOOLKIT_DIR build.properties)
endif()

find_package_handle_standard_args(JSDOC_TOOLKIT DEFAULT_MSG JSDOC_TOOLKIT_DIR)
