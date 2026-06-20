import React from "react"; //główna biblioteka React, która umożliwia tworzenie komponentów i zarządzanie stanem aplikacji.
import ReactDOM from "react-dom/client"; //biblioteka ReactDOM, która umożliwia renderowanie komponentów React do DOM (Document Object Model) w przeglądarce. 
import "./styles/index.css"; //styl
import App from "./App"; //importuje główny komponent App z pliku App.js, który jest głównym komponentem aplikacji. Ten komponent będzie renderowany do DOM.

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);