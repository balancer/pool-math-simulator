# pool-math-simulator

Simulator of Balancer's Pool Maths.
Currently, it supports the simulation of "Stable Surge" pools and "AutoRange" pools.

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

The functions project is only required if you want to fetch data from AutoRange pools.

## How to Deploy

Pushes to `main` deploy the `stableSurgeData` and `reclammData` functions through GitHub Actions. The workflow reads the Alchemy API key from the `ALCHEMY_API_KEY` repository secret, checks that it works on every network, and writes it to `functions/.env.aclamm` for the deploy. Git ignores that file and the deploy does not upload it, but the key ends up as a plain environment variable on the functions, visible to anyone who can view the Firebase project. To change the key, update the repository secret and rerun the workflow.

To deploy by hand, put the key in `functions/.env.aclamm`, then build the client: access the client folder and type `npm run build`
Then, in the root folder of the project, run `firebase deploy`. If you have the permission to deploy to the project, this will deploy both site and functions to firebase.
