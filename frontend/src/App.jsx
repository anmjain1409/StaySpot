import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandlordForm from "./pages/LandlordForm";
import LandlordStatus from "./pages/LandlordStatus";
import LandlordApproval from "./pages/LandlordApproval";
import AddProperty from "./pages/AddProperty";
import AdminDashboard from "./pages/AdminDashboard";
import Properties from "./pages/Properties";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/landlord-form" element={<LandlordForm />} />
        <Route path="/landlord-status" element={<LandlordStatus />} />
        <Route path="/landlord-approval" element={<LandlordApproval />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;