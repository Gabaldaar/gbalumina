import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { SettingsProvider } from "./context/SettingsContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CurrencyProvider>
          <HashRouter>
            <AppRoutes />
            <Toaster 
              position="top-center" 
              toastOptions={{ 
                style: { fontFamily: 'Inter', fontSize: '14px', borderRadius: '8px', color: '#374151' },
                success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
                error: { iconTheme: { primary: '#EF4444', secondary: 'white' } }
              }} 
            />
          </HashRouter>
        </CurrencyProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
