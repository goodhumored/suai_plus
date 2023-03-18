import * as React from "react";
import { createRoot } from "react-dom/client";
import Settings from "./components/settings";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Settings />);
