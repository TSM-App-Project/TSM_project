/**
 * AUTH MOCK DATA — Fake session and credentials for UI development.
 *
 * Purpose:
 *   Simulates a logged-in user and valid credentials while the backend
 *   is not yet available. Replace with real API responses in Phase 3
 *   (authService.js) when the backend is ready.
 *
 * Rules:
 *   - Do NOT import this file directly into page components.
 *   - This will be consumed exclusively by authService.js.
 *   - Do NOT store real credentials here.
 */

/**
 * Fake user session object.
 * Mirrors the shape of the real user object the backend will return.
 */
export const MOCK_USER = {
    id:        'admin_001',
    name:      'Nguyễn Quản Lý',
    email:     'admin@tsm.vn',
    role:      'admin',         // 'admin' | 'staff' | 'viewer'
    avatarUrl: null,            // null triggers initials-based avatar fallback
    phone:     '0901 234 567',
    createdAt: '2024-01-15',
};

/**
 * Fake credentials accepted during mock login.
 * The login form checks against these values when USE_MOCK = true.
 */
export const MOCK_CREDENTIALS = {
    id:       'admin',
    password: '123456',
};

/**
 * Fake JWT token string.
 * Used to simulate an authenticated session in localStorage.
 */
export const MOCK_TOKEN = 'mock-jwt-token-tsm-2025';
