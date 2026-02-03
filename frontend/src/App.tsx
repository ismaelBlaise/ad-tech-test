import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/_layout";
import { ActiveTabProvider } from "./contexts/ActiveTabContext";
import DashboardPage from "./pages/DashboardPage";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import CampaignsPage from "./pages/CampaignPage";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";

function App() {
  return (
    <ActiveTabProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="detail" element={<CampaignDetail />}></Route>
              <Route path="create" element={<CreateCampaign />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="bottom-right"
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
      </QueryClientProvider>
    </ActiveTabProvider>
  );
}

export default App;
