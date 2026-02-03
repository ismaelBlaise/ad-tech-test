import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/_layout";
import { ActiveTabProvider } from "./contexts/ActiveTabContext";
import DashboardPage from "./pages/DashboardPage";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import CampaignsPage from "./pages/CampaignPage";
import CampaignDetail from "./pages/CampaignDetail";

function App() {
  return (
    <ActiveTabProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="detail" element={<CampaignDetail />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ActiveTabProvider>
  );
}

export default App;
