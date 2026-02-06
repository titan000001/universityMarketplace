from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_password_toggle(page: Page):
    # LOGIN PAGE
    print("Navigating to login page...")
    page.goto("http://localhost:3000/#/login")

    print("Waiting for password input...")
    page.wait_for_selector("#password", state="visible")

    password_input = page.locator("#password")
    toggle_btn = page.locator("#toggle-password")

    # Initial State
    print("Verifying initial state (Login)...")
    expect(password_input).to_have_attribute("type", "password")
    expect(toggle_btn).to_have_attribute("aria-label", "Show password")
    expect(toggle_btn.locator("i")).to_have_class("fas fa-eye")

    # Click Toggle
    print("Clicking toggle button (Login)...")
    toggle_btn.click()

    # Verify State Change
    print("Verifying state after click (Show) (Login)...")
    expect(password_input).to_have_attribute("type", "text")
    expect(toggle_btn).to_have_attribute("aria-label", "Hide password")
    expect(toggle_btn.locator("i")).to_have_class("fas fa-eye-slash")

    # REGISTER PAGE
    print("Navigating to register page...")
    page.goto("http://localhost:3000/#/register")

    print("Waiting for password input (Register)...")
    page.wait_for_selector("#password", state="visible")

    password_input = page.locator("#password")
    toggle_btn = page.locator("#toggle-password")

    # Initial State
    print("Verifying initial state (Register)...")
    expect(password_input).to_have_attribute("type", "password")
    expect(toggle_btn).to_have_attribute("aria-label", "Show password")
    expect(toggle_btn.locator("i")).to_have_class("fas fa-eye")

    # Click Toggle
    print("Clicking toggle button (Register)...")
    toggle_btn.click()

    # Verify State Change
    print("Verifying state after click (Show) (Register)...")
    expect(password_input).to_have_attribute("type", "text")
    expect(toggle_btn).to_have_attribute("aria-label", "Hide password")
    expect(toggle_btn.locator("i")).to_have_class("fas fa-eye-slash")

    print("Password toggle verified successfully on both pages.")

    # Screenshot
    page.screenshot(path="password_toggle_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_password_toggle(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
