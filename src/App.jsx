import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { LanguageProvider } from "./context/LanguageContext"; // Համոզվիր, որ ուղին ճիշտ է

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;