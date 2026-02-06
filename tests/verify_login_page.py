from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_login_page(page: Page):
    print("Navigating to login page...")
    # Navigate to the app (using hash routing for login)
    page.goto("http://localhost:3000/#/login")

    # Wait for the form to appear
    print("Waiting for login form...")
    page.wait_for_selector("#login-form", state="visible")

    # Check if inputs exist
    expect(page.locator("#student_id")).to_be_visible()
    expect(page.locator("#password")).to_be_visible()
    expect(page.get_by_role("button", name="Login")).to_be_visible()

    print("Login page verified successfully.")

    # Take a screenshot
    page.screenshot(path="login_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_login_page(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
