import "./assets/index.scss";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { TrackService } from "./services/TrackService";
import { App } from "./ui/App";

await TrackService.init();

const rootNode = document.getElementById("root") as HTMLDivElement;
const root = ReactDOM.createRoot(rootNode);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
