# Auction Service - Backend

Backend for the Auction Service

## Technologies used

-   serverless framwork
-   AWS Services: (Lambda Functions, Event Bridge, DynamoDB, SES, S3)
-   Language: Typescript

## Architecture

![architecture](https://user-images.githubusercontent.com/11870835/111895421-7a531900-8a38-11eb-916a-a243d4f2eed3.jpg)

## AWS Resources

### AWS DynamoDB

DynamoDB is used as the Database to store our auctions.

### AWS S3

Simple Storage Service(S3) is used to store the auction images.

### AWS EventBridge

EventBridge is used as a scheduler which processes auctions in every 5 minutes(configurable).

### AWS SES

Simple Email Service(SES) is used to send the Mails to the users.

### AWS SQS

Simple Queue Service is used to store the Email messages and process it asynchrnously.

### Lambda Functions

Lambda functions contain the core logic of the App.

## Application Features

### Optimized Queries

The App uses DynamoDB indexing for querying the database.

### Pre-signed URL

The app uses pre-signed URL design pattern which helps in reducing the AWS Lambda function invocation time.

### Port-Adapter architecture

The app code is refactored to use the port-adapter architecture which helps to defend against vendor lock-in.
