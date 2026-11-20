import "./assets/index.scss";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { TrackService } from "./services/TrackService";
import { App } from "./ui/App";

const rootNode = document.getElementById("root") as HTMLDivElement;
const root = ReactDOM.createRoot(rootNode);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Initialize after rendering: the App shows only its header until a storage type is set.
// Never block rendering on browser storage APIs, which may hang or fail on some devices.
TrackService.init().catch((e) => window.console.error(e));
