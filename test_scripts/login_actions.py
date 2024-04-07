import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestDriveEasy(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.driver.get("http://localhost:3000/")

    def test_registration_case(self):
        driver = self.driver 

        # Wait for a few seconds to load the page completely
        time.sleep(2)

        registration_button = WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable(("xpath", "//button[contains(text(),'Register')]"))
        )

        # Click the login button
        registration_button.click()
        driver.implicitly_wait(10)

        username_input = driver.find_element("xpath", "//input[contains(placeholder(),'First name')]")

        username_input.send_keys('Karina')

        # Wait for a few seconds to log in
        driver.implicitly_wait(3)

        self.assertTrue(True)


if __name__ == "__main__":
    unittest.main()