import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/_layout";
import { ActiveTabProvider } from "./contexts/ActiveTabContext";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <ActiveTabProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage></DashboardPage>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ActiveTabProvider>
  );
}

export default App;
