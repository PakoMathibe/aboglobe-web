// ============================================================
// MODULE: Procurement
// ============================================================

Views.vendors = () => {
    const rows = ERP.vendors.map(v => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${v.id}</td>
            <td class="font-semibold">${v.name}</td>
            <td>${v.category}</td>
            <td class="font-bold text-brand-gold">★ ${v.rating}</td>
            <td>${v.onTimeDelivery}%</td>
            <td>${c(v.spend)}</td>
            <td><span class="badge ${b(v.status)}">${v.status}</span></td>
            <td>${ra('vendors', v.id)}</td>
        </tr>`);
    const avg = (ERP.vendors.reduce((s,v)=>s+v.rating,0)/ERP.vendors.length).toFixed(1);
    return h('Vendor Management', 'Vendor profiles, performance KPIs, and contracts') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${k('Total Vendors', ERP.vendors.length)}
            ${k('Avg Rating', avg, 'Out of 5.0')}
            ${k('Total Spend', c(ERP.vendors.reduce((s,v)=>s+v.spend,0)))}
        </div>` +
        t(['ID', 'Vendor', 'Category', 'Rating', 'On-Time', 'Spend', 'Status'], rows, { title: 'All Vendors', count: ERP.vendors.length, entity: 'vendors' });
};

Views.purchaseorders = () => {
    const rows = ERP.purchaseOrders.map(p => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-brand-brown font-semibold">${p.id}</td>
            <td class="font-semibold">${p.vendor}</td>
            <td>${p.items} items</td>
            <td class="font-bold">${c(p.total)}</td>
            <td>${d(p.date)}</td>
            <td><span class="badge ${b(p.status)}">${p.status}</span></td>
            <td>${ra('purchaseOrders', p.id)}</td>
        </tr>`);
    return h('Purchase Orders', 'Automated procurement and PO management') +
        t(['PO Number', 'Vendor', 'Items', 'Total', 'Date', 'Status'], rows, { title: 'Active Purchase Orders', count: ERP.purchaseOrders.length, entity: 'purchaseOrders' });
};

Views.contracts = () => {
    const rows = ERP.contracts.map(x => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${x.id}</td>
            <td class="font-semibold">${x.vendor}</td>
            <td>${x.type}</td>
            <td>${d(x.start)}</td>
            <td class="${x.renewalAlert ? 'text-red-600 font-bold' : ''}">${d(x.end)}</td>
            <td class="font-bold">${c(x.value)}</td>
            <td><span class="badge ${b(x.status)}">${x.status}</span></td>
            <td>${ra('contracts', x.id)}</td>
        </tr>`);
    return h('Contracts & SLA Management', 'Track renewals and compliance obligations') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${k('Active Contracts', ERP.contracts.filter(x=>x.status==='Active').length)}
            ${k('Renewal Alerts', ERP.contracts.filter(x=>x.renewalAlert).length, 'Requires action')}
            ${k('Total Value', c(ERP.contracts.reduce((s,x)=>s+x.value,0)))}
        </div>` +
        t(['ID', 'Vendor', 'Type', 'Start', 'End', 'Value', 'Status'], rows, { title: 'Contract Portfolio', count: ERP.contracts.length, entity: 'contracts' });
};

Views.contingent = () => {
    const rows = ERP.contingentWorkforce.map(x => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${x.id}</td>
            <td class="font-semibold">${x.name}</td>
            <td>${x.agency}</td>
            <td>${x.role}</td>
            <td>${c(x.rate)}/hr</td>
            <td>${x.hours} hrs</td>
            <td><span class="badge ${b(x.status)}">${x.status}</span></td>
            <td></td>
        </tr>`);
    return h('Contingent Workforce', 'Temporary staff, freelancers, and consultants') +
        t(['ID', 'Name', 'Agency', 'Role', 'Rate', 'Hours', 'Status'], rows, { title: 'Contingent Workers', count: ERP.contingentWorkforce.length });
};