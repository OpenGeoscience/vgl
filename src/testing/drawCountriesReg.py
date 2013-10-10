import sys
import time

import selenium
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException

from compare_images import *

if __name__ == "__main__":
    # Create a Chrome window driver.
    browser = webdriver.Chrome()
    browser.set_window_size(400, 400)

    # Load the vtkweb application page.
    url = "http://localhost:8000/testing/drawCountries.html"
    browser.get(url)

    # Give the page some time to update the image.
    time.sleep(1)

    # Take a screenshot.
    shot = "drawCountries-%s.png" % (now())
    browser.save_screenshot(shot)

    # Compare the screenshot with the baseline, and report to stdout.
    print check_result_image(shot, "baseline-drawCountries.png")

    # Close the browser window.
    browser.quit()