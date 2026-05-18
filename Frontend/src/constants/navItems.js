/**
 * NAV_ITEMS — Sidebar navigation data arrays.
 *
 * Usage:
 *   import { NAV_MAIN, NAV_OTHER } from '../constants/navItems';
 *   NAV_MAIN.map(item => <NavLink key={item.to} {...item} />)
 *
 * Each item shape:
 *   {
 *     to:    string   — route path (from ROUTES)
 *     icon:  string   — Material Symbols icon name
 *     label: string   — display text in sidebar
 *     fill:  boolean  — whether icon uses filled variant (active state)
 *   }
 *
 * Rules:
 *   - To add a new sidebar link, add one object here.
 *   - Do NOT hardcode nav items directly in Sidebar.jsx.
 */

import { ROUTES } from './routes';

export const NAV_MAIN = [
    { to: ROUTES.DASHBOARD, icon: 'dashboard',      label: 'Dashboard',           fill: true  },
    { to: ROUTES.ORDERS,    icon: 'shopping_cart',  label: 'Orders',              fill: false },
    { to: ROUTES.INVENTORY, icon: 'inventory_2',    label: 'Inventory',           fill: false },
    { to: ROUTES.CUSTOMERS, icon: 'group',          label: 'Customers',           fill: false },
    { to: ROUTES.REPORTS,   icon: 'bar_chart',      label: 'Reports & Analytics', fill: false },
];

export const NAV_OTHER = [
    { to: ROUTES.SETTINGS, icon: 'settings', label: 'Settings',     fill: false },
    { to: ROUTES.SUPPORT,  icon: 'help',     label: 'Help/Support', fill: false },
];
