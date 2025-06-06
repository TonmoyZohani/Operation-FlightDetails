import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import store from "./utils/store";

import { Provider } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
  </React.StrictMode>
);
