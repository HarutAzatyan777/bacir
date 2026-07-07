import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar/Navbar";
import { LanguageProvider } from "./context/LanguageContext"; // Համոզվիր, որ ուղին ճիշտ է

const theme = {
  token: {
    colorPrimary: "#2c3e35", // Sage green
    colorLink: "#2c3e35",
    colorLinkHover: "#3d5a49",
    borderRadius: 8,
    fontFamily: "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
};

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <LanguageProvider>
          <Navbar />
          <AppRoutes />
        </LanguageProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;