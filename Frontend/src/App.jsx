import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from"./pages/Dashboard.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Tự động chuyển hướng về trang login khi mở app */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/orders" element={<ComingSoon />} />
            <Route path="/inventory" element={<ComingSoon />} />
            <Route path="/customers" element={<ComingSoon />} />
            <Route path="/reports" element={<ComingSoon />} />
            <Route path="/settings" element={<ComingSoon />} />
            <Route path="/support" element={<ComingSoon />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;