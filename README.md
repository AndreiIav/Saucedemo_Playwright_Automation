# Playwright Test Automation Suite – SauceDemo

This project is a **test automation suite built with Playwright and Typescript** for the practice application [www.saucedemo.com](https://www.saucedemo.com/). The site provides multiple predefined users, each exposing different application behaviors.

The test suite follows the **Page Object Model (POM)** pattern.

Tests are executed by default with `standard_user`, but any saucedemo user can be supplied at runtime via configuration or environment variables.

When executed against non-standard users (e.g. `problem_user`, `error_user`), the suite is able to detect an report existing defects in the application.

# Tech Stack
- Playwright
- TypeScript
- Docker
- Github Actions
- Github Pages (for test reports)

# Supported Browsers
Tests are executed only in Chromium. Other browers can be easily added in playwright.config.ts. For running tests with Docker this decision was made to minimize the Docker image size.

# Running the Tests without Docker
# Prerequisites
- Node.js
- npm
# Installation
Clone the repository and install dependencies:\
`git clone https://github.com/AndreiIav/Saucedemo_Playwright_Automation.git`\
`cd Saucedemo_Playwright_Automation`\
`npm install`\
Install Playwright browsers (Chromium only):\
`npx playwright install chromium`

# Running Tests
By default, tests run using `standard_user`:\
`npx playwright test`\
Run tests for a different user by providing the `USERNAME` environment variable:\
`USERNAME=problem_user npx playwright test`\
Any valid saucedemo username can be supplied.

# Running the Tests with Docker
# Prerequisites
- Docker installed and running
# Build the Docker Image
`docker build -t playwright-tests .`
# Run Tests in Docker
`docker run --rm playwright-tests`\
Run tests for a specific user by passing an environment variable:\
`docker run --rm -e USERNAME=problem_user playwright-tests`

# Continous Integration (Github Actions)
This project includes a **Github Actions CI pipeline** that:
1. Builds the Docker image
2. Executes the test suite for multiple users (standard_user, problem_user, error_user)
3. Generates separate Playwright HTML reports per user
4. Publishes all reports to Github Pages at [https://andreiiav.github.io/Saucedemo_Playwright_Automation/](https://andreiiav.github.io/Saucedemo_Playwright_Automation/)