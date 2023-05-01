import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import api from "./api";
import dataMocker from "./lib";

function App() {
  function doApiCallAndReturnData(){
    // instead of simply calling your api
    // return api.get("/");
    // wrape it up with this utility
    return dataMocker(() => {
      return api.get("/")
    }, {
      dynamicImport: () => import("./mockDataFiles/examplemock.json"),
      timeout: 3000,
    });
  }
  useEffect(() => {
    async function execute(){
      const response = await doApiCallAndReturnData();
      console.log(`this is the json response`,response)
    }
    execute();
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
