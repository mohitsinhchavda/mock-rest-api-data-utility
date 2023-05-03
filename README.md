# Why this package?

Sometimes, it is hard to mock data from your frontend app. You literally have to write unit test
to do so. (And then you have to make sure, unit tests are also proper written).
Let us be honest here and acknowledge, not all projects have that "time luxury" to do so.

Moreover, you also want to test how your feature works with diff type of api response scenarios
like no data response (204), error response (4xx & 5xx). And, while doing this you want to
manage things centrally within the app without affecting when you deploy it on any environment.

Now, imagine someone gives this solution and you don't have to worry about removing or changing the mock data files and their
setup when you go production!! Yes, this is how awesome, simple and almost no-size this package is
without literally any 3rd party dependency.
Original Size:	917 bytes gzipped (2.41KB uncompressed)
Compiled Size:	517 bytes gzipped (1.1KB uncompressed)

So, here I am, with new npm package, which lets you do it centrally, with options.

# Key takeaways
- mock data easily with almost zero config (without worrying about how your app behaves in diff envs)
- test how your UI behaves with no data responses from APIs
- test how your UI behaves with error response from APIs
- No dependency and almost zero size (as it is just simple js function with 30 lines of code with no import of anything)

The package uses REACT_APP_IS_MOCK variable to enable mocking everywhere across app WHERE, this library is used.
Also there is a manual override for a particular api calls with "isMockForce" option.

# Installation and Usage

```
yarn add --save-dev mock-rest-api-data-utility
```

OR

```
npm i mock-rest-api-data-utility --dev
```

Add REACT_APP_IS_MOCK value as true in your environment variable file
(If in any environment, you don't want to use the package, make it "false" or just simply not add it in that environment file
or remove it)

Now, If you are doing this in your api caller

```js
function doApiCallAndReturnData() {
  return api.get("/");
}

// Then you must be using this function somewhere
doApiCallAndReturnData();
```

Then start doing this:

```js
import dataMocker from "mock-rest-api-data-utility";

function doApiCallAndReturnData() {
  return dataMocker(() => api.get("/"), {
    dynamicImport: () => import("./path/to/yourmockdata.json"),
    // dont worry about path and json data file existence in production
    // you can avoid inclusion for json file completely and it won't
    // affect the app at a;;
  });
}

// continue using your function like before
doApiCallAndReturnData();
```

# API

Now, this function would accept 2 arguments.
1st one is, a function which would run if REACT_APP_IS_MOCK env variable is false OR "isMockForce" is false
2nd one is, an object which consists of keys mentioned below

`dynamicImport` (a js import callback e.g. () => import("/path/mockdata/file.json") and if file doesn't exist, your app won't break and would throw an error under console with proper warning message) defaults to undefined

`timeout` (before promise resolves with mock data, so that you can test how your app actually look while loading and then resolving with data) defaults to 3 seconds

`noDataResponse` (How your app would look if your api resolves with no data {also after loading}) defaults to false

`errorResponse` (How your app would look if your api resolves with an error {also after loading}) defaults to false

`isMockForce` (Manually override REACT_APP_IS_MOCK variable's value for this particular call)
