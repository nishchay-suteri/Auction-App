## The Auction House

This front-end application For Auction Service. Default Template is taken from [Auction House Front-end](https://github.com/codingly-io/sls-course-frontend).

## Cloning and installing

Clone the repository and go to client folder

```
git clone https://github.com/nishchay-suteri/Auction-App.git
cd client
```

Install the NPM dependencies for this project.

```
npm install
```

## Setting up variables

Create a `.env` file in the root folder of this project. You need to specify two variables:

-   `REACT_APP_REFRESH_RATE`: The rate at which auctions will be fetched (in milliseconds).

-   `REACT_APP_AUCTIONS_ENDPOINT`: Your Auction Service API endpoint.

-   `REACT_APP_AUTH0_DOMAIN`: Your Auth0 application domain.

-   `REACT_APP_AUTH0_CLIENT_ID`: Your Auth0 application client ID.

## Running the application

You can run the application by typing in:

```
npm start
```

The application should now be running at [http://localhost:3000](http://localhost:3000).
