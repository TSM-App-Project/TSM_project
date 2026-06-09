import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang đã có
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Master from "./pages/Master.jsx";
import Services from "./pages/Services.jsx";
import Customers from "./pages/Customers.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import Products from "./pages/Products.jsx";
import Inventory from "./pages/Inventory.jsx";
import Trading from "./pages/Trading.jsx";
import { getUserRole } from './utils/auth';

const ProtectedRoute = ({ element, roles }) => {
    const role = getUserRole();
    if (!role) {
        return <Navigate to="/login" replace />;
    }
    if (roles && !roles.includes(role)) {
        if (role === 'NHAN_VIEN') return <Navigate to="/trading" replace />;
        return <Navigate to="/dashboard" replace />;
    }
    return element;
};
function App() {
    return (
        <HashRouter>
            <Routes>
                {/* Các route cơ bản */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} roles={['ADMIN', 'QUAN_LY', 'KE_TOAN']} />} />

                {/* Các route bảo trì/chưa làm */}
                <Route path="/settings" element={<ComingSoon />} />
                <Route path="/support" element={<ComingSoon />} />

                {/* Các route mới cho chức năng phần mềm */}
                <Route path="/master" element={<ProtectedRoute element={<Master />} roles={['ADMIN']} />} />
                <Route path="/products" element={<ProtectedRoute element={<Products />} roles={['ADMIN', 'QUAN_LY', 'NHAN_VIEN']} />} />
                <Route path="/trading" element={<ProtectedRoute element={<Trading />} roles={['ADMIN', 'QUAN_LY', 'KE_TOAN', 'NHAN_VIEN']} />} />
                <Route path="/services" element={<ProtectedRoute element={<Services />} roles={['ADMIN', 'QUAN_LY', 'KE_TOAN', 'NHAN_VIEN']} />} />
                <Route path="/suppliers" element={<ProtectedRoute element={<Suppliers />} roles={['ADMIN', 'QUAN_LY', 'KE_TOAN']} />} />
                <Route path="/customers" element={<ProtectedRoute element={<Customers />} roles={['ADMIN', 'QUAN_LY', 'KE_TOAN']} />} />
                <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} roles={['ADMIN', 'QUAN_LY', 'NHAN_VIEN']} />} />

                {/* Tự động chuyển hướng về trang login khi nhập sai URL (LUÔN ĐỂ CUỐI CÙNG) */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </HashRouter>
    );
}

export default App;