// ==========================================
// MOCK DATABASE - All data is dynamic
// ==========================================

const DB = {
    // Current logged-in user (simulated)
    currentUser: {
        id: "USR-001",
        name: "Sarah Chen",
        email: "sarah.chen@abo-group.com",
        role: "Admin",
        avatar: "SC",
        department: "Executive"
    },

    // Financial Management
    invoices: [
        { id: "INV-2024-001", vendor: "Apex Manufacturing", amount: 45200.00, currency: "USD", status: "Paid", dueDate: "2024-06-15", issueDate: "2024-05-15" },
        { id: "INV-2024-002", vendor: "Global Logistics Co", amount: 12800.50, currency: "USD", status: "Pending", dueDate: "2024-06-28", issueDate: "2024-05-28" },
        { id: "INV-2024-003", vendor: "TechSupply Inc", amount: 8900.00, currency: "USD", status: "Overdue", dueDate: "2024-06-01", issueDate: "2024-05-01" },
        { id: "INV-2024-004", vendor: "Office Essentials", amount: 2300.75, currency: "USD", status: "Paid", dueDate: "2024-06-10", issueDate: "2024-05-10" },
        { id: "INV-2024-005", vendor: "Prime Staffing", amount: 15600.00, currency: "USD", status: "Pending", dueDate: "2024-07-05", issueDate: "2024-06-05" }
    ],

    // Supply Chain & Inventory
    inventory: [
        { sku: "SKU-1001", name: "Industrial Bearings", category: "Components", stock: 1240, reorderLevel: 500, unitCost: 12.50, warehouse: "WH-A" },
        { sku: "SKU-1002", name: "Steel Plates 2mm", category: "Raw Material", stock: 320, reorderLevel: 400, unitCost: 45.00, warehouse: "WH-A" },
        { sku: "SKU-1003", name: "Hydraulic Fluid", category: "Consumables", stock: 890, reorderLevel: 200, unitCost: 8.75, warehouse: "WH-B" },
        { sku: "SKU-1004", name: "Safety Gloves", category: "Safety", stock: 45, reorderLevel: 100, unitCost: 3.20, warehouse: "WH-B" }
    ],

    // Procurement & Vendors
    vendors: [
        { id: "V-101", name: "Apex Manufacturing", category: "Components", rating: 4.8, status: "Active", contractEnd: "2025-03-15", spend: 452000 },
        { id: "V-102", name: "Global Logistics Co", category: "Logistics", rating: 4.2, status: "Active", contractEnd: "2024-12-01", spend: 128000 },
        { id: "V-103", name: "TechSupply Inc", category: "IT Hardware", rating: 3.9, status: "Under Review", contractEnd: "2024-08-20", spend: 89000 },
        { id: "V-104", name: "Prime Staffing", category: "Contingent Workforce", rating: 4.5, status: "Active", contractEnd: "2025-01-10", spend: 156000 }
    ],

    // Human Resources
    employees: [
        { id: "EMP-001", name: "Sarah Chen", role: "Admin", department: "Executive", status: "Active", joinDate: "2022-01-15" },
        { id: "EMP-002", name: "Marcus Johnson", role: "Editor", department: "Finance", status: "Active", joinDate: "2022-03-20" },
        { id: "EMP-003", name: "Elena Rodriguez", role: "Viewer", department: "Procurement", status: "Active", joinDate: "2023-05-10" },
        { id: "EMP-004", name: "David Kim", role: "Editor", department: "Operations", status: "Locked", joinDate: "2021-11-01" },
        { id: "EMP-005", name: "Aisha Patel", role: "Viewer", department: "HR", status: "Active", joinDate: "2023-08-22" }
    ],

    // CRM & Sales
    leads: [
        { id: "L-001", company: "Nexus Corp", contact: "James Wilson", value: 45000, stage: "Proposal", probability: 70 },
        { id: "L-002", company: "Stellar Dynamics", contact: "Maria Garcia", value: 120000, stage: "Negotiation", probability: 85 },
        { id: "L-003", company: "Quantum Systems", contact: "Robert Brown", value: 28000, stage: "Qualified", probability: 40 },
        { id: "L-004", company: "Beacon Industries", contact: "Linda Davis", value: 89000, stage: "Closed Won", probability: 100 }
    ],

    // Project Management
    projects: [
        { id: "PRJ-01", name: "ERP Migration Phase 2", status: "In Progress", progress: 68, budget: 250000, spent: 170000, deadline: "2024-09-30" },
        { id: "PRJ-02", name: "Warehouse Automation", status: "In Progress", progress: 35, budget: 180000, spent: 63000, deadline: "2024-11-15" },
        { id: "PRJ-03", name: "Supplier Portal Launch", status: "Completed", progress: 100, budget: 95000, spent: 92000, deadline: "2024-05-01" }
    ],

    // Audit Logs
    auditLogs: [
        { id: "LOG-001", user: "Sarah Chen", action: "Approved Invoice INV-2024-001", timestamp: "2024-06-12 09:45:22", type: "success" },
        { id: "LOG-002", user: "Marcus Johnson", action: "Updated Vendor V-103 status to Under Review", timestamp: "2024-06-12 09:30:10", type: "warning" },
        { id: "LOG-003", user: "System", action: "Failed login attempt for david.kim@abo-group.com", timestamp: "2024-06-12 08:15:45", type: "danger" },
        { id: "LOG-004", user: "Elena Rodriguez", action: "Created Purchase Order PO-2024-089", timestamp: "2024-06-12 07:55:33", type: "info" }
    ],

    // Chart Data (for real-time analytics)
    revenueChart: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [42000, 58000, 51000, 72000, 68000, 85000]
    },

    // Dashboard KPIs (computed dynamically)
    getKPIs: function() {
        const totalRevenue = this.invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
        const pendingInvoices = this.invoices.filter(i => i.status === "Pending").length;
        const overdueInvoices = this.invoices.filter(i => i.status === "Overdue").length;
        const activeProjects = this.projects.filter(p => p.status === "In Progress").length;
        const lowStockItems = this.inventory.filter(i => i.stock < i.reorderLevel).length;
        const activeEmployees = this.employees.filter(e => e.status === "Active").length;
        
        return {
            totalRevenue,
            pendingInvoices,
            overdueInvoices,
            activeProjects,
            lowStockItems,
            activeEmployees
        };
    }
};