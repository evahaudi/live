import { useState } from "react";
import Iframe from 'react-iframe';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
// import Dashboard from "./scenes/dashboard";

import Contacts from "./scenes/contacts";
import Employee from "./scenes/table"; 


import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              {/* <Route path="/" element={<iframe src='http://127.0.0.1:5500/index.html' height="500" width="1250" title='popot' padding ="40px" />} />  */}
              <Route
  path="/"
  element={
    <div style={{ padding: "40px", marginTop:"0px"}}>
      <Iframe
        src="http://127.0.0.1:5500/index.html"
        height="700"
        width="1250"
        title="popoto"
        style={{ border: "none", borderRadius: "5px" }} // add custom styles
      />
    </div>
  }
/>
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/table" element={<Employee />} />
          
         
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
