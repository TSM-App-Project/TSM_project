
export default function AuthLayout({ children }) {
    return (
        // Nền tối ngoài cùng
        <div className="min-h-screen bg-[#242424] flex items-center justify-center p-6">

            {/* Khung chính chứa giao diện */}
            <div className="w-full max-w-[1000px] bg-primary-container h-[600px] flex overflow-hidden rounded-2xl shadow-2xl relative">

                {/* Nửa bên trái: Màu xanh */}
                <div className="w-1/2 hidden md:block">
                    {/* Nơi này để trống, hoặc sau này nhúng hình nền/logo */}
                </div>

                {/* Nửa bên phải: Form màu trắng, có bo góc đè lên phần xanh */}
                <div className="w-full md:w-1/2 bg-white rounded-l-2xl p-12 flex flex-col justify-center shadow-[-20px_0_30px_-10px_rgba(0,0,0,0.15)] z-10">
                    {children}
                </div>

            </div>
        </div>
    );
}