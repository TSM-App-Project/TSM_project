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
                <h2 className="text-3xl font-black text-primary-container mb-8">Đăng nhập</h2>

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
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
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
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
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
                            <div className="relative w-4 h-4">
                                {/* 1. Input ẩn phủ kín */}
                                <input
                                    type="checkbox"
                                    className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                />
                                <div className="w-full h-full border border-gray-300 rounded bg-surface-bright peer-checked:bg-[#10b981] peer-checked:border-[#10b981] transition-colors"></div>
                                {/* 3. Dấu tick SVG màu trắng*/}
                                <svg
                                    className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-700">Remember me</span>
                        </label>
                    </div>

                    {isError && (
                        <span className="block mt-1 text-red-500 text-sm font-medium">Sai tài khoản hoặc mật khẩu</span>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-primary-container hover:opacity-90 text-white font-bold py-3.5 rounded-2xl transition-colors duration-200 text-lg"
                    >
                        Đăng Nhập
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}