/**
 * ROUTES — Centralized route path constants.
 *
 * Usage:
 *   import { ROUTES } from '../constants/routes';
 *   <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
 *   navigate(ROUTES.LOGIN);
 *
 * Rules:
 *   - Always reference ROUTES.X instead of hardcoding path strings.
 *   - When adding a new page, add its path here first.
 */

export const ROUTES = {
    // Auth
    LOGIN:            '/login',
    FORGOT_PASSWORD:  '/forgot-password',

    // Main app
    DASHBOARD:        '/dashboard',
    ORDERS:           '/orders',
    INVENTORY:        '/inventory',
    CUSTOMERS:        '/customers',
    REPORTS:          '/reports',
    SETTINGS:         '/settings',
    SUPPORT:          '/support',
};
