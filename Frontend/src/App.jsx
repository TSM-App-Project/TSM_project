import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang đã có
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Master from "./pages/Master.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Các route cơ bản */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Các route bảo trì/chưa làm */}
                <Route path="/settings" element={<ComingSoon />} />
                <Route path="/support" element={<ComingSoon />} />

                {/* Các route mới cho chức năng phần mềm */}
                <Route path="/master" element={<Master />} />
                <Route path="/products" element={<ComingSoon />} />
                <Route path="/trading" element={<ComingSoon />} />
                <Route path="/services" element={<ComingSoon />} />
                <Route path="/suppliers" element={<ComingSoon />} />
                <Route path="/customers" element={<ComingSoon />} />
                <Route path="/inventory" element={<ComingSoon />} />

                {/* Tự động chuyển hướng về trang login khi nhập sai URL (LUÔN ĐỂ CUỐI CÙNG) */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;