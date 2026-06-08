/**
 * Giải mã chuỗi JWT token để lấy thông tin Payload mà không cần dùng thư viện ngoài
 */
export const decodeToken = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
    }
};

/**
 * Tiện ích lấy ra role từ token hiện tại (ở localStorage hoặc sessionStorage)
 */
export const getUserRole = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;
    
    const decoded = decodeToken(token);
    return decoded ? decoded.role : null;
};

/**
 * Tiện ích lấy ra họ tên từ token
 */
export const getUserFullName = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;
    
    const decoded = decodeToken(token);
    return decoded ? decoded.fullName : null;
};
