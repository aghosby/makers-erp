// Super Admin Menu Items
export const navbarData = [
    {
        routeLink: 'human-resources/dashboard',
        icon: 'bi bi-grid-fill',
        label: 'Dashboard'
    },
    {
        routeLink: '/dashboard',
        icon: 'bi bi-person-vcard-fill',
        label: 'Human Resources',
        subMenu: [
            {
                routeLink: 'human-resources/dashboard',
                icon: 'grid',
                label: 'Dashboard'
            },
            {
                routeLink: 'human-resources/employees',
                icon: 'users',
                label: 'Employees',
            },
            {
                routeLink: 'human-resources/absence-management',
                icon: 'alarm',
                label: 'Absence Management'
            },
            {
                routeLink: 'human-resources/payroll',
                icon: 'clipboard',
                label: 'Payroll',
            },
            {
                routeLink: 'human-resources/lms',
                icon: 'graduation',
                label: 'Learning Management',
            },
            {
                routeLink: 'human-resources/expense-management',
                icon: 'card',
                label: 'Expense Management',
            },
            {
                routeLink: 'human-resources/appraisals',
                icon: 'folderAi',
                label: 'Appraisal Management'
            },
            {
                routeLink: 'human-resources/calendar',
                icon: 'calendar',
                label: 'Calendar'
            },
            {
                routeLink: 'human-resources/notice-board',
                icon: 'newspaper',
                label: 'Notice Board'
            },
            {
                routeLink: 'human-resources/reports',
                icon: 'chartColumn',
                label: 'Reports & Analytics'
            },
            {
                routeLink: 'human-resources/hr-settings',
                icon: 'controls',
                label: 'HR Settings'
            },
        ]
    },
    {
        routeLink: 'settings',
        icon: 'bi bi-gear-fill',
        label: 'Settings',
        subMenu: [
            {
                routeLink: 'settings/general-settings',
                icon: 'bi bi-box-fill',
                label: 'General',
            },
            {
                routeLink: 'settings/human-resources-settings',
                icon: 'bi bi-people-fill',
                label: 'Human Resources',
            },
            {
                routeLink: 'accounting/accounting-settings',
                icon: 'bi bi-calculator-fill',
                label: 'Accounting'
            },
            {
                routeLink: 'settings/project-management',
                icon: 'bi bi-folder-fill',
                label: 'Projects'
            },
            {
                routeLink: 'settings/customer-relationship-management',
                icon: 'bi bi-microsoft-teams',
                label: 'CRM'
            },
            {
                routeLink: 'settings/supply-chain',
                icon: 'bi bi-ubuntu',
                label: 'Supply Chain'
            },
        ]
    }

]

// Employee Menu Items
export const navbarDataReg = [
    {
        routeLink: 'human-resources/dashboard',
        icon: 'grid',
        label: 'Dashboard'
    },
    {
        routeLink: 'human-resources/self-service/profile',
        icon: 'userCheck',
        label: 'Profile',
    },
    {
        routeLink: 'human-resources/self-service/absence-requests',
        icon: 'alarm',
        label: 'Absence Requests',
    },
    {
        routeLink: 'human-resources/self-service/payroll',
        icon: 'clipboard',
        label: 'Payroll',
    },
    {
        routeLink: 'human-resources/lms',
        icon: 'graduation',
        label: 'Learning Management',
    },
    {
        routeLink: 'human-resources/self-service/expense-requests',
        icon: 'card',
        label: 'Expense Requests',
    },
    {
        routeLink: 'human-resources/self-service/appraisals',
        icon: 'folderAi',
        label: 'Appraisal Requests',
    },
    {
        routeLink: 'human-resources/calendar',
        icon: 'calendar',
        label: 'Calendar'
    },
]

