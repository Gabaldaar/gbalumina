import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { SettingsProvider } from "./context/SettingsContext";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CurrencyProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
