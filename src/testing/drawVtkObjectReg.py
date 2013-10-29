import os
import sys
import time
import datetime

import selenium
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException

from compare_images import *

if __name__ == "__main__":
    # Create a Firefox window driver.
    browser = webdriver.Firefox()
    browser.set_window_size(400, 400)

    # Load the vtkweb application page.
    url = "http://localhost:8000/testing/drawVtkObject.html"
    browser.get(url)

    # Give the page some time to update the image.
    time.sleep(1)

    # Take a screenshot.
    shot = "drawVtkObject-%s.png" % (datetime.datetime.now())
    browser.save_screenshot(shot)

    # Compare the screenshot with the baseline, and report to stdout.
    baseline_dir = os.environ['VGL_BASELINE_DIR']
    print check_result_image(shot, os.path.join(baseline_dir, "baseline-drawVtkObject.png"), 20)

    # Close the browser window.
    browser.quit()
