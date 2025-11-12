# Sample DSAR App

A sample AWS Lambda function that demonstrates how to handle webhook events from Osano's Subject Rights product. This application processes subject right events and manages action items in the Osano platform.

## Overview

## Request Format

The Lambda function expects a POST request with the following payload:

```json
{
  "email": "user@example.com",
  "dsarActionItemId": 123,
  "requestedAction": "DELETE"
}
```

## Deployment

### Prerequisites

- AWS Account with Lambda access

### Steps

1. **Zip the sample-handler folder contents:**

   ```bash
   zip -r ../sample-handler.zip .
   ```

2. **Upload to AWS Lambda:**

   1. Go to AWS Lambda Console
   2. Create a new function
   3. Set the architecture to arm64
   4. Set the runtime to Node.js 22.x
   5. Set function url to enabled
   6. Upload the `sample-handler.zip` file
   7. Set the handler to `index.handler`
   8. Under General Configuration, up the default timeout from 3 seconds to 1 minute

3. **Configure Environment Variables:**
   Add the following environment variables in the Lambda configuration:

   - `OSANO_API_KEY` - Osano API key (Create the key from the API keys section under my.osano.com)
