// ============================================================
// FORM CONFIGS
// ============================================================

const FormConfigs = {
    employees: {
        entity: 'employees', store: 'employees', label: 'Employee',
        idKey: 'id', generateId: () => `EMP-${String(Date.now()).slice(-4)}`,
        fields: [
            { name: 'name', label: 'Full Name', required: true },
            { name: 'email', label: 'Email', required: true },
            { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'Finance Manager', 'Procurement Lead', 'Operations Manager', 'HR Specialist', 'Sales Rep', 'Analyst'] },
            { name: 'department', label: 'Department', type: 'select', options: ['Executive', 'Finance', 'Procurement', 'Operations', 'HR', 'Sales', 'IT'] },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Locked', 'Inactive'], default: 'Active' },
            { name: 'joinDate', label: 'Join Date', type: 'date', default: new Date().toISOString().split('T')[0] },
            { name: 'salary', label: 'Annual Salary', type: 'number', required: true }
        ]
    },
    vendors: {
        entity: 'vendors', store: 'vendors', label: 'Vendor',
        idKey: 'id', generateId: () => `V-${Math.floor(100 + Math.random() * 900)}`,
        fields: [
            { name: 'name', label: 'Vendor Name', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Components', 'Logistics', 'IT Hardware', 'Contingent Workforce', 'Supplies', 'Raw Material'] },
            { name: 'rating', label: 'Rating (0-5)', type: 'number', default: 4.0 },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Under Review', 'Inactive'], default: 'Active' },
            { name: 'contractStart', label: 'Contract Start', type: 'date' },
            { name: 'contractEnd', label: 'Contract End', type: 'date' },
            { name: 'spend', label: 'Total Spend', type: 'number', default: 0 },
            { name: 'onTimeDelivery', label: 'On-Time Delivery %', type: 'number', default: 95 },
            { name: 'complaints', label: 'Complaints', type: 'number', default: 0 }
        ]
    },
    inventory: {
        entity: 'inventory', store: 'inventory', label: 'Inventory Item',
        idKey: 'sku', generateId: () => `SKU-${String(Date.now()).slice(-6)}`,
        fields: [
            { name: 'name', label: 'Product Name', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Components', 'Raw Material', 'Consumables', 'Safety'] },
            { name: 'stock', label: 'Current Stock', type: 'number', required: true, default: 0 },
            { name: 'reorder', label: 'Reorder Level', type: 'number', required: true, default: 100 },
            { name: 'unitCost', label: 'Unit Cost', type: 'number', required: true, default: 0 },
            { name: 'warehouse', label: 'Warehouse', type: 'select', options: ['WH-A', 'WH-B', 'WH-C'] }
        ]
    },
    purchaseOrders: {
        entity: 'purchaseOrders', store: 'purchaseOrders', label: 'Purchase Order',
        idKey: 'id', generateId: () => `PO-2024-${String(Math.floor(100 + Math.random() * 900))}`,
        fields: [
            { name: 'vendor', label: 'Vendor', required: true },
            { name: 'items', label: 'Items Count', type: 'number', default: 1 },
            { name: 'total', label: 'Total Amount', type: 'number', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Pending Approval', 'Approved', 'Shipped', 'Received'], default: 'Pending Approval' },
            { name: 'date', label: 'Order Date', type: 'date', default: new Date().toISOString().split('T')[0] }
        ]
    },
    accountsPayable: {
        entity: 'accountsPayable', store: 'accountsPayable', label: 'AP Invoice',
        idKey: 'id', generateId: () => `AP-${String(Date.now()).slice(-4)}`,
        fields: [
            { name: 'vendor', label: 'Vendor', required: true },
            { name: 'invoice', label: 'Invoice #', required: true },
            { name: 'amount', label: 'Amount', type: 'number', required: true },
            { name: 'dueDate', label: 'Due Date', type: 'date' },
            { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Overdue', 'Cancelled'], default: 'Pending' }
        ]
    },
    accountsReceivable: {
        entity: 'accountsReceivable', store: 'accountsReceivable', label: 'AR Invoice',
        idKey: 'id', generateId: () => `AR-${String(Date.now()).slice(-4)}`,
        fields: [
            { name: 'customer', label: 'Customer', required: true },
            { name: 'invoice', label: 'Invoice #', required: true },
            { name: 'amount', label: 'Amount', type: 'number', required: true },
            { name: 'dueDate', label: 'Due Date', type: 'date' },
            { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Overdue'], default: 'Pending' }
        ]
    },
    crmLeads: {
        entity: 'crmLeads', store: 'crmLeads', label: 'Lead',
        idKey: 'id', generateId: () => `L-${String(Date.now()).slice(-4)}`,
        fields: [
            { name: 'company', label: 'Company', required: true },
            { name: 'contact', label: 'Contact Name', required: true },
            { name: 'value', label: 'Deal Value', type: 'number', required: true },
            { name: 'stage', label: 'Stage', type: 'select', options: ['Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] },
            { name: 'probability', label: 'Probability %', type: 'number', default: 50 },
            { name: 'assignedTo', label: 'Assigned To', required: true },
            { name: 'source', label: 'Source', type: 'select', options: ['Web Form', 'Referral', 'Cold Call', 'Event'] }
        ]
    },
    projects: {
        entity: 'projects', store: 'projects', label: 'Project',
        idKey: 'id', generateId: () => `PRJ-${String(Date.now()).slice(-3)}`,
        fields: [
            { name: 'name', label: 'Project Name', required: true },
            { name: 'manager', label: 'Project Manager', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['In Progress', 'Completed', 'On Hold', 'Cancelled'] },
            { name: 'progress', label: 'Progress %', type: 'number', default: 0 },
            { name: 'budget', label: 'Budget', type: 'number', required: true },
            { name: 'spent', label: 'Spent', type: 'number', default: 0 },
            { name: 'deadline', label: 'Deadline', type: 'date' }
        ]
    },
    contracts: {
        entity: 'contracts', store: 'contracts', label: 'Contract',
        idKey: 'id', generateId: () => `CTR-${String(Date.now()).slice(-3)}`,
        fields: [
            { name: 'vendor', label: 'Vendor', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['Supply Agreement', 'SLA', 'Staffing Contract', 'Logistics SLA', 'NDA'] },
            { name: 'start', label: 'Start Date', type: 'date' },
            { name: 'end', label: 'End Date', type: 'date' },
            { name: 'value', label: 'Value', type: 'number' },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Expiring Soon', 'Expired'], default: 'Active' }
        ]
    },
    crmTasks: {
        entity: 'crmTasks', store: 'crmTasks', label: 'Task',
        idKey: 'id', generateId: () => `T-${String(Date.now()).slice(-4)}`,
        fields: [
            { name: 'title', label: 'Task Title', required: true },
            { name: 'assignedTo', label: 'Assigned To', required: true },
            { name: 'dueDate', label: 'Due Date', type: 'date' },
            { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
            { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed'] }
        ]
    },
    users: {
        entity: 'users', store: 'users', label: 'User',
        idKey: 'id', generateId: () => `USR-${String(Date.now()).slice(-4)}`,
        fields: [
            { name: 'name', label: 'Full Name', required: true },
            { name: 'email', label: 'Email', required: true },
            { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'Editor', 'Viewer', 'Finance', 'HR'] },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Suspended', 'Invited'], default: 'Invited' },
            { name: 'mfa', label: 'MFA Enabled', type: 'select', options: ['Yes', 'No'], default: 'Yes' }
        ]
    }
};