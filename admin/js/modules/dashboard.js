// ============================================================
// MODULE: Dashboard Overview
// ============================================================

Views.dashboard = () => {
    const { fmtCurrency, kpiCard, icon } = App;
    const k = ERP.getKPIs();

    return `
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            ${kpiCard('Revenue (AR)', fmtCurrency(k.totalRevenue), 'Paid this period', '+18%', "App.navigateTo('ar')")}
            ${kpiCard('Accounts Payable', fmtCurrency(k.totalPayable), 'Outstanding', '-4%', "App.navigateTo('ap')")}
            ${kpiCard('Active Projects', k.activeProjects, 'In progress', '', "App.navigateTo('projects')")}
            ${kpiCard('Low Stock', k.lowStockItems, 'Need reorder', '', "App.navigateTo('inventory')")}
            ${kpiCard('Employees', k.activeEmployees, 'Active staff', '', "App.navigateTo('employees')")}
            ${kpiCard('Automation Runs', k.automationRuns, 'Last 30 days', '+12%', "App.navigateTo('automation')")}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 content-enter">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="font-bold text-brand-dark">Cash Flow</h3>
                        <p class="text-xs text-gray-500">Inflow vs Outflow</p>
                    </div>
                    <div class="flex gap-4 text-xs">
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-brand-gold"></span> Inflow</span>
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-brand-brown"></span> Outflow</span>
                    </div>
                </div>
                <div class="flex items-end gap-2 h-48">
                    ${ERP.cashFlow.labels.map((label, i) => {
                        const max = Math.max(...ERP.cashFlow.inflow, ...ERP.cashFlow.outflow);
                        const inH = (ERP.cashFlow.inflow[i] / max) * 100;
                        const outH = (ERP.cashFlow.outflow[i] / max) * 100;
                        return `<div class="flex-1 flex flex-col items-center gap-1">
                            <div class="flex gap-1 items-end w-full justify-center h-full">
                                <div class="w-1/3 bg-brand-gold rounded-t chart-bar" style="height:${inH}%"></div>
                                <div class="w-1/3 bg-brand-brown rounded-t chart-bar" style="height:${outH}%"></div>
                            </div>
                            <span class="text-[10px] font-semibold text-gray-500">${label}</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 content-enter">
                <h3 class="font-bold text-brand-dark mb-1">Live Activity</h3>
                <p class="text-xs text-gray-500 mb-4 flex items-center gap-2"><span class="pulse-dot"></span>Real-time</p>
                <div class="space-y-3">
                    ${ERP.auditLogs.slice(0, 5).map(log => `
                        <div class="flex items-start gap-2 pb-3 border-b border-gray-50 last:border-0">
                            <div class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-${log.type === 'success' ? 'green-500' : log.type === 'warning' ? 'amber-500' : log.type === 'danger' ? 'red-500' : 'blue-500'}"></div>
                            <div class="min-w-0">
                                <p class="text-xs text-gray-700 leading-snug"><span class="font-semibold">${log.user}</span> ${log.action}</p>
                                <p class="text-[10px] text-gray-400 mt-0.5">${log.timestamp.split(' ')[1]} · ${log.module}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            ${[
                { id: 'ap', label: 'Invoices & Billing', desc: 'AP / AR / Payments', icon: 'file' },
                { id: 'inventory', label: 'Inventory & Stock', desc: 'Warehouses, reordering', icon: 'box' },
                { id: 'vendors', label: 'Vendors & Contracts', desc: 'SLA, compliance', icon: 'briefcase' },
                { id: 'employees', label: 'HR & Payroll', desc: 'Staff, salaries', icon: 'users' }
            ].map(m => `
                <div class="module-card" data-module="${m.id}">
                    <div class="w-11 h-11 rounded-xl bg-brand-cream text-brand-brown flex items-center justify-center mb-4">${icon(m.icon)}</div>
                    <h4 class="font-bold text-brand-dark text-sm mb-1">${m.label}</h4>
                    <p class="text-xs text-gray-500">${m.desc}</p>
                    <div class="mt-4 flex items-center gap-1 text-brand-brown text-xs font-bold">Open module →</div>
                </div>
            `).join('')}
        </div>
    `;
};