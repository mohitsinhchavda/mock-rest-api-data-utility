export default function dataMocker(
  func,
  { dynamicImport, timeout = 30000, isMockForce, noDataResponse = false, errorResponse = false }
) {
  /**
      @param func It is a callback which should be returning Promise i.e. () => api.get("/someAPI")
      @param Object with below parameters
             @param dynamicImport => a dynamically imported reference
             i.e.
             // x must exist at top level of file just after other imports of the file from where
             // you would be calling this function
             const x = {
                 y : () => import("/somePath")
             }
             // now, x becomes your dynamicImport
             @param timeout => timeout after which promise would be resolved, defaults to 3000
             @param isMockForce => This value will ignore REACT_APP_IS_MOCK variable
             @param noDataResponse => bool. If true, returns Promise which will return {status: true, data: []} when using mock response
             @param errorResponse => bool. If true, returns Promise which will return {status: false} when using mock response
      @returns promise
    */
   console.log(process.env.REACT_APP_IS_MOCK, `process.env.REACT_APP_IS_MOCK`)
  if (isMockForce !== undefined ? isMockForce : process.env.REACT_APP_IS_MOCK === "true") {
    if (noDataResponse) {
      return Promise.resolve({
        status: true,
        data: [],
      });
    }
    if (errorResponse) {
      return Promise.resolve({
        status: false,
      });
    }
    return dynamicImport()
      .then((res) => {
        const json = res;
        return new Promise((resolve) => {
          setTimeout(() => {
            const response = {
              status: true,
              data: JSON.parse(JSON.stringify(json))?.default,
            };
            return resolve(response);
          }, timeout);
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "test") {
          console.error("MOCK DATA IMPORT ERROR:", error);
          return errorPromiseResolveCb();
        }
      });
  } else {
    return Promise.resolve(func());
  }
}

function errorPromiseResolveCb() {
  return new Promise((resolve) => {
    return resolve({
      status: false,
    });
  });
}
