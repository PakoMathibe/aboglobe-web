// ============================================================
// ABO ENTERPRISE ERP - COMPLETE MOCK DATABASE
// ============================================================

const ERP = {
    currentUser: {
        id: "USR-001",
        name: "Sarah Chen",
        role: "Admin",
        department: "Executive",
        avatar: "SC",
        email: "sarah.chen@abo-group.com",
        phone: "+1-555-0100",
        title: "Chief Operating Officer",
        location: "Chicago, IL",
        bio: "Seasoned operations executive leading ABO's global expansion and enterprise technology initiatives.",
        joined: "2022-01-15",
        permissions: ["all"]
    },

    generalLedger: [
        { id: "GL-1001", account: "1000 - Cash", type: "Asset", debit: 245000, credit: 0, balance: 245000 },
        { id: "GL-1002", account: "1200 - Accounts Receivable", type: "Asset", debit: 89000, credit: 0, balance: 89000 },
        { id: "GL-1003", account: "1300 - Inventory", type: "Asset", debit: 156000, credit: 0, balance: 156000 },
        { id: "GL-2001", account: "2000 - Accounts Payable", type: "Liability", debit: 0, credit: 67500, balance: 67500 },
        { id: "GL-2002", account: "2100 - Accrued Liabilities", type: "Liability", debit: 0, credit: 23400, balance: 23400 },
        { id: "GL-3001", account: "3000 - Retained Earnings", type: "Equity", debit: 0, credit: 150000, balance: 150000 },
        { id: "GL-4001", account: "4000 - Revenue", type: "Income", debit: 0, credit: 420000, balance: 420000 },
        { id: "GL-5001", account: "5000 - Cost of Goods Sold", type: "Expense", debit: 178000, credit: 0, balance: 178000 }
    ],

    accountsPayable: [
        { id: "AP-001", vendor: "Apex Manufacturing", invoice: "INV-2024-001", amount: 45200, dueDate: "2024-06-15", status: "Paid" },
        { id: "AP-002", vendor: "Global Logistics Co", invoice: "INV-2024-002", amount: 12800, dueDate: "2024-06-28", status: "Pending" },
        { id: "AP-003", vendor: "TechSupply Inc", invoice: "INV-2024-003", amount: 8900, dueDate: "2024-06-01", status: "Overdue" },
        { id: "AP-004", vendor: "Office Essentials", invoice: "INV-2024-004", amount: 2300, dueDate: "2024-06-10", status: "Paid" },
        { id: "AP-005", vendor: "Prime Staffing", invoice: "INV-2024-005", amount: 15600, dueDate: "2024-07-05", status: "Pending" }
    ],

    accountsReceivable: [
        { id: "AR-001", customer: "Nexus Corp", invoice: "INV-S-101", amount: 45000, dueDate: "2024-06-20", status: "Pending" },
        { id: "AR-002", customer: "Stellar Dynamics", invoice: "INV-S-102", amount: 120000, dueDate: "2024-06-10", status: "Paid" },
        { id: "AR-003", customer: "Quantum Systems", invoice: "INV-S-103", amount: 28000, dueDate: "2024-05-30", status: "Overdue" },
        { id: "AR-004", customer: "Beacon Industries", invoice: "INV-S-104", amount: 89000, dueDate: "2024-06-25", status: "Paid" }
    ],

    budgets: [
        { id: "BUD-01", department: "Finance", allocated: 250000, spent: 170000, period: "Q2 2024" },
        { id: "BUD-02", department: "Operations", allocated: 180000, spent: 63000, period: "Q2 2024" },
        { id: "BUD-03", department: "HR", allocated: 95000, spent: 92000, period: "Q2 2024" },
        { id: "BUD-04", department: "Sales", allocated: 300000, spent: 210000, period: "Q2 2024" },
        { id: "BUD-05", department: "IT", allocated: 150000, spent: 88000, period: "Q2 2024" }
    ],

    cashFlow: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        inflow: [45000, 62000, 58000, 75000, 71000, 88000],
        outflow: [32000, 41000, 38000, 52000, 48000, 55000]
    },

    inventory: [
        { sku: "SKU-1001", name: "Industrial Bearings", category: "Components", stock: 1240, reorder: 500, unitCost: 12.50, warehouse: "WH-A" },
        { sku: "SKU-1002", name: "Steel Plates 2mm", category: "Raw Material", stock: 320, reorder: 400, unitCost: 45.00, warehouse: "WH-A" },
        { sku: "SKU-1003", name: "Hydraulic Fluid", category: "Consumables", stock: 890, reorder: 200, unitCost: 8.75, warehouse: "WH-B" },
        { sku: "SKU-1004", name: "Safety Gloves", category: "Safety", stock: 45, reorder: 100, unitCost: 3.20, warehouse: "WH-B" },
        { sku: "SKU-1005", name: "Copper Wire 12AWG", category: "Raw Material", stock: 2100, reorder: 800, unitCost: 6.40, warehouse: "WH-C" },
        { sku: "SKU-1006", name: "Hydraulic Valves", category: "Components", stock: 180, reorder: 250, unitCost: 28.00, warehouse: "WH-A" }
    ],

    warehouses: [
        { id: "WH-A", name: "Central Warehouse", location: "Chicago, IL", capacity: 85, utilization: 85 },
        { id: "WH-B", name: "East Coast Hub", location: "Newark, NJ", capacity: 60, utilization: 60 },
        { id: "WH-C", name: "West Coast Facility", location: "Los Angeles, CA", capacity: 92, utilization: 92 }
    ],

    purchaseOrders: [
        { id: "PO-2024-089", vendor: "Apex Manufacturing", items: 12, total: 34500, status: "Approved", date: "2024-06-10" },
        { id: "PO-2024-090", vendor: "TechSupply Inc", items: 5, total: 8900, status: "Pending Approval", date: "2024-06-12" },
        { id: "PO-2024-091", vendor: "Global Logistics Co", items: 3, total: 4200, status: "Shipped", date: "2024-06-08" },
        { id: "PO-2024-092", vendor: "Apex Manufacturing", items: 8, total: 18700, status: "Pending Approval", date: "2024-06-14" }
    ],

    vendors: [
        { id: "V-101", name: "Apex Manufacturing", category: "Components", rating: 4.8, status: "Active", contractStart: "2023-03-15", contractEnd: "2025-03-15", spend: 452000, onTimeDelivery: 98, complaints: 2 },
        { id: "V-102", name: "Global Logistics Co", category: "Logistics", rating: 4.2, status: "Active", contractStart: "2022-12-01", contractEnd: "2024-12-01", spend: 128000, onTimeDelivery: 92, complaints: 5 },
        { id: "V-103", name: "TechSupply Inc", category: "IT Hardware", rating: 3.9, status: "Under Review", contractStart: "2023-08-20", contractEnd: "2024-08-20", spend: 89000, onTimeDelivery: 85, complaints: 8 },
        { id: "V-104", name: "Prime Staffing", category: "Contingent Workforce", rating: 4.5, status: "Active", contractStart: "2023-01-10", contractEnd: "2025-01-10", spend: 156000, onTimeDelivery: 95, complaints: 3 },
        { id: "V-105", name: "Office Essentials", category: "Supplies", rating: 4.0, status: "Active", contractStart: "2023-06-01", contractEnd: "2025-06-01", spend: 34000, onTimeDelivery: 90, complaints: 1 }
    ],

    contracts: [
        { id: "CTR-01", vendor: "Apex Manufacturing", type: "Supply Agreement", start: "2023-03-15", end: "2025-03-15", value: 500000, status: "Active", renewalAlert: false },
        { id: "CTR-02", vendor: "TechSupply Inc", type: "SLA", start: "2023-08-20", end: "2024-08-20", value: 120000, status: "Expiring Soon", renewalAlert: true },
        { id: "CTR-03", vendor: "Prime Staffing", type: "Staffing Contract", start: "2023-01-10", end: "2025-01-10", value: 200000, status: "Active", renewalAlert: false },
        { id: "CTR-04", vendor: "Global Logistics Co", type: "Logistics SLA", start: "2022-12-01", end: "2024-12-01", value: 150000, status: "Active", renewalAlert: false }
    ],

    contingentWorkforce: [
        { id: "CW-01", name: "James Miller", agency: "Prime Staffing", role: "Welder", rate: 45, hours: 160, status: "Active" },
        { id: "CW-02", name: "Lisa Park", agency: "Prime Staffing", role: "QA Inspector", rate: 52, hours: 120, status: "Active" },
        { id: "CW-03", name: "Tom Bradley", agency: "Apex Talent", role: "Electrician", rate: 60, hours: 80, status: "Completed" },
        { id: "CW-04", name: "Nina Rodriguez", agency: "Prime Staffing", role: "Forklift Operator", rate: 38, hours: 140, status: "Active" }
    ],

    billOfMaterials: [
        { id: "BOM-001", product: "Industrial Bearing Assembly", components: 8, cost: 125.50, leadTime: "5 days" },
        { id: "BOM-002", product: "Hydraulic Pump Unit", components: 14, cost: 340.00, leadTime: "10 days" },
        { id: "BOM-003", product: "Control Panel v2", components: 22, cost: 890.00, leadTime: "15 days" }
    ],

    productionSchedule: [
        { id: "PS-001", product: "Bearing Assembly", quantity: 500, start: "2024-06-15", end: "2024-06-20", status: "In Progress", line: "Line A" },
        { id: "PS-002", product: "Hydraulic Pump", quantity: 120, start: "2024-06-18", end: "2024-06-28", status: "Scheduled", line: "Line B" },
        { id: "PS-003", product: "Control Panel", quantity: 50, start: "2024-06-10", end: "2024-06-25", status: "In Progress", line: "Line C" }
    ],

    qualityControl: [
        { id: "QC-01", batch: "BATCH-2024-0612", product: "Bearing Assembly", inspected: 500, passed: 492, failed: 8, passRate: 98.4 },
        { id: "QC-02", batch: "BATCH-2024-0611", product: "Control Panel", inspected: 50, passed: 48, failed: 2, passRate: 96.0 },
        { id: "QC-03", batch: "BATCH-2024-0610", product: "Hydraulic Pump", inspected: 120, passed: 118, failed: 2, passRate: 98.3 }
    ],

    employees: [
        { id: "EMP-001", name: "Sarah Chen", role: "Admin", department: "Executive", status: "Active", joinDate: "2022-01-15", salary: 185000, email: "sarah.chen@abo.com" },
        { id: "EMP-002", name: "Marcus Johnson", role: "Finance Manager", department: "Finance", status: "Active", joinDate: "2022-03-20", salary: 125000, email: "marcus.j@abo.com" },
        { id: "EMP-003", name: "Elena Rodriguez", role: "Procurement Lead", department: "Procurement", status: "Active", joinDate: "2023-05-10", salary: 98000, email: "elena.r@abo.com" },
        { id: "EMP-004", name: "David Kim", role: "Operations Manager", department: "Operations", status: "Locked", joinDate: "2021-11-01", salary: 110000, email: "david.k@abo.com" },
        { id: "EMP-005", name: "Aisha Patel", role: "HR Specialist", department: "HR", status: "Active", joinDate: "2023-08-22", salary: 78000, email: "aisha.p@abo.com" },
        { id: "EMP-006", name: "Liam O'Brien", role: "Sales Rep", department: "Sales", status: "Active", joinDate: "2023-02-14", salary: 72000, email: "liam.o@abo.com" }
    ],

    payroll: [
        { id: "PAY-06-24", employee: "Sarah Chen", gross: 15416, deductions: 4200, net: 11216, status: "Paid", period: "June 2024" },
        { id: "PAY-06-24", employee: "Marcus Johnson", gross: 10416, deductions: 2800, net: 7616, status: "Paid", period: "June 2024" },
        { id: "PAY-06-24", employee: "Elena Rodriguez", gross: 8166, deductions: 2100, net: 6066, status: "Pending", period: "June 2024" },
        { id: "PAY-06-24", employee: "Aisha Patel", gross: 6500, deductions: 1600, net: 4900, status: "Pending", period: "June 2024" },
        { id: "PAY-06-24", employee: "Liam O'Brien", gross: 6000, deductions: 1400, net: 4600, status: "Pending", period: "June 2024" }
    ],

    attendance: [
        { employee: "Sarah Chen", present: 22, absent: 0, leave: 0, overtime: 5 },
        { employee: "Marcus Johnson", present: 20, absent: 1, leave: 1, overtime: 12 },
        { employee: "Elena Rodriguez", present: 21, absent: 0, leave: 1, overtime: 8 },
        { employee: "David Kim", present: 18, absent: 3, leave: 1, overtime: 0 },
        { employee: "Aisha Patel", present: 22, absent: 0, leave: 0, overtime: 2 }
    ],

    recruitment: [
        { id: "REC-01", position: "Senior Accountant", department: "Finance", candidates: 24, shortlisted: 5, interviews: 3, status: "Open" },
        { id: "REC-02", position: "Warehouse Supervisor", department: "Operations", candidates: 18, shortlisted: 4, interviews: 2, status: "Open" },
        { id: "REC-03", position: "Software Engineer", department: "IT", candidates: 42, shortlisted: 8, interviews: 6, status: "Closed" }
    ],

    performanceReviews: [
        { employee: "Sarah Chen", period: "Q2 2024", score: 4.8, goalsMet: 95, reviewer: "CEO" },
        { employee: "Marcus Johnson", period: "Q2 2024", score: 4.5, goalsMet: 90, reviewer: "Sarah Chen" },
        { employee: "Elena Rodriguez", period: "Q2 2024", score: 4.2, goalsMet: 85, reviewer: "Marcus Johnson" },
        { employee: "Aisha Patel", period: "Q2 2024", score: 4.7, goalsMet: 92, reviewer: "Sarah Chen" }
    ],

    training: [
        { id: "TRN-01", program: "Financial Compliance", employee: "Marcus Johnson", progress: 75, status: "In Progress", dueDate: "2024-07-15" },
        { id: "TRN-02", program: "Supply Chain Optimization", employee: "Elena Rodriguez", progress: 100, status: "Completed", dueDate: "2024-05-30" },
        { id: "TRN-03", program: "Leadership Essentials", employee: "Sarah Chen", progress: 40, status: "In Progress", dueDate: "2024-08-20" }
    ],

    crmContacts: [
        { id: "C-001", name: "James Wilson", company: "Nexus Corp", email: "j.wilson@nexus.com", phone: "+1-555-0101", status: "Active", lastContact: "2024-06-10" },
        { id: "C-002", name: "Maria Garcia", company: "Stellar Dynamics", email: "m.garcia@stellar.com", phone: "+1-555-0102", status: "Active", lastContact: "2024-06-08" },
        { id: "C-003", name: "Robert Brown", company: "Quantum Systems", email: "r.brown@quantum.com", phone: "+1-555-0103", status: "Inactive", lastContact: "2024-04-15" },
        { id: "C-004", name: "Linda Davis", company: "Beacon Industries", email: "l.davis@beacon.com", phone: "+1-555-0104", status: "Active", lastContact: "2024-06-12" }
    ],

    crmLeads: [
        { id: "L-001", company: "Nexus Corp", contact: "James Wilson", value: 45000, stage: "Proposal", probability: 70, assignedTo: "Marcus J.", source: "Web Form" },
        { id: "L-002", company: "Stellar Dynamics", contact: "Maria Garcia", value: 120000, stage: "Negotiation", probability: 85, assignedTo: "Sarah C.", source: "Referral" },
        { id: "L-003", company: "Quantum Systems", contact: "Robert Brown", value: 28000, stage: "Qualified", probability: 40, assignedTo: "Elena R.", source: "Cold Call" },
        { id: "L-004", company: "Beacon Industries", contact: "Linda Davis", value: 89000, stage: "Closed Won", probability: 100, assignedTo: "Marcus J.", source: "Web Form" }
    ],

    crmTasks: [
        { id: "T-001", title: "Follow up with Nexus Corp", assignedTo: "Marcus J.", dueDate: "2024-06-15", priority: "High", status: "Pending" },
        { id: "T-002", title: "Prepare proposal for Stellar Dynamics", assignedTo: "Sarah C.", dueDate: "2024-06-18", priority: "High", status: "In Progress" },
        { id: "T-003", title: "Schedule demo with Quantum Systems", assignedTo: "Elena R.", dueDate: "2024-06-20", priority: "Medium", status: "Pending" }
    ],

    projects: [
        { id: "PRJ-01", name: "ERP Migration Phase 2", status: "In Progress", progress: 68, budget: 250000, spent: 170000, deadline: "2024-09-30", manager: "Sarah Chen" },
        { id: "PRJ-02", name: "Warehouse Automation", status: "In Progress", progress: 35, budget: 180000, spent: 63000, deadline: "2024-11-15", manager: "David Kim" },
        { id: "PRJ-03", name: "Supplier Portal Launch", status: "Completed", progress: 100, budget: 95000, spent: 92000, deadline: "2024-05-01", manager: "Elena Rodriguez" }
    ],

    milestones: [
        { id: "MS-01", project: "ERP Migration Phase 2", title: "Data Migration Complete", dueDate: "2024-07-15", status: "In Progress" },
        { id: "MS-02", project: "ERP Migration Phase 2", title: "UAT Sign-off", dueDate: "2024-08-30", status: "Pending" },
        { id: "MS-03", project: "Warehouse Automation", title: "Robotics Installation", dueDate: "2024-09-01", status: "Pending" },
        { id: "MS-04", project: "Supplier Portal Launch", title: "Go-Live", dueDate: "2024-05-01", status: "Completed" }
    ],

    kanbanBoards: [
        {
            id: 'board-projects', name: 'Project Pipeline',
            columns: ['Backlog', 'In Progress', 'Review', 'Done'],
            cards: [
                { id: 'c-001', title: 'Migrate user data to new schema', column: 'In Progress', assignee: 'Sarah Chen', priority: 'High', dueDate: '2024-07-15', tags: ['backend', 'migration'] },
                { id: 'c-002', title: 'Design supplier portal UI', column: 'Review', assignee: 'Marcus Johnson', priority: 'Medium', dueDate: '2024-07-10', tags: ['design', 'frontend'] },
                { id: 'c-003', title: 'Write UAT test cases', column: 'Backlog', assignee: 'Elena Rodriguez', priority: 'Low', dueDate: '2024-08-01', tags: ['qa'] },
                { id: 'c-004', title: 'Set up warehouse robots', column: 'In Progress', assignee: 'David Kim', priority: 'High', dueDate: '2024-09-01', tags: ['hardware', 'ops'] },
                { id: 'c-005', title: 'Configure SSO integration', column: 'Done', assignee: 'Sarah Chen', priority: 'High', dueDate: '2024-06-01', tags: ['security'] },
                { id: 'c-006', title: 'Draft vendor SLA template', column: 'Review', assignee: 'Elena Rodriguez', priority: 'Medium', dueDate: '2024-07-20', tags: ['legal'] },
                { id: 'c-007', title: 'Update onboarding docs', column: 'Backlog', assignee: 'Aisha Patel', priority: 'Low', dueDate: '2024-08-15', tags: ['docs'] },
                { id: 'c-008', title: 'Deploy staging environment', column: 'Done', assignee: 'Marcus Johnson', priority: 'High', dueDate: '2024-06-10', tags: ['devops'] }
            ]
        },
        {
            id: 'board-recruitment', name: 'Recruitment Pipeline',
            columns: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
            cards: [
                { id: 'r-001', title: 'Senior Accountant – J. Smith', column: 'Interview', assignee: 'Aisha Patel', priority: 'High', dueDate: '2024-07-12', tags: ['finance'] },
                { id: 'r-002', title: 'Warehouse Supervisor – M. Lee', column: 'Screening', assignee: 'Aisha Patel', priority: 'Medium', dueDate: '2024-07-18', tags: ['ops'] },
                { id: 'r-003', title: 'Software Engineer – K. Brown', column: 'Offer', assignee: 'Sarah Chen', priority: 'High', dueDate: '2024-07-08', tags: ['engineering'] },
                { id: 'r-004', title: 'Sales Rep – L. Wilson', column: 'Applied', assignee: 'Marcus Johnson', priority: 'Low', dueDate: '2024-07-25', tags: ['sales'] },
                { id: 'r-005', title: 'Analyst – P. Kumar', column: 'Hired', assignee: 'Aisha Patel', priority: 'Medium', dueDate: '2024-06-15', tags: ['analytics'] }
            ]
        }
    ],
    activeBoardId: 'board-projects',

    automations: [
        { id: "AUTO-01", name: "Invoice Matching", description: "Auto-match incoming invoices to purchase orders and flag discrepancies.", trigger: "New Invoice", status: "Active", runsLast30Days: 245, successRate: 99.2 },
        { id: "AUTO-02", name: "Payment Reminders", description: "Send automated email reminders for invoices approaching or past due.", trigger: "Overdue Invoice", status: "Active", runsLast30Days: 89, successRate: 100 },
        { id: "AUTO-03", name: "Inventory Reordering", description: "Automatically create purchase orders when stock falls below threshold.", trigger: "Low Stock Alert", status: "Active", runsLast30Days: 34, successRate: 97.1 },
        { id: "AUTO-04", name: "Payroll Processing", description: "Calculate and process monthly payroll, taxes, and deductions.", trigger: "Monthly Schedule", status: "Active", runsLast30Days: 1, successRate: 100 },
        { id: "AUTO-05", name: "Vendor Compliance Check", description: "Validate vendor tax documents and contract renewals weekly.", trigger: "Weekly Schedule", status: "Active", runsLast30Days: 4, successRate: 100 }
    ],

    auditLogs: [
        { id: "LOG-001", user: "Sarah Chen", action: "Approved Purchase Order PO-2024-089", timestamp: "2024-06-12 09:45:22", type: "success", module: "Procurement" },
        { id: "LOG-002", user: "Marcus Johnson", action: "Updated Vendor V-103 to Under Review", timestamp: "2024-06-12 09:30:10", type: "warning", module: "Procurement" },
        { id: "LOG-003", user: "System", action: "Failed login attempt for david.kim@abo.com", timestamp: "2024-06-12 08:15:45", type: "danger", module: "Security" },
        { id: "LOG-004", user: "Elena Rodriguez", action: "Created PO-2024-091", timestamp: "2024-06-12 07:55:33", type: "info", module: "Procurement" },
        { id: "LOG-005", user: "Sarah Chen", action: "Updated payroll record for Elena Rodriguez", timestamp: "2024-06-11 16:20:10", type: "info", module: "HR" },
        { id: "LOG-006", user: "System", action: "Automation AUTO-01 ran successfully (245 invoices matched)", timestamp: "2024-06-11 14:00:00", type: "success", module: "Automation" },
        { id: "LOG-007", user: "Aisha Patel", action: "Approved leave request for David Kim", timestamp: "2024-06-11 11:10:05", type: "success", module: "HR" },
        { id: "LOG-008", user: "Liam O'Brien", action: "Converted lead L-004 to closed-won deal", timestamp: "2024-06-11 10:05:00", type: "success", module: "Sales" }
    ],

    users: [
        { id: "USR-001", name: "Sarah Chen", email: "sarah.chen@abo.com", role: "Admin", status: "Active", mfa: "Yes" },
        { id: "USR-002", name: "Marcus Johnson", email: "marcus.j@abo.com", role: "Editor", status: "Active", mfa: "Yes" },
        { id: "USR-003", name: "Elena Rodriguez", email: "elena.r@abo.com", role: "Editor", status: "Active", mfa: "No" },
        { id: "USR-004", name: "David Kim", email: "david.k@abo.com", role: "Viewer", status: "Suspended", mfa: "Yes" },
        { id: "USR-005", name: "Aisha Patel", email: "aisha.p@abo.com", role: "HR", status: "Active", mfa: "Yes" },
        { id: "USR-006", name: "Liam O'Brien", email: "liam.o@abo.com", role: "Finance", status: "Active", mfa: "No" }
    ],

    notifications: [
        { id: 1, text: "PO-2024-092 pending your approval", time: "5 min ago", unread: true, type: "warning" },
        { id: 2, text: "Contract CTR-02 expires in 30 days", time: "1 hour ago", unread: true, type: "danger" },
        { id: 3, text: "Payroll for June 2024 ready to process", time: "2 hours ago", unread: true, type: "info" },
        { id: 4, text: "Inventory SKU-1004 below reorder level", time: "3 hours ago", unread: true, type: "danger" }
    ],

    // ============================================================
    // CHAT / MESSAGING
    // ============================================================
    activeChannelId: 'general',
    chatChannels: [
        { id: 'general', name: 'general', icon: '#', unread: 0 },
        { id: 'finance', name: 'finance-team', icon: '#', unread: 2 },
        { id: 'ops', name: 'operations', icon: '#', unread: 0 },
        { id: 'hr-private', name: 'hr-private', icon: '🔒', unread: 0 },
        { id: 'dm-sarah', name: 'Sarah Chen (you)', icon: '@', unread: 0 },
        { id: 'dm-marcus', name: 'Marcus Johnson', icon: '@', unread: 1 }
    ],
    chatMessages: [
        { id: 'm1', channelId: 'general', author: 'Marcus Johnson', avatar: 'MJ', text: 'Good morning team! Q2 close is looking strong.', time: '09:12', self: false },
        { id: 'm2', channelId: 'general', author: 'Elena Rodriguez', avatar: 'ER', text: 'PO-2024-092 is pending your approval @Sarah', time: '09:14', self: false },
        { id: 'm3', channelId: 'general', author: 'Sarah Chen', avatar: 'SC', text: 'On it. Reviewing now.', time: '09:15', self: true },
        { id: 'm4', channelId: 'finance', author: 'Marcus Johnson', avatar: 'MJ', text: 'Can we push the AP run to Friday?', time: '09:30', self: false },
        { id: 'm5', channelId: 'finance', author: 'Sarah Chen', avatar: 'SC', text: 'Approved. Friday works.', time: '09:32', self: true },
        { id: 'm6', channelId: 'dm-marcus', author: 'Marcus Johnson', avatar: 'MJ', text: 'Do you have the Q2 forecast spreadsheet?', time: '10:01', self: false }
    ],

    // ============================================================
    // DOCUMENTS
    // ============================================================
    documents: [
        { id: 'DOC-001', title: 'Master Service Agreement - Apex', type: 'Contract', owner: 'Elena Rodriguez', shared: 'Company', created: '2024-05-01', lastEdited: '2024-06-10', editedBy: 'Elena Rodriguez', body: 'This Master Service Agreement ("Agreement") is entered into as of May 1, 2024 by and between ABO International Group and Apex Manufacturing.\n\n1. SCOPE OF SERVICES\nApex shall provide precision components as specified in Exhibit A.\n\n2. TERM\nInitial term of 24 months, auto-renewing unless terminated with 60 days notice.\n\n3. PRICING\nAs per Schedule B. Net 30 payment terms.' },
        { id: 'DOC-002', title: 'Q2 2024 Financial Report', type: 'Report', owner: 'Marcus Johnson', shared: 'Company', created: '2024-06-01', lastEdited: '2024-06-12', editedBy: 'Marcus Johnson', body: 'EXECUTIVE SUMMARY\n\nRevenue for Q2 2024 reached $420,000, up 18% year-over-year. Gross margin held steady at 42%.\n\nKEY HIGHLIGHTS\n- AR collections improved by 22%\n- AP cycle reduced from 35 to 28 days\n- Inventory turnover up 8%' },
        { id: 'DOC-003', title: 'Employee Handbook 2024', type: 'Policy', owner: 'Aisha Patel', shared: 'Company', created: '2024-01-15', lastEdited: '2024-03-22', editedBy: 'Aisha Patel', body: 'SECTION 1: WELCOME\nWelcome to ABO International Group. This handbook outlines our policies...\n\nSECTION 2: CODE OF CONDUCT\nAll employees are expected to maintain the highest ethical standards...\n\nSECTION 3: BENEFITS\nHealth, dental, vision, 401k matching up to 5%.' },
        { id: 'DOC-004', title: 'Supplier Onboarding Checklist', type: 'Document', owner: 'Elena Rodriguez', shared: 'Team', created: '2024-04-10', lastEdited: '2024-05-20', editedBy: 'Elena Rodriguez', body: 'SUPPLIER ONBOARDING\n\n☐ W-9 / tax documents\n☐ Certificate of insurance\n☐ Signed NDA\n☐ Banking details verification\n☐ References (2 minimum)\n☐ Compliance questionnaire\n☐ Onboarding call scheduled' }
    ],

    // ============================================================
    // EMAIL
    // ============================================================
    emails: [
        { id: 'EM-001', from: 'marcus.j@abo.com', fromName: 'Marcus Johnson', to: 'sarah.chen@abo.com', subject: 'Q2 Board Deck - Draft for Review', body: 'Hi Sarah,\n\nAttached is the Q2 board deck. Key points:\n- Revenue up 18% YoY\n- Margin held at 42%\n- AP/AR cycles improved\n\nPlease review by EOD Friday.\n\nBest,\nMarcus', date: '2024-06-12T09:15:00', folder: 'Inbox', read: false, starred: true },
        { id: 'EM-002', from: 'elena.r@abo.com', fromName: 'Elena Rodriguez', to: 'sarah.chen@abo.com', subject: 'URGENT: TechSupply contract renewal', body: 'Sarah,\n\nTechSupply SLA (CTR-02) expires Aug 20. They are requesting a 15% price increase for renewal.\n\nI recommend we either renegotiate or move to a backup supplier. Please advise.\n\nElena', date: '2024-06-12T08:42:00', folder: 'Inbox', read: false, starred: true },
        { id: 'EM-003', from: 'aisha.p@abo.com', fromName: 'Aisha Patel', to: 'sarah.chen@abo.com', subject: 'New hire onboarding - K. Brown', body: 'Hi Sarah,\n\nK. Brown accepted the offer for Senior Software Engineer. Start date: July 8.\n\nPlease approve the equipment budget ($4,200).\n\nThanks,\nAisha', date: '2024-06-11T16:30:00', folder: 'Inbox', read: true, starred: false },
        { id: 'EM-004', from: 'system@abo.com', fromName: 'ABO System', to: 'sarah.chen@abo.com', subject: 'Weekly security digest', body: 'Weekly Security Summary\n- 3 failed login attempts blocked\n- 0 critical vulnerabilities\n- 14 automations ran successfully\n- 2 contract renewals flagged', date: '2024-06-11T06:00:00', folder: 'Inbox', read: true, starred: false },
        { id: 'EM-005', from: 'sarah.chen@abo.com', fromName: 'Sarah Chen', to: 'marcus.j@abo.com', subject: 'Re: Q2 Board Deck', body: 'Marcus - approved, looks great. Just fix slide 7 chart colors.\n\nSarah', date: '2024-06-12T10:20:00', folder: 'Sent', read: true, starred: false }
    ],

    // ============================================================
    // CALENDAR
    // ============================================================
    calendarEvents: [
        { id: 'EV-001', title: 'Weekly Leadership Sync', date: '2024-06-17', time: '09:00', type: 'Meeting', attendees: 'Sarah Chen, Marcus Johnson, Elena Rodriguez', description: 'Weekly ops review' },
        { id: 'EV-002', title: 'Q2 Board Deck Due', date: '2024-06-14', time: '17:00', type: 'Deadline', attendees: 'Marcus Johnson', description: 'Submit final version' },
        { id: 'EV-003', title: 'TechSupply SLA Renewal', date: '2024-06-20', time: '14:00', type: 'Meeting', attendees: 'Elena Rodriguez, TechSupply rep', description: 'Renegotiate terms' },
        { id: 'EV-004', title: 'Q2 Close', date: '2024-06-30', time: '18:00', type: 'Deadline', attendees: 'Finance team', description: 'Close books for Q2' },
        { id: 'EV-005', title: 'Company All-Hands', date: '2024-06-21', time: '15:00', type: 'Meeting', attendees: 'All employees', description: 'Q2 recap and Q3 kickoff' }
    ],

    // ============================================================
    // WORKFLOW / APPROVALS
    // ============================================================
    workflowRequests: [
        { id: 'WF-001', type: 'Purchase Order', reference: 'PO-2024-092', requester: 'Elena Rodriguez', amount: 18700, status: 'Pending', submittedAt: '2024-06-14 09:20', description: 'Apex Manufacturing - additional components' },
        { id: 'WF-002', type: 'Leave Request', reference: 'LV-0045', requester: 'David Kim', amount: null, status: 'Pending', submittedAt: '2024-06-13 16:45', description: 'Vacation July 8-12 (5 days)' },
        { id: 'WF-003', type: 'Expense Claim', reference: 'EXP-089', requester: 'Liam O\'Brien', amount: 1240, status: 'Approved', submittedAt: '2024-06-10 11:00', description: 'Client dinner - Nexus Corp' },
        { id: 'WF-004', type: 'Contract Renewal', reference: 'CTR-02', requester: 'Elena Rodriguez', amount: 120000, status: 'Pending', submittedAt: '2024-06-12 10:15', description: 'TechSupply SLA renewal at +15%' }
    ],

    // ============================================================
    // SETTINGS
    // ============================================================
    settings: {
        companyName: 'ABO International Group',
        email: 'admin@abo-group.com',
        phone: '+1-555-0100',
        currency: 'USD',
        timezone: 'America/Chicago',
        fiscalYearStart: 'January',
        taxRate: '8.5',
        invoicePrefix: 'INV-2024-',
        mfaRequired: 'Yes',
        sessionTimeout: '30',
        autoBackup: 'Daily'
    },

    // ============================================================
    // COMPUTED HELPERS
    // ============================================================
    getKPIs: function () {
        return {
            totalRevenue: this.accountsReceivable.filter(a => a.status === 'Paid').reduce((s, a) => s + a.amount, 0),
            pendingInvoices: this.accountsPayable.filter(a => a.status === 'Pending').length,
            overdueInvoices: this.accountsPayable.filter(a => a.status === 'Overdue').length,
            activeProjects: this.projects.filter(p => p.status === 'In Progress').length,
            lowStockItems: this.inventory.filter(i => i.stock < i.reorder).length,
            activeEmployees: this.employees.filter(e => e.status === 'Active').length,
            automationRuns: this.automations.reduce((s, a) => s + a.runsLast30Days, 0),
            totalPayable: this.accountsPayable.reduce((s, a) => s + a.amount, 0),
            totalReceivable: this.accountsReceivable.reduce((s, a) => s + a.amount, 0),
            totalVendorSpend: this.vendors.reduce((s, v) => s + v.spend, 0),
            totalInventoryValue: this.inventory.reduce((s, i) => s + (i.stock * i.unitCost), 0),
            totalAnnualPayroll: this.employees.reduce((s, e) => s + e.salary, 0)
        };
    }
};

window.ERP = ERP;