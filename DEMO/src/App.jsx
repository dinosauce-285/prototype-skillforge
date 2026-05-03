import { BrowserRouter } from "react-router-dom";
import { AppStateProvider } from "./state/AppState";
import { AppRouter } from "./app/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <AppRouter />
      </AppStateProvider>
    </BrowserRouter>
  );
}
