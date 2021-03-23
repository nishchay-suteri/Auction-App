# Auction App

A basic Auction App that uses AWS Lambda and serverless framework.

## Functionality of the appication

This Application will allow creating/deleting/updating/fetching Auction Items. Each user can bid to any of the Auctions posted. Only Authenticated user can post and bid for auctions.

## Technologies used

-   Serverless framwork
-   AWS Lambda Functions

## How to run the application

### Backend

Go through the [README.md](https://github.com/nishchay-suteri/Auction-App/blob/master/backend/README.md) provided inside backend folder for details.
To deploy an application run the following commands:

```cd backend
npm install
sls deploy -v
```

### Frontend

Go through the [README.md](https://github.com/nishchay-suteri/Auction-App/blob/master/client/README.md) provided inside client folder for details.
To run the Application:-

```cd client
npm install
npm start
```

## Using the Application

-   The command `npm start` will automatically launch the application at localhost.
-   The first page will automatically redirect to the Auth0 Authenticaiton page. Just sign-in using Google.
-   After sign-in, the home page of the application will be visible.
-   Homepage will contain the auctions for which you can bid.
-   You can create your own Auction by clicking the "+" button at down right.

### Bidding on Auctions

-   You can only bid on other's auctions. You can't bid on your own auction.
-   You can't bid if you are already the highest Bidder.

### Creating Auctions

-   You can only create auctions when you are signed in.
-   Once auction is created, it **_can take at max 5 seconds to display on the homepage_**. - **_TODO_**

### Closing the Auctions and Notifying

-   The Auction will be closed automatically after 1 hour of creation.
-   The closing of auction to **_update on database can take at max 5 minutes_**. This is done **_to reduce the lambda function calls._**
-   Once auction is closed, the seller and highest bidder will be notified through E-mail. **_NOTE_**: Currently, AWS only supports sending the email whose email address is verified at developer's AWS account. So, You might not get the notification.

## Current Limitations

-   Once auction is created, there is no way to update or delete the auction.
-   Even after closing the auction after 1 hour, we can still bid on it for upto maximum of 5 minutes.
-   Notification via E-mail is not supported for all users.
