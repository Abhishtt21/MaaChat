import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import store from "./store";
import { createRoot } from 'react-dom/client';


const persistedStore = persistStore(store);

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
