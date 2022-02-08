📢 Use this project, [contribute](https://github.com/vtex-apps/connector-adyen) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Adyen Platforms

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

This app integrates the [Adyen for Platforms](https://docs.adyen.com/platforms) service with your VTEX marketplace.

## Configuration

### Adyen Payment Setup

⚠️ Before you can use the Adyen Platforms app, the [Adyen Payment connector](https://github.com/vtex-apps/connector-adyen) must be installed and configured in you VTEX account.

### Installing the App

1. Install this app in the desired account using the CLI command `vtex install vtex.adyen-platforms`.
2. In your admin sidebar, select `Adyen for Platforms` under the **Marketplace** section.
3. Select the `Settings` tab:
   - Enter your Platform API credentials.
      - Switch from `Company` account to `Merchant` account
      - Under the **Developers** menu, select `API credentials`
      - Select the username that follows this format `ws\_[123456]@MarketPlace.[YourPlatformAccount]`, if there is no username in that format, see **Creating New Web Service User**
      - Use `Generate New API Key` to create a new key for Adyen and store it somewhere safe. This can be regenerated if lost
   - Enter your production Adyen for Platforms API endpoint. For testing, you can enter the test endpoint: `https://cal-test.adyen.com/cal/services`. This is also found under the **Developers** menu in your Adyen account.
   - Enter the URL sub-merchants will be directed to when they complete their onboarding. This is optional, see the Onboarding section for details on this process.

### Managing Seller Accounts

The Sellers tab in the Adyen for Platforms menu in your VTEX admin will display all Seller accounts in your VTEX marketplace.
- Users can `Create Adyen Account` for specific sellers
  1. Enter the Adyen Account Holder Code
    - Ensure you're on Adyen's `Merchant` account in Adyen's website
    - Under the `Platform` tab, select `Sub-merchants`. Select the desired `Adyen Account Holder Code`
  2. Enter the Country, Entity Type, Business Name, and Business Email
  3. Set the desired payout schedule. See section `Payout Schedule` for more information
- Users can create a new `Onboarding Link`

#### Onboarding New Sellers

If a seller has not yet been onboarded, you will have the option to create an Adyen account for the selected seller. This option creates a unique URL for that seller. The URL needs to be provided to the seller, which will direct them to the Adyen [hosted onboarding page](https://docs.adyen.com/platforms/hosted-onboarding-page).

You will be able to accept payment on behalf of a seller immediately after created a Adyen account for them, but payouts of collected payments will be disabled until the seller completes the Adyen onboarding process.

ℹ️ After completing the Adyen hosted onboarding, users will be redirecting to the URL you entered in the app settings. If no URL was entered, they are redirected back to a default onboarding success page that is provided when you install the app, `https://[Store]/marketplace/onboard-complete/`

#### Payout Schedule

The Adyen default payout schedule for a seller is `daily`. You can change this setting to the desired interval

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
