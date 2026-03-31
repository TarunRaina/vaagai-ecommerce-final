# Razorpay Test Mode Setup Guide

Follow these steps to get your API keys for the integration. Since this is a project, we will use **Test Mode** (no real money involved).

## 1. Create an Account
1. Go to [Razorpay Sign Up](https://dashboard.razorpay.com/signup).
2. Enter your email and set a password.
3. You can skip the detailed business verification for now by selecting "Unregistered" or "Individual" if prompted.

## 2. Switch to Test Mode
Once you are in the Dashboard:
1. Look at the bottom left or top right of the screen.
2. Toggle the switch from **Live Mode** to **Test Mode**.
3. You should see a yellow banner or indicator saying "TEST MODE".

## 3. Generate API Keys
1. Go to **Settings** in the left sidebar.
2. Click on the **API Keys** tab.
3. Click the **Generate Test Key** button.
4. You will see:
   - **Key ID** (starts with `rzp_test_...`)
   - **Key Secret** (this is shown only ONCE)
5. **CRITICAL**: Copy both of these and keep them safe. You will need to provide them to me (or paste them into the project configuration) in the next step.

## 4. Test Transactions
In Test Mode, you can use these card details to simulate success:
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date
- **CVV**: `123`
- **OTP**: `123456`
