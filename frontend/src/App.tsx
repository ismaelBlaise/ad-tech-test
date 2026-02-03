import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/_layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
