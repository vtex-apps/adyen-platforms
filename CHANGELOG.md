# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2022-08-01

### Added

- Error logging
- GraphQL directive to check user access before running mutations and queries
- Admin access restriction

## [0.3.3] - 2022-07-13

### Fixed

- Fixed a bug where the Adyen Menu page got seller's account status from first account listed instead of first active account
- Fixed a bug where Payouts dropdown in Seller Detail page displayed `Daily` instead of saved payout schedule

## [0.3.2] - 2022-06-08

### Added

- Added adyen live to outbound access

## [0.3.1] - 2022-04-15

### Fixed

- Fixed a bug where the Adyen Menu page shows the incorrect status

## [0.3.0] - 2022-04-11

### Added

- Added a processing tier selection on the account creation modal

## [0.2.1] - 2022-03-03

### Added

- Updated readme to include details about contacting Adyen and how to use Adyen for Platforms Page

## [0.2.0] - 2022-03-01

### Added

- Added the ability to show the latest Active account if the user has Closed accounts

### Fixed

- Fixed various inconsistencies due to removal of dispatch
- Fixed a bug where the account status would not update after an account is closed

## [0.1.2] - 2022-03-01

### Fixed

- Prevents Create New Link from being clicked when account is suspended

## [0.1.1] - 2022-02-14

### Fixed

- Fixed a bug where the seller page would be stuck in an infinite loop
