# Account Management System

## Overview
This project implements a basic account management system using NestJS and TypeScript. It includes functionalities for creating accounts, making deposits, withdrawing funds, and viewing account statements.

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/account-management-system.git
    cd account-management-system
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **For local environment - set up the database:**
    - Run a PostgreSQL container:
      ```bash
      docker run --name accounts-db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_USER=youruser -e POSTGRES_DB=accountdb -p 5432:5432 -d postgres
      ```
    - Apply the database schema (if using TypeORM migrations or a schema synchronization script).

### Configuration
- Copy the `.env.example` file to `.env` and update the environment variables as needed:
    ```bash
    cp .env.example .env
    ```

### Running the Application

1. **Development Mode:**
    ```bash
    npm run start:dev
    ```

2. **Production Mode:**
    ```bash
    npm run build
    npm run start:prod
    ```

### API Endpoints

#### Create Account
- **URL:** `POST /accounts`
- **Body:**
    ```json
    {
        "personId": number,
        "balance": number,
        "dailyWithdrawalLimit": number
    }
    ```
- **Description:** Create a new account

#### Deposit
- **URL:** `POST /accounts/:accountId/deposit`
- **Body:**
    ```json
    {
        "amount": number
    }
    ```
- **Description:** Deposit money into an account

#### Withdraw
- **URL:** `POST /accounts/:accountId/withdraw`
- **Body:**
    ```json
    {
        "amount": number
    }
    ```
- **Description:** Withdraw money from an account

#### Get Balance
- **URL:** `GET /accounts/:accountId/balance`
- **Description:** Get the balance of an account

#### Get Statement
- **URL:** `GET /accounts/:accountId/transactions`
- **Query Parameters:**
    - `startDate` (optional) - in `YYYY-MM-DDTHH:mm:ssZ` format
    - `endDate` (optional) - in `YYYY-MM-DDTHH:mm:ssZ` format
- **Description:** Get the statement of an account

#### Activate
- **URL:** `PUT /accounts/:accountId/activate`
- **Description:** Activate an account

#### Deactivate
- **URL:** `PUT /accounts/:accountId/deactivate`
- **Description:** Deactivate an account

### Running Tests
- **Unit Tests:**
    ```bash
    npm run test
    ```

### Project Structure

Project structure is as follows:

- `src/entities`: Contains the entity definitions.
- `src/account`: Contains the account management logic, service, and controller.
- `src/transaction`: Contains the transaction service.
- `src/common`: Contains common utility functions.
- `src/common/decorators`: Contains decorators.
