import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Modal from "./components/Modal.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Modal />
    <App />
  </StrictMode>
);
