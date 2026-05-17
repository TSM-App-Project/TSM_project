import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
    const navigate = useNavigate();

    // Biến quản lý xem đang ở bước nào (1: Nhập Email, 2: Nhập OTP, 3: Đổi Mật Khẩu)
    const [step, setStep] = useState(1);

    // Các biến lưu trữ dữ liệu người dùng gõ
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Biến ẩn/hiện mật khẩu ở Bước 3
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ---- CÁC HÀM XỬ LÝ CHUYỂN BƯỚC ----
    const handleSendEmail = (e) => {
        e.preventDefault();
        if (email) setStep(2); // Có email thì cho qua bước 2
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        // Nối 6 số OTP lại kiểm tra, ở đây demo nên cho qua luôn
        setStep(3);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            alert('Đổi mật khẩu thành công!');
            navigate('/login');
        } else {
            alert('Mật khẩu xác nhận không khớp!');
        }
    };

    // Hàm hỗ trợ nhập OTP (Tự động nhảy sang ô tiếp theo)
    const handleChangeOTP = (element, index) => {
        if (isNaN(element.value)) return; // Chỉ cho nhập số
        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Tự động focus ô tiếp theo nếu có nhập
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md mx-auto w-full">

                {/* ======== BƯỚC 1: NHẬP EMAIL ======== */}
                {step === 1 && (
                    <form onSubmit={handleSendEmail} className="animate-fade-in">
                        <h2 className="text-3xl font-black text-[#9a7a3b] mb-2">Đặt lại mật khẩu của bạn</h2>
                        <p className="text-sm text-gray-500 mb-8">Vui lòng nhập địa chỉ email của bạn để chúng tôi có thể gửi mã xác minh.</p>

                        <div className="mb-6">
                            <label className="text-sm text-gray-500 block mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e6d3a1] focus:ring-1 focus:ring-[#e6d3a1]"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-[#9a7a3b] to-[#e6d3a1] hover:opacity-90 text-white font-bold py-3.5 rounded-2xl transition-colors duration-200 text-lg">
                            Gửi
                        </button>
                    </form>
                )}

                {/* ======== BƯỚC 2: NHẬP MÃ OTP ======== */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="animate-fade-in">
                        <h2 className="text-3xl font-black text-[#9a7a3b] mb-2">Nhập mã xác minh</h2>
                        <p className="text-sm text-gray-500 mb-8">Chúng tôi đã gửi mã xác minh về Email của bạn, mã sẽ hết hạn trong vòng 5 phút.</p>

                        <div className="flex justify-between gap-2 mb-8">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChangeOTP(e.target, index)}
                                    // Bắt sự kiện xóa (Backspace) để lùi ô
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
                                            e.target.previousSibling.focus();
                                        }
                                    }}
                                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:border-[#e6d3a1] focus:ring-1 focus:ring-[#e6d3a1]"
                                />
                            ))}
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-[#9a7a3b] to-[#e6d3a1] hover:opacity-90 text-white font-bold py-3.5 rounded-2xl transition-colors duration-200 text-lg">
                            Xác Nhận
                        </button>
                    </form>
                )}

                {/* ======== BƯỚC 3: ĐỔI MẬT KHẨU ======== */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="animate-fade-in space-y-5">
                        <h2 className="text-3xl font-black text-[#9a7a3b] mb-6">Đổi mật khẩu</h2>

                        {/* Nhập mật khẩu mới */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e6d3a1] focus:ring-1 focus:ring-[#e6d3a1]"
                                    required
                                />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu mới */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Xác nhận mật khẩu"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e6d3a1] focus:ring-1 focus:ring-[#e6d3a1]"
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-[#9a7a3b] to-[#e6d3a1] hover:opacity-90 text-white font-bold py-3.5 rounded-2xl transition-colors duration-200 text-lg mt-6">
                            Lưu
                        </button>
                    </form>
                )}

            </div>
        </AuthLayout>
    );
}