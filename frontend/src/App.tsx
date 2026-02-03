import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/_layout";
import { ActiveTabProvider } from "./contexts/ActiveTabContext";

function App() {
  return (
    <ActiveTabProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}></Route>
        </Routes>
      </BrowserRouter>
    </ActiveTabProvider>
  );
}

export default App;