// HR Manager Menu Items
export const navbarDataManager = [
    {
        routeLink: 'human-resources/dashboard',
        icon: 'grid',
        label: 'Dashboard'
    },
    {
        routeLink: 'human-resources/self-service/profile',
        icon: 'userCheck',
        label: 'Profile',
    },
    {
        routeLink: 'human-resources/self-service/absence-requests',
        icon: 'alarm',
        label: 'Absence Requests',
    },
    {
        routeLink: 'human-resources/absence-management',
        icon: 'calendarTime',
        label: 'Absence Management'
    },
    {
        routeLink: 'human-resources/self-service/payroll',
        icon: 'clipboard',
        label: 'Payroll',
    },
    {
        routeLink: 'human-resources/lms',
        icon: 'graduation',
        label: 'Learning Management',
    },
    {
        routeLink: 'human-resources/self-service/expense-requests',
        icon: 'card',
        label: 'Expense Requests',
    },
    {
        routeLink: 'human-resources/expense-management',
        icon: 'cash',
        label: 'Expense Management',
    },
    {
        routeLink: 'human-resources/self-service/appraisals',
        icon: 'stars',
        label: 'Appraisal Requests',
    },
    {
        routeLink: 'human-resources/appraisals',
        icon: 'folderAi',
        label: 'Appraisal Management',
    },
    {
        routeLink: 'human-resources/calendar',
        icon: 'calendar',
        label: 'Calendar'
    }
]

// AceErp Admin Menu Items
export const navbarDataAceErp = [
    {
        routeLink: 'aceerp/dashboard',
        icon: 'grid',
        label: 'Dashboard'
    },
    {
        routeLink: 'aceerp/companies',
        icon: 'users',
        label: 'Companies'
    },
    {
        routeLink: 'aceerp/modules',
        icon: 'layer',
        label: 'AceErp Modules'
    },
    {
        routeLink: 'aceerp/subscriptions',
        icon: 'folderAi',
        label: 'Subscriptions'
    },
    {
        routeLink: 'aceerp/invoices',
        icon: 'card',
        label: 'Invoices'
    },
    {
        routeLink: 'aceerp/reports',
        icon: 'clipboard',
        label: 'Reports'
    },
]

// Order Management Menu Items
export const navbarDataOrders = [
    {
        routeLink: 'orders/dashboard',
        icon: 'grid',
        label: 'Dashboard'
    },
    {
        routeLink: 'orders/purchase-orders',
        icon: 'cart',
        label: 'Purchase Orders'
    },
    {
        routeLink: 'orders/customers',
        icon: 'users',
        label: 'Customers'
    },
    {
        routeLink: 'orders/products',
        icon: 'box',
        label: 'Products'
    },
    {
        routeLink: 'orders/vendors',
        icon: 'building',
        label: 'Vendors'
    },
    {
        routeLink: 'orders/couriers',
        icon: 'truckFast',
        label: 'Logistics'
    },
    {
        routeLink: 'orders/invoices',
        icon: 'card',
        label: 'Invoices'
    },
    {
        routeLink: 'orders/sales-agents',
        icon: 'user',
        label: 'Sales Agents'
    },
    {
        routeLink: 'orders/messages',
        icon: 'commentSquare',
        label: 'Messages'
    },
    {
        routeLink: 'orders/reports',
        icon: 'clipboard',
        label: 'Reports'
    },
    {
        routeLink: 'orders/orders-settings',
        icon: 'controls',
        label: 'Order Settings'
    }
]

// Accounting Module Menu Items
export const navbarDataAccounting = [
    {
        routeLink: 'accounting/dashboard',
        icon: 'grid',
        label: 'Dashboard'
    },
    {
        routeLink: 'accounting/chart-of-accounts',
        icon: 'layer',
        label: 'Chart of Accounts'
    },
    {
        routeLink: 'accounting/general-ledger',
        icon: 'register',
        label: 'General Ledger'
    },
    {
        routeLink: 'accounting/journal-entries',
        icon: 'newspaper',
        label: 'Journal Entries'
    },
    {
        routeLink: 'accounting/invoices',
        icon: 'card',
        label: 'Invoices'
    },
    {
        routeLink: 'accounting/bills',
        icon: 'cash',
        label: 'Bills & Expenses'
    },
    {
        routeLink: 'accounting/vendors',
        icon: 'building',
        label: 'Vendors'
    },
    {
        routeLink: 'accounting/reports',
        icon: 'chartColumn',
        label: 'Financial Reports'
    },
    {
        routeLink: 'accounting/accounting-settings',
        icon: 'controls',
        label: 'Accounting Settings'
    },
]

export interface INavbarData {
    routeLink: string;
    icon?: string;
    label: string;
    permission?: boolean;
}