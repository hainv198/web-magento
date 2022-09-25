import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from "./Components/GlobalStyle";
import DataProvider from "./Redux/Store";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <DataProvider>
          <GlobalStyles>
              <App />
          </GlobalStyles>
      </DataProvider>
  </React.StrictMode>
);

