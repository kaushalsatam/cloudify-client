import { useState } from "react";
import Login from "./pages/Login.tsx";
import UploadFileToServer from "./pages/UploadFileToServer.tsx";
import { TOKEN_STORAGE_KEY } from "./lib/api";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  const handleLogin = (newToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  return (
    token ? <UploadFileToServer onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
  );
}

export default App;
