import time
import os
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

def run_tests():
    driver = None
    print("Initializing Selenium Webdriver...")
    
    try:
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
        driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
        print("Chrome initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize Chrome: {e}. Trying Edge...")
        try:
            options = webdriver.EdgeOptions()
            options.add_argument("--headless=new")
            options.add_argument("--disable-gpu")
            driver = webdriver.Edge(service=EdgeService(EdgeChromiumDriverManager().install()), options=options)
            print("Edge initialized successfully.")
        except Exception as e2:
            print(f"Failed to initialize Edge: {e2}")
            sys.exit(1)

    url = "http://localhost:8000"
    print(f"Loading website at {url}...")
    driver.get(url)

    errors = []
    successes = []

    def check_console_logs():
        try:
            logs = driver.get_log("browser")
            for log in logs:
                if log["level"] in ["SEVERE", "ERROR"]:
                    print(f"BROWSER ERROR: {log['message']}")
                    errors.append(f"Console error: {log['message']}")
        except Exception as e:
            pass

    try:
        # Wait up to 15 seconds for greeting banner to load
        print("Waiting for page load (greeting-banner)...")
        try:
            banner = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.ID, "greeting-banner"))
            )
            print(f"Greeting banner text: '{banner.text}'")
            successes.append("Greeting banner loaded.")
        except Exception as load_ex:
            print(f"Failed to load page: {load_ex}")
            print("=== PAGE SOURCE ===")
            print(driver.page_source[:2000]) # Print first 2000 chars of page source
            print("===================")
            raise load_ex

        # Test 2: Filter Experience & Industry
        fresher_btn = driver.find_element(By.CSS_SELECTOR, "#exp-filters [data-exp='fresher']")
        exp_btn = driver.find_element(By.CSS_SELECTOR, "#exp-filters [data-exp='experienced']")
        
        exp_btn.click()
        time.sleep(0.5)
        print("Clicked Experienced filter.")
        
        civil_btn = driver.find_element(By.CSS_SELECTOR, "#industry-filters [data-ind='civil']")
        civil_btn.click()
        time.sleep(0.5)
        print("Clicked Civil industry filter.")
        
        # Verify cards
        cards = driver.find_elements(By.CLASS_NAME, "template-card")
        print(f"Found {len(cards)} template cards for Experienced Civil.")
        if len(cards) > 0:
            successes.append(f"Filtered catalog loaded {len(cards)} templates.")
        else:
            errors.append("No template cards found after filtering.")

        # Test 3: Select template card
        cards[0].click()
        time.sleep(1)
        print("Selected the first template card.")
        
        # Check transition to workspace
        workspace = driver.find_element(By.ID, "builder-workspace")
        if workspace.is_displayed():
            successes.append("Workspace panel successfully displayed.")
        else:
            errors.append("Workspace panel did not display after card selection.")

        # Test 4: Fill Personal Details (Step 1)
        name_input = driver.find_element(By.ID, "input-name")
        print(f"Default name filled: '{name_input.get_attribute('value')}'")
        name_input.clear()
        name_input.send_keys("Test Professional Name")
        time.sleep(0.5)
        
        # Click Next
        next_btn = driver.find_element(By.ID, "btn-wizard-next")
        next_btn.click()
        time.sleep(0.5)
        print("Clicked Next (Step 2 - Summary)")

        # Test 5: Summary Suggestions (Step 2)
        summary_suggestions = driver.find_elements(By.CLASS_NAME, "suggestion-card")
        print(f"Found {len(summary_suggestions)} summary suggestions.")
        if len(summary_suggestions) > 0:
            successes.append("Summary suggestions panel loaded options.")
            summary_suggestions[0].click()
            time.sleep(0.5)
            print("Selected first summary suggestion.")
        else:
            errors.append("Summary suggestions panel did not load any options.")
            
        next_btn.click()
        time.sleep(0.5)
        print("Clicked Next (Step 3 - Skills)")

        # Test 6: Skills (Step 3)
        skills_input = driver.find_element(By.ID, "input-skills")
        print(f"Default skills: '{skills_input.get_attribute('value')}'")
        next_btn.click()
        time.sleep(0.5)
        print("Clicked Next (Step 4 - Work Experience)")

        # Test 7: Add/Remove Work Experience (Step 4)
        add_exp_btn = driver.find_element(By.ID, "btn-add-experience")
        add_exp_btn.click()
        time.sleep(0.5)
        exp_cards_before = len(driver.find_elements(By.CLASS_NAME, "experience-item-card"))
        print(f"Experience cards after click Add: {exp_cards_before}")
        
        remove_btns = driver.find_elements(By.CSS_SELECTOR, ".experience-item-card .btn-remove-item")
        if len(remove_btns) > 0:
            remove_btns[-1].click()
            time.sleep(0.5)
            exp_cards_after = len(driver.find_elements(By.CLASS_NAME, "experience-item-card"))
            print(f"Experience cards after click Remove: {exp_cards_after}")
            if exp_cards_after == exp_cards_before - 1:
                successes.append("Work Experience Add/Remove buttons function correctly.")
            else:
                errors.append("Work Experience Remove button did not remove the card.")
        else:
            errors.append("No remove button found in experience card.")

        # Cycle through remaining steps
        for step in ["Projects", "Education", "Certifications"]:
            next_btn.click()
            time.sleep(0.5)
            print(f"Clicked Next (Step {step})")

        # Now on Step 7 (Certifications), btn-wizard-next should be "Confirm & Download"
        print("Currently on final step. Button text:", next_btn.text)
        next_btn.click()
        time.sleep(1)
        
        # Test 8: Print Modal
        print_modal = driver.find_element(By.ID, "print-modal")
        if print_modal.is_displayed():
            successes.append("Print/AI upgrade modal displayed.")
        else:
            errors.append("Print/AI upgrade modal did not display on final step next click.")

        # Test 9: Reorder Layout Modal
        # Close print modal first
        close_modal_btn = driver.find_element(By.ID, "btn-modal-close")
        close_modal_btn.click()
        time.sleep(0.5)
        
        reorder_btn = driver.find_element(By.ID, "btn-reorder-layout")
        reorder_btn.click()
        time.sleep(0.5)
        
        reorder_modal = driver.find_element(By.ID, "reorder-modal")
        if reorder_modal.is_displayed():
            successes.append("Reorder Layout modal displayed.")
            close_reorder_btn = driver.find_element(By.ID, "btn-close-reorder")
            close_reorder_btn.click()
            time.sleep(0.5)
        else:
            errors.append("Reorder Layout modal did not display.")

        # Test 10: Trigger Print and check for Javascript Errors!
        print("Testing Print flow and capturing browser errors...")
        download_btn = driver.find_element(By.ID, "btn-trigger-download")
        download_btn.click()
        time.sleep(0.5)
        
        skip_ai_btn = driver.find_element(By.ID, "btn-skip-ai")
        print("Clicking 'No, Just Download' which triggers executeSystemPrint()...")
        skip_ai_btn.click()
        time.sleep(2) # Give a moment for the print script to execute/fail
        
    except Exception as ex:
        print(f"Exception occurred during tests: {ex}")
        errors.append(f"Python exception: {ex}")
    finally:
        check_console_logs()
        driver.quit()

    print("\n" + "="*40)
    print("TEST EXECUTION SUMMARY")
    print(f"Successes ({len(successes)}):")
    for s in successes:
        print(f" - {s}")
    print(f"\nErrors/Failures ({len(errors)}):")
    for e in errors:
        print(f" - {e}")
    print("="*40)

if __name__ == "__main__":
    run_tests()
