// ============================================================
// MODULE: Operations
// ============================================================

const c = App.fmtCurrency;
const d = App.fmtDate;
const b = App.badgeClass;
const k = App.kpiCard;
const t = App.table;
const h = App.header;
const i = App.icon;
const ra = App.rowActions;

// ----- Inventory -----
Views.inventory = () => {
    const rows = ERP.inventory.map(item => {
        const low = item.stock < item.reorder;
        return `<tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${item.sku}</td>
            <td class="font-semibold">${item.name}</td>
            <td>${item.category}</td>
            <td class="${low ? 'text-red-600 font-bold' : 'font-semibold'}">${item.stock}</td>
            <td>${item.reorder}</td>
            <td>${c(item.unitCost)}</td>
            <td><span class="badge ${low ? 'badge-danger' : 'badge-success'}">${low ? 'Low Stock' : 'In Stock'}</span></td>
            <td>${ra('inventory', item.sku)}</td>
        </tr>`;
    });
    const low = ERP.inventory.filter(x => x.stock < x.reorder).length;
    const value = ERP.inventory.reduce((s,x) => s + x.stock * x.unitCost, 0);
    return h('Supply Chain & Inventory', 'Warehouse stock levels and reordering') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${k('Total SKUs', ERP.inventory.length)}
            ${k('Low Stock Alerts', low, 'Need reorder')}
            ${k('Inventory Value', c(value))}
        </div>` +
        t(['SKU', 'Product', 'Category', 'Stock', 'Reorder At', 'Unit Cost', 'Status'], rows, { title: 'Inventory Items', count: ERP.inventory.length, entity: 'inventory' });
};

// ----- Warehouses -----
Views.warehouses = () => h('Warehouse Management', 'Facility utilization and capacity') +
    `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${ERP.warehouses.map(w => {
            const color = w.utilization > 90 ? 'bg-red-500' : w.utilization > 75 ? 'bg-amber-500' : 'bg-green-500';
            return `<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 content-enter">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-brand-cream text-brand-brown flex items-center justify-center">${i('building')}</div>
                    <div><h4 class="font-bold text-brand-dark">${w.name}</h4><p class="text-xs text-gray-500">${w.location}</p></div>
                </div>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-xs mb-1"><span class="text-gray-500">Utilization</span><span class="font-bold">${w.utilization}%</span></div>
                        <div class="progress-bar"><div class="progress-fill ${color}" style="width:${w.utilization}%"></div></div>
                    </div>
                    <div class="flex justify-between text-xs pt-2 border-t border-gray-100">
                        <span class="text-gray-500">Capacity</span><span class="font-bold">${w.capacity}k units</span>
                    </div>
                </div>
            </div>`;
        }).join('')}
    </div>`;

// ----- Production -----
Views.production = () => h('Manufacturing & Production', 'BOMs, scheduling, and shop floor control') +
    `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden content-enter">
            <div class="p-6 border-b border-gray-100"><h3 class="font-bold text-brand-dark">Bill of Materials (BOM)</h3></div>
            <table class="data-table w-full">
                <thead><tr><th>BOM ID</th><th>Product</th><th>Components</th><th>Cost</th><th>Lead Time</th></tr></thead>
                <tbody>${ERP.billOfMaterials.map(x => `<tr>
                    <td class="font-mono text-xs text-gray-500">${x.id}</td>
                    <td class="font-semibold">${x.product}</td>
                    <td>${x.components}</td>
                    <td>${c(x.cost)}</td>
                    <td>${x.leadTime}</td>
                </tr>`).join('')}</tbody>
            </table>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden content-enter">
            <div class="p-6 border-b border-gray-100"><h3 class="font-bold text-brand-dark">Production Schedule</h3></div>
            <table class="data-table w-full">
                <thead><tr><th>ID</th><th>Product</th><th>Qty</th><th>Line</th><th>Status</th></tr></thead>
                <tbody>${ERP.productionSchedule.map(x => `<tr>
                    <td class="font-mono text-xs text-gray-500">${x.id}</td>
                    <td class="font-semibold">${x.product}</td>
                    <td>${x.quantity}</td>
                    <td><span class="badge badge-neutral">${x.line}</span></td>
                    <td><span class="badge ${b(x.status)}">${x.status}</span></td>
                </tr>`).join('')}</tbody>
            </table>
        </div>
    </div>`;

// ----- Quality Control -----
Views.quality = () => {
    const rows = ERP.qualityControl.map(q => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${q.id}</td>
            <td class="font-semibold">${q.product}</td>
            <td class="font-mono text-xs">${q.batch}</td>
            <td>${q.inspected}</td>
            <td class="text-green-600 font-semibold">${q.passed}</td>
            <td class="text-red-600 font-semibold">${q.failed}</td>
            <td><div class="flex items-center gap-2"><div class="progress-bar w-16"><div class="progress-fill bg-green-500" style="width:${q.passRate}%"></div></div><span class="text-xs font-bold">${q.passRate}%</span></div></td>
            <td></td>
        </tr>`);
    return h('Quality Control', 'Batch inspection and pass rates') +
        t(['ID', 'Product', 'Batch', 'Inspected', 'Passed', 'Failed', 'Pass Rate'], rows, { title: 'Quality Inspections', count: ERP.qualityControl.length });
};