include(FindPackageHandleStandardArgs)

if(NOT JSDOC_TOOLKIT_TEMPLATE_DIR)
    find_path(JSDOC_TOOLKIT_TEMPLATE_DIR build.properties)
endif()

find_package_handle_standard_args(JSDOC_TOOLKIT_TEMPLATE DEFAULT_MSG JSDOC_TOOLKIT_TEMPLATE_DIR)
