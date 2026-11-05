// ============================================================
// MODULE: Reports & BI
// ============================================================

Views.reports = () => {
    const k = ERP.getKPIs();
    const max = Math.max(...ERP.cashFlow.inflow, ...ERP.cashFlow.outflow);

    return App.header('Reports & Business Intelligence', 'Customizable dashboards and operational reporting') +
    `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${App.kpiCard('Total Revenue', App.fmtCurrency(k.totalRevenue), 'All time', '+18%')}
        ${App.kpiCard('Total Receivable', App.fmtCurrency(k.totalReceivable), 'Outstanding')}
        ${App.kpiCard('Total Payable', App.fmtCurrency(k.totalPayable), 'Owed')}
        ${App.kpiCard('Inventory Value', App.fmtCurrency(k.totalInventoryValue), 'On-hand')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 content-enter">
            <h3 class="font-bold text-brand-dark mb-4">Cash Flow Trend</h3>
            <div class="flex items-end gap-3 h-56">
                ${ERP.cashFlow.labels.map((label, i) => {
                    const inH = (ERP.cashFlow.inflow[i] / max) * 100;
                    const outH = (ERP.cashFlow.outflow[i] / max) * 100;
                    return `<div class="flex-1 flex flex-col items-center gap-1">
                        <div class="flex gap-1 items-end w-full justify-center h-full">
                            <div class="w-1/3 bg-green-500 rounded-t" style="height:${inH}%"></div>
                            <div class="w-1/3 bg-red-500 rounded-t" style="height:${outH}%"></div>
                        </div>
                        <span class="text-[10px] text-gray-500">${label}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>
        
        <div class="bg-white rounded-2xl border border-gray-100 p-6 content-enter">
            <h3 class="font-bold text-brand-dark mb-4">Department Budget Utilization</h3>
            <div class="space-y-3">
                ${ERP.budgets.map(b => {
                    const pct = Math.round((b.spent / b.allocated) * 100);
                    const color = pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-green-500';
                    return `<div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="font-semibold">${b.department}</span>
                            <span class="text-gray-500">${pct}%</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill ${color}" style="width:${pct}%"></div></div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 p-6 content-enter">
        <h3 class="font-bold text-brand-dark mb-4">Generate Custom Report</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select class="px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-sm">
                <option>Financial Summary</option>
                <option>AP/AR Aging</option>
                <option>Inventory Valuation</option>
                <option>Employee Performance</option>
                <option>Vendor Scorecard</option>
                <option>Project Status</option>
            </select>
            <input type="date" class="px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-sm" value="2024-06-01">
            <button onclick="App.toast('Report generated (demo)', 'success')" class="px-4 py-2.5 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">Generate Report</button>
        </div>
    </div>`;
};