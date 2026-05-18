import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    const handleLogin = (e) => {
        e.preventDefault();

        if (!id || !password) {
            setIsError(true);
        } else
        {
            alert('Đăng nhập thành công!')
            setIsError(false);
            navigate('/dashboard');
        }
    }
    return (
        <AuthLayout>
            <div className="max-w-md mx-auto w-full">
                {/* Tiêu đề */}
                <h2 className="text-3xl font-black text-[#9a7a3b] mb-8">Đăng nhập</h2>

                <form className="space-y-5" onSubmit={handleLogin} noValidate>
                    {/* Input ID */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1">ID</label>
                        <input
                            type="text"
                            placeholder="ID"
                            value={id}
                            onChange={(e) =>{
                                setId(e.target.value);
                                setIsError(false);
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e6d3a1] focus:ring-1 focus:ring-[#e6d3a1]"
                        />
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1">Mật Khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value = {password}
                                onChange={(e) =>{
                                    setPassword(e.target.value)
                                    setIsError(false);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e6d3a1] focus:ring-1 focus:ring-[#e6d3a1]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm mt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-[#e6d3a1] rounded border-gray-300 focus:ring-[#9a7a3b] cursor-pointer" />
                            <span className="font-medium text-gray-700">Remember me</span>
                        </label>
                    </div>

                        {isError && (
                            <span className="block mt-1 text-red-500 text-sm font-medium">Sai tài khoản hoặc mật khẩu</span>
                        )}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#9a7a3b] to-[#e6d3a1] hover:opacity-90 text-white font-bold py-3.5 rounded-2xl transition-colors duration-200 text-lg"
                    >
                        Đăng Nhập
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}