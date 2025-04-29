# pool-math-simulator

Simulator of Balancer's Pool Maths.
Currently, it supports the simulation of "Stable Surge" pools and "ReClamm" pools.

## How to run locally

Use node 22 to run `client` and `functions`.
In the client folder:

1. run `npm install`
2. run `npm start`
3. done! No other config is required

In the functions folder:

1. create a .env file
2. inside the .env file, create the variable `ALCHEMY_API_KEY`
3. go to alchemy.com, create an account and create an API KEY
4. copy the API key and paste in the variable
5. run `npm install`
6. run `npm run serve`

The functions project is only required if you want to fetch data from ReClamm pools.

## How to Deploy

First, build the client: access the client folder and type `npm run build`
Then, in the root folder of the project, run `firebase deploy`. If you have the permission to deploy to the project, this will deploy both site and functions to firebase.
