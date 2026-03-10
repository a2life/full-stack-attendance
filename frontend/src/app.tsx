import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import NewEventSheet from "./pages/NewEventSheet";
import PastSheets from "./pages/PastSheets";
import SheetDetail from "./pages/SheetDetail";
import ManageMembers from "./pages/ManageMembers";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewEventSheet />} />
          <Route path="/sheets" element={<PastSheets />} />
          <Route path="/sheets/:id" element={<SheetDetail />} />
          <Route path="/members" element={<ManageMembers />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
