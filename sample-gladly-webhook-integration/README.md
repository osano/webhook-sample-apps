# Sample Gladly Webhook Integration

A sample AWS Lambda function that demonstrates how to handle webhook events from Osano's Subject Rights product with Gladly. This integration automatically handles data subject requests by summarizing or deleting customer data from Gladly based on webhook events from Osano.

NOTE: This integration has not been tested. It is implemented according to the https://developer.gladly.com/, but there is no guarantee that it will work as expected.

## Overview

This Lambda function processes webhook payloads from Osano and performs the following actions:

- **SUMMARIZE**: Retrieves customer profiles and conversations from Gladly and attaches a summary to the Osano action item
- **DELETE**: Deletes customer profiles from Gladly (after closing all open conversations) and reports the deletion to Osano

## Prerequisites

- Node.js >= 22.x
- AWS Lambda environment
- Gladly API credentials
- Osano API key

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Gladly API Token

1. Navigate to [Gladly Developer Portal](https://developer.gladly.com/rest/#section/Getting-Started/Creating-API-Tokens)
2. Create an API token with the following roles:
   - **Compliance Admin Role** (required for deleting customer profiles)
   - **API User Role** (required for API access)

### 3. Configure Environment Variables

Set the following environment variables in your Lambda function:

```bash
OSANO_API_KEY=your_osano_api_key
GLADLY_AGENT_EMAIL=your_gladly_agent_email
GLADLY_API_KEY=your_gladly_api_key
GLADLY_ORGANIZATION_ID=your_gladly_organization
```

**Note**: The `GLADLY_AGENT_EMAIL` should be the email address of the agent account associated with the API token.

## Deployment

### Deploy to AWS Lambda

1. Package the function:

   ```bash
   zip -r function.zip . -x "node_modules/*" "*.git*" "__tests__/*"
   ```

2. Upload the zip file
