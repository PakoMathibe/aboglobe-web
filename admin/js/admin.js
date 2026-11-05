// ==========================================
// ADMIN DASHBOARD LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Elements ----
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    // ---- Initialize User Profile ----
    function initUserProfile() {
        const user = DB.currentUser;
        const initials = user.name.split(' ').map(n => n[0]).join('');
        
        document.getElementById('sidebarUserName').textContent = user.name;
        document.getElementById('sidebarUserRole').textContent = user.role;
        document.getElementById('sidebarUserInitials').textContent = initials;
        document.getElementById('topUserInitials').textContent = initials;
    }

    // ---- Format Helpers ----
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    function getBadgeClass(status) {
        const map = {
            'Paid': 'badge-success', 'Active': 'badge-success', 'Completed': 'badge-success', 'Closed Won': 'badge-success',
            'Pending': 'badge-warning', 'In Progress': 'badge-warning', 'Under Review': 'badge-warning', 'Negotiation': 'badge-warning',
            'Overdue': 'badge-danger', 'Locked': 'badge-danger',
            'Qualified': 'badge-info', 'Proposal': 'badge-info'
        };
        return map[status] || 'badge-info';
    }

    // ==========================================
    // 1. VIEW RENDERERS (Dynamic injection)
    // ==========================================

    function renderDashboard() {
        const kpis = DB.getKPIs();
        
        contentArea.innerHTML = `
            <!-- KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 content-enter">
                ${kpiCard('Total Revenue', formatCurrency(kpis.totalRevenue), 'text-brand-brown', 'trending-up')}
                ${kpiCard('Pending Invoices', kpis.pendingInvoices, 'text-amber-500', 'clock', kpis.overdueInvoices + ' overdue')}
                ${kpiCard('Active Projects', kpis.activeProjects, 'text-blue-600', 'layers')}
                ${kpiCard('Low Stock Alerts', kpis.lowStockItems, 'text-red-500', 'alert', 'Needs reorder')}
            </div>

            <!-- Charts & Activity Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 content-enter">
                <!-- Revenue Chart -->
                <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="font-bold text-brand-dark">Revenue Overview</h3>
                            <p class="text-xs text-gray-500">Last 6 months performance</p>
                        </div>
                        <span class="badge badge-success">+18.2%</span>
                    </div>
                    <div class="flex items-end justify-between gap-3 h-48" id="revenueChart">
                        ${renderBarChart()}
                    </div>
                </div>

                <!-- Quick Stats / Vendors -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="font-bold text-brand-dark mb-4">Top Vendors</h3>
                    <div class="space-y-4">
                        ${DB.vendors.slice(0, 4).map(v => `
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-lg bg-brand-cream flex items-center justify-center text-brand-brown font-bold text-xs">${v.name.substring(0,2).toUpperCase()}</div>
                                    <div>
                                        <p class="text-sm font-semibold text-gray-800 truncate max-w-[120px]">${v.name}</p>
                                        <p class="text-[11px] text-gray-500">${formatCurrency(v.spend)} spend</p>
                                    </div>
                                </div>
                                <span class="text-xs font-bold text-brand-gold">★ ${v.rating}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Recent Activity & Low Stock -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 content-enter">
                <!-- Audit Logs -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-brand-dark">Recent Activity</h3>
                        <a href="#" class="text-xs font-semibold text-brand-brown hover:underline" data-nav="audit">View all</a>
                    </div>
                    <div class="space-y-3">
                        ${DB.auditLogs.slice(0, 4).map(log => `
                            <div class="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-${
                                    log.type === 'success' ? 'green-500' : log.type === 'warning' ? 'amber-500' : log.type === 'danger' ? 'red-500' : 'blue-500'
                                }"></div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-700"><span class="font-semibold">${log.user}</span> ${log.action}</p>
                                    <p class="text-[11px] text-gray-400 mt-0.5">${log.timestamp}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Low Stock Alerts -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-brand-dark">Inventory Alerts</h3>
                        <a href="#" class="text-xs font-semibold text-brand-brown hover:underline" data-nav="inventory">Manage</a>
                    </div>
                    <div class="space-y-3">
                        ${DB.inventory.filter(i => i.stock < i.reorderLevel).map(item => `
                            <div class="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">
                                <div>
                                    <p class="text-sm font-semibold text-gray-800">${item.name}</p>
                                    <p class="text-[11px] text-gray-500">${item.sku} · ${item.warehouse}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-bold text-red-600">${item.stock}</p>
                                    <p class="text-[10px] text-gray-500">min ${item.reorderLevel}</p>
                                </div>
                            </div>
                        `).join('') || '<p class="text-sm text-gray-400 text-center py-4">All stock levels healthy</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    // ---- KPI Card Component ----
    function kpiCard(label, value, colorClass, icon, subtext = '') {
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-3">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">${label}</p>
                    <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center ${colorClass}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                </div>
                <p class="text-2xl font-bold text-brand-dark">${value}</p>
                ${subtext ? `<p class="text-[11px] text-gray-400 mt-1">${subtext}</p>` : ''}
            </div>
        `;
    }

    // ---- Bar Chart Renderer ----
    function renderBarChart() {
        const max = Math.max(...DB.revenueChart.data);
        return DB.revenueChart.labels.map((label, i) => {
            const height = (DB.revenueChart.data[i] / max) * 100;
            return `
                <div class="flex flex-col items-center flex-1 gap-2 group">
                    <div class="w-full flex items-end justify-center h-full">
                        <div class="w-full max-w-[40px] bg-gradient-to-t from-brand-brown to-brand-gold rounded-t-lg transition-all duration-500 hover:opacity-80 relative group" style="height: ${height}%">
                            <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                ${formatCurrency(DB.revenueChart.data[i])}
                            </div>
                        </div>
                    </div>
                    <span class="text-[11px] font-semibold text-gray-500">${label}</span>
                </div>
            `;
        }).join('');
    }

    // ---- Generic Table Renderer ----
    function renderTable(headers, rows, title) {
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden content-enter">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-brand-dark">${title}</h3>
                        <p class="text-xs text-gray-500 mt-0.5">${rows.length} records found</p>
                    </div>
                    <button class="px-4 py-2 bg-brand-brown text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition-colors">
                        + Add New
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="data-table w-full">
                        <thead>
                            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>${rows.join('')}</tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ==========================================
    // 2. SECTION VIEWS
    // ==========================================

    function renderInvoices() {
        const rows = DB.invoices.map(inv => `
            <tr>
                <td class="font-mono text-xs font-semibold text-brand-brown">${inv.id}</td>
                <td class="font-semibold">${inv.vendor}</td>
                <td class="font-bold">${formatCurrency(inv.amount)}</td>
                <td>${formatDate(inv.dueDate)}</td>
                <td><span class="badge ${getBadgeClass(inv.status)}">${inv.status}</span></td>
                <td class="text-right">
                    <button class="text-brand-brown hover:text-brand-dark font-semibold text-xs">View</button>
                </td>
            </tr>
        `);
        contentArea.innerHTML = renderTable(['Invoice #', 'Vendor', 'Amount', 'Due Date', 'Status', ''], rows, 'Invoice Management');
    }

    function renderInventory() {
        const rows = DB.inventory.map(item => {
            const isLow = item.stock < item.reorderLevel;
            return `
                <tr>
                    <td class="font-mono text-xs text-gray-500">${item.sku}</td>
                    <td class="font-semibold">${item.name}</td>
                    <td>${item.category}</td>
                    <td class="${isLow ? 'text-red-600 font-bold' : 'font-semibold'}">${item.stock}</td>
                    <td class="text-gray-500">${item.reorderLevel}</td>
                    <td>${formatCurrency(item.unitCost)}</td>
                    <td><span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">${isLow ? 'Low Stock' : 'In Stock'}</span></td>
                </tr>
            `;
        });
        contentArea.innerHTML = renderTable(['SKU', 'Product Name', 'Category', 'Stock', 'Reorder At', 'Unit Cost', 'Status'], rows, 'Inventory & Warehouse');
    }

    function renderVendors() {
        const rows = DB.vendors.map(v => `
            <tr>
                <td class="font-mono text-xs text-gray-500">${v.id}</td>
                <td class="font-semibold">${v.name}</td>
                <td>${v.category}</td>
                <td class="font-bold text-brand-gold">★ ${v.rating}</td>
                <td>${formatCurrency(v.spend)}</td>
                <td>${formatDate(v.contractEnd)}</td>
                <td><span class="badge ${getBadgeClass(v.status)}">${v.status}</span></td>
            </tr>
        `);
        contentArea.innerHTML = renderTable(['ID', 'Vendor', 'Category', 'Rating', 'Total Spend', 'Contract End', 'Status'], rows, 'Procurement & Vendor Management');
    }

    function renderEmployees() {
        const rows = DB.employees.map(e => `
            <tr>
                <td class="font-mono text-xs text-gray-500">${e.id}</td>
                <td class="font-semibold flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-brand-cream text-brand-brown flex items-center justify-center text-[10px] font-bold">${e.name.split(' ').map(n=>n[0]).join('')}</div>
                    ${e.name}
                </td>
                <td>${e.department}</td>
                <td><span class="text-xs font-semibold px-2 py-1 rounded bg-gray-100">${e.role}</span></td>
                <td>${formatDate(e.joinDate)}</td>
                <td><span class="badge ${getBadgeClass(e.status)}">${e.status}</span></td>
            </tr>
        `);
        contentArea.innerHTML = renderTable(['ID', 'Employee', 'Department', 'Role', 'Joined', 'Status'], rows, 'Human Resources');
    }

    function renderProjects() {
        const rows = DB.projects.map(p => {
            const barColor = p.progress === 100 ? 'bg-green-500' : 'bg-brand-brown';
            return `
                <tr>
                    <td class="font-mono text-xs text-gray-500">${p.id}</td>
                    <td class="font-semibold">${p.name}</td>
                    <td>
                        <div class="flex items-center gap-3">
                            <div class="flex-1 progress-bar w-24">
                                <div class="progress-fill ${barColor}" style="width: ${p.progress}%"></div>
                            </div>
                            <span class="text-xs font-bold text-gray-600">${p.progress}%</span>
                        </div>
                    </td>
                    <td>${formatCurrency(p.budget)}</td>
                    <td class="text-amber-600 font-semibold">${formatCurrency(p.spent)}</td>
                    <td>${formatDate(p.deadline)}</td>
                    <td><span class="badge ${getBadgeClass(p.status)}">${p.status}</span></td>
                </tr>
            `;
        });
        contentArea.innerHTML = renderTable(['ID', 'Project', 'Progress', 'Budget', 'Spent', 'Deadline', 'Status'], rows, 'Project Management');
    }

    function renderLeads() {
        const rows = DB.leads.map(l => `
            <tr>
                <td class="font-mono text-xs text-gray-500">${l.id}</td>
                <td class="font-semibold">${l.company}</td>
                <td>${l.contact}</td>
                <td class="font-bold">${formatCurrency(l.value)}</td>
                <td><span class="badge ${getBadgeClass(l.stage)}">${l.stage}</span></td>
                <td>
                    <div class="flex items-center gap-2">
                        <div class="w-16 progress-bar">
                            <div class="progress-fill bg-brand-gold" style="width: ${l.probability}%"></div>
                        </div>
                        <span class="text-xs font-bold">${l.probability}%</span>
                    </div>
                </td>
            </tr>
        `);
        contentArea.innerHTML = renderTable(['ID', 'Company', 'Contact', 'Deal Value', 'Stage', 'Win Probability'], rows, 'CRM & Sales Pipeline');
    }

    function renderAudit() {
        const rows = DB.auditLogs.map(log => `
            <tr>
                <td class="font-mono text-xs text-gray-500">${log.id}</td>
                <td class="font-semibold">${log.user}</td>
                <td>${log.action}</td>
                <td class="text-gray-500 text-xs">${log.timestamp}</td>
                <td><span class="badge badge-${log.type}">${log.type}</span></td>
            </tr>
        `);
        contentArea.innerHTML = renderTable(['Log ID', 'User', 'Action', 'Timestamp', 'Type'], rows, 'Security Audit Trail');
    }

    // ==========================================
    // 3. NAVIGATION LOGIC
    // ==========================================
    const views = {
        dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time business intelligence', render: renderDashboard },
        invoices: { title: 'Financial Management', subtitle: 'Accounts receivable & payables', render: renderInvoices },
        inventory: { title: 'Supply Chain', subtitle: 'Warehouse & stock management', render: renderInventory },
        vendors: { title: 'Procurement', subtitle: 'Vendor relationship management', render: renderVendors },
        projects: { title: 'Project Management', subtitle: 'Initiatives & resource allocation', render: renderProjects },
        employees: { title: 'Human Resources', subtitle: 'Directory & payroll management', render: renderEmployees },
        leads: { title: 'CRM & Sales', subtitle: 'Pipeline & deal tracking', render: renderLeads },
        audit: { title: 'System Audit', subtitle: 'Security & compliance logs', render: renderAudit }
    };

    function navigateTo(section) {
        const view = views[section];
        if (!view) return;

        // Update titles
        pageTitle.textContent = view.title;
        pageSubtitle.textContent = view.subtitle;

        // Update active nav
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });

        // Render content
        view.render();

        // Close mobile sidebar
        if (window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
        }
    }

    // Attach click handlers to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.section);
        });
    });

    // Handle "View all" links inside dashboard cards
    contentArea.addEventListener('click', (e) => {
        const navLink = e.target.closest('[data-nav]');
        if (navLink) {
            e.preventDefault();
            navigateTo(navLink.dataset.nav);
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });

    // ==========================================
    // 4. INITIALIZE
    // ==========================================
    initUserProfile();
    navigateTo('dashboard');
});