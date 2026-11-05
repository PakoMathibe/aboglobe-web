// ============================================================
// ADMIN CORE v3.3 - With Supplier Portal external link support
// ============================================================

window.Views = window.Views || {};
window.FormConfigs = window.FormConfigs || {};
window.ERP = window.ERP || {};

const App = {
    // ============ FORMATTERS ============
    fmtCurrency: (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0),
    fmtDate: (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    fmtDateTime: (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
    timeAgo: (d) => {
        const diff = (Date.now() - new Date(d)) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return Math.floor(diff/60) + 'm ago';
        if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
        return Math.floor(diff/86400) + 'd ago';
    },

    badgeClass: (s) => {
        const map = {
            'Paid':'badge-success','Active':'badge-success','Completed':'badge-success','Closed Won':'badge-success',
            'Approved':'badge-success','Shipped':'badge-success','Received':'badge-success','Delivered':'badge-success',
            'Pending':'badge-warning','In Progress':'badge-warning','Under Review':'badge-warning','Negotiation':'badge-warning',
            'Expiring Soon':'badge-warning','Scheduled':'badge-warning','Pending Approval':'badge-warning','Open':'badge-warning',
            'High':'badge-warning','Medium':'badge-warning','Draft':'badge-warning','Submitted':'badge-warning',
            'Overdue':'badge-danger','Locked':'badge-danger','Inactive':'badge-danger','Low Stock':'badge-danger',
            'Rejected':'badge-danger','Cancelled':'badge-danger','Suspended':'badge-danger',
            'Qualified':'badge-info','Proposal':'badge-info','Closed':'badge-neutral','Low':'badge-neutral'
        };
        return map[s] || 'badge-info';
    },

    icons: {
        home: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>',
        book: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>',
        'arrow-up': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>',
        'arrow-down': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>',
        chart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>',
        trending: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>',
        box: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>',
        building: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>',
        factory: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>',
        shield: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>',
        users: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>',
        cart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>',
        file: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
        briefcase: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>',
        money: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        calendar: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>',
        search: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>',
        star: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>',
        check: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        layers: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>',
        flag: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>',
        zap: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>',
        chat: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>',
        mail: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>',
        folder: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>',
        settings: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>',
        workflow: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>',
        report: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>'
    },

    icon(name) {
        return `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">${this.icons[name] || this.icons.home}</svg>`;
    },

    // ============ COMPONENTS ============
    kpiCard(label, value, sub, trend, onclick) {
        return `
            <div class="kpi-card content-enter ${onclick ? 'cursor-pointer' : ''}" ${onclick ? `onclick="${onclick}"` : ''}>
                <div class="flex items-center justify-between mb-3">
                    <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">${label}</p>
                    ${trend ? `<span class="text-[10px] font-bold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}">${trend}</span>` : ''}
                </div>
                <p class="text-2xl font-extrabold text-brand-dark">${value}</p>
                ${sub ? `<p class="text-[11px] text-gray-400 mt-1">${sub}</p>` : ''}
            </div>`;
    },

    table(headers, rows, opts = {}) {
        const { title = 'Records', count = rows.length, entity } = opts;
        const tableId = 'tbl-' + Math.random().toString(36).slice(2, 8);
        App._tables = App._tables || {};
        App._tables[tableId] = { headers, rows, entity };
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden content-enter">
                <div class="p-5 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                    <div class="flex items-center gap-3">
                        <h3 class="font-bold text-brand-dark">${title}</h3>
                        <span class="stat-pill">${count} rows</span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <div class="relative">
                            <input type="text" placeholder="Search..." 
                                oninput="App.filterTable(this, '${tableId}')"
                                class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none w-56">
                            <svg class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <button onclick="App.exportCSV('${tableId}')" class="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Export
                        </button>
                        ${entity ? `<button onclick="App.openCreateModal('${entity}')" class="px-4 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors">+ Add New</button>` : ''}
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="data-table w-full" id="${tableId}">
                        <thead><tr>
                            <th class="w-10"><input type="checkbox" onchange="App.toggleAll(this, '${tableId}')"></th>
                            ${headers.map((h, i) => `<th onclick="App.sortTable('${tableId}', ${i})">${h}<span class="sort-indicator"></span></th>`).join('')}
                            <th class="w-24 text-right">Actions</th>
                        </tr></thead>
                        <tbody>${rows.join('')}</tbody>
                    </table>
                </div>
                <div class="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing ${count} rows</span>
                    <div class="flex gap-1">
                        <button class="px-3 py-1 rounded hover:bg-gray-100">Prev</button>
                        <button class="px-3 py-1 rounded bg-brand-brown text-white">1</button>
                        <button class="px-3 py-1 rounded hover:bg-gray-100">Next</button>
                    </div>
                </div>
            </div>`;
    },

    rowActions(entity, id, extraButtons = '') {
        return `
            <div class="flex items-center justify-end gap-1">
                <button onclick="App.viewRecord('${entity}', '${id}')" class="p-1.5 text-gray-400 hover:text-brand-brown transition-colors" title="View">👁</button>
                <button onclick="App.editRecord('${entity}', '${id}')" class="p-1.5 text-gray-400 hover:text-brand-brown transition-colors" title="Edit">✏️</button>
                <button onclick="App.deleteRecord('${entity}', '${id}')" class="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">🗑</button>
                ${extraButtons}
            </div>`;
    },

    header(title, subtitle, actionsHtml = '') {
        return `<div class="mb-6 content-enter flex items-start justify-between flex-wrap gap-3">
            <div><h2 class="text-2xl font-bold text-brand-dark">${title}</h2><p class="text-sm text-gray-500 mt-1">${subtitle}</p></div>
            <div class="flex gap-2 flex-wrap">${actionsHtml}</div>
        </div>`;
    },

    // ============ TABLE INTERACTIONS ============
    filterTable(input, tableId) {
        const term = input.value.toLowerCase();
        document.querySelectorAll(`#${tableId} tbody tr`).forEach(r => {
            if (r.classList.contains('row-detail')) return;
            r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    },

    toggleAll(cb, tableId) {
        document.querySelectorAll(`#${tableId} tbody input[type=checkbox]`).forEach(c => c.checked = cb.checked);
        const checked = document.querySelectorAll(`#${tableId} tbody input[type=checkbox]:checked`).length;
        App.updateBulkBar(checked);
    },

    sortTable(tableId, colIndex) {
        const table = document.getElementById(tableId);
        if (!table) return;
        const tbody = table.querySelector('tbody');
        const headers = table.querySelectorAll('thead th');
        const th = headers[colIndex + 1];
        if (!th) return;

        const currentSort = th.classList.contains('sorted-asc') ? 'asc' : th.classList.contains('sorted-desc') ? 'desc' : null;
        const newSort = currentSort === 'asc' ? 'desc' : 'asc';

        headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
        th.classList.add(newSort === 'asc' ? 'sorted-asc' : 'sorted-desc');

        const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.classList.contains('row-detail'));
        rows.sort((a, b) => {
            const aText = a.children[colIndex + 1]?.textContent.trim() || '';
            const bText = b.children[colIndex + 1]?.textContent.trim() || '';
            const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
            const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
            if (!isNaN(aNum) && !isNaN(bNum)) return newSort === 'asc' ? aNum - bNum : bNum - aNum;
            return newSort === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
        rows.forEach(r => tbody.appendChild(r));
    },

    updateBulkBar(count) {
        let bar = document.getElementById('bulkBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'bulkBar';
            bar.className = 'bulk-bar';
            bar.innerHTML = `
                <span id="bulkCount">0 selected</span>
                <div class="divider"></div>
                <button onclick="App.bulkAction('export')">Export</button>
                <button onclick="App.bulkAction('delete')" style="color:#FCA5A5">Delete</button>
                <button onclick="App.bulkAction('clear')">Clear</button>
            `;
            document.body.appendChild(bar);
        }
        if (count > 0) {
            bar.classList.add('visible');
            bar.querySelector('#bulkCount').textContent = `${count} selected`;
        } else {
            bar.classList.remove('visible');
        }
    },

    bulkAction(action) {
        const selected = document.querySelectorAll('.data-table tbody input[type=checkbox]:checked');
        if (action === 'clear') {
            document.querySelectorAll('.data-table tbody input[type=checkbox]').forEach(c => c.checked = false);
            App.updateBulkBar(0);
            return;
        }
        if (selected.length === 0) return;
        if (action === 'delete') {
            if (confirm(`Delete ${selected.length} record(s)?`)) {
                selected.forEach(c => {
                    const row = c.closest('tr');
                    if (row) row.remove();
                });
                App.updateBulkBar(0);
                App.toast(`Deleted ${selected.length} records`, 'success');
            }
        } else if (action === 'export') {
            App.toast(`Exported ${selected.length} records`, 'success');
        }
    },

    exportCSV(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        const rows = [];
        table.querySelectorAll('tr').forEach(r => {
            if (r.classList.contains('row-detail')) return;
            const cells = Array.from(r.querySelectorAll('th, td')).slice(1, -1);
            const row = cells.map(c => `"${c.textContent.trim().replace(/"/g, '""')}"`).join(',');
            rows.push(row);
        });
        const csv = rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = tableId + '.csv'; a.click();
        URL.revokeObjectURL(url);
        App.toast('Exported to CSV', 'success');
    },

    // ============ MODALS ============
    openModal(title, bodyHtml, size = 'md') {
        const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };
        const modal = document.createElement('div');
        modal.id = 'appModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col">
                <div class="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-brand-dark">${title}</h3>
                    <button onclick="App.closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>
                <div class="p-6 overflow-y-auto flex-1">${bodyHtml}</div>
            </div>`;
        document.body.appendChild(modal);
    },

    closeModal() { document.getElementById('appModal')?.remove(); },

    openCreateModal(entity) {
        const cfg = FormConfigs[entity];
        if (!cfg) { this.toast('Form not configured for ' + entity, 'error'); return; }
        this.openModal(`New ${cfg.label}`, this.buildForm(cfg, {}), 'lg');
    },

    editRecord(entity, id) {
        const cfg = FormConfigs[entity];
        if (!cfg) return;
        const record = ERP[cfg.store].find(r => r[cfg.idKey || 'id'] == id);
        if (!record) return;
        this.openModal(`Edit ${cfg.label}`, this.buildForm(cfg, record), 'lg');
    },

    viewRecord(entity, id) {
        const cfg = FormConfigs[entity];
        if (!cfg) return;
        const record = ERP[cfg.store].find(r => r[cfg.idKey || 'id'] == id);
        if (!record) return;
        this.renderDetailPage(entity, record);
    },

    renderDetailPage(entity, record) {
        const cfg = FormConfigs[entity];
        const id = record[cfg.idKey || 'id'];
        const contentArea = document.getElementById('contentArea');
        
        const fields = Object.entries(record).map(([k, v]) => `
            <div class="flex justify-between py-2.5 border-b border-gray-50">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">${k}</span>
                <span class="text-sm text-gray-800 font-medium text-right">${v}</span>
            </div>`).join('');

        contentArea.innerHTML = `
            <div class="mb-6 flex items-center justify-between flex-wrap gap-3 content-enter">
                <button onclick="App.navigateTo('${App.currentModule}')" class="text-gray-500 hover:text-brand-dark text-sm flex items-center gap-1">
                    ← Back to ${cfg.label}s
                </button>
                <div class="flex gap-2">
                    <button onclick="App.editRecord('${entity}', '${id}')" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50">Edit</button>
                    <button onclick="App.deleteRecord('${entity}', '${id}')" class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100">Delete</button>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden content-enter">
                <div class="p-8 border-b border-gray-100">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">${cfg.label} ${id}</p>
                            <h2 class="text-2xl font-bold text-brand-dark">${record.name || record.title || record.vendor || record.company || id}</h2>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-brand-cream text-brand-brown flex items-center justify-center font-bold">
                            ${(record.owner || record.name || '?').split(' ').map(n => n[0]).slice(0,2).join('')}
                        </div>
                    </div>
                </div>
                <div class="detail-tabs px-8 pt-4">
                    <div class="detail-tab active" onclick="App.switchDetailTab(this, 'overview')">Overview</div>
                    <div class="detail-tab" onclick="App.switchDetailTab(this, 'activity')">Activity</div>
                    <div class="detail-tab" onclick="App.switchDetailTab(this, 'comments')">Comments</div>
                </div>
                <div class="p-8">
                    <div data-detail-tab="overview">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                            ${fields}
                        </div>
                    </div>
                    <div data-detail-tab="activity" style="display:none">
                        <div class="space-y-4">
                            <div class="timeline-item">
                                <p class="text-sm font-semibold text-brand-dark">Sarah Chen</p>
                                <p class="text-xs text-gray-600">Viewed record</p>
                                <p class="text-[11px] text-gray-400 mt-0.5">2 min ago</p>
                            </div>
                            <div class="timeline-item">
                                <p class="text-sm font-semibold text-brand-dark">System</p>
                                <p class="text-xs text-gray-600">Record created</p>
                                <p class="text-[11px] text-gray-400 mt-0.5">3 hours ago</p>
                            </div>
                        </div>
                    </div>
                    <div data-detail-tab="comments" style="display:none">
                        <div class="comment-box border-0">
                            <div class="w-8 h-8 rounded-full bg-brand-brown text-white flex items-center justify-center text-xs font-bold flex-shrink-0">SC</div>
                            <div class="flex-1">
                                <textarea class="comment-input" rows="3" placeholder="Add a comment..."></textarea>
                                <div class="flex justify-end mt-2">
                                    <button onclick="App.toast('Comment posted', 'success')" class="px-3 py-1.5 bg-brand-brown text-white text-xs font-bold rounded-lg">Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    switchDetailTab(el, tab) {
        document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        document.querySelectorAll('[data-detail-tab]').forEach(t => t.style.display = 'none');
        const target = document.querySelector(`[data-detail-tab="${tab}"]`);
        if (target) target.style.display = 'block';
    },

    buildForm(cfg, record) {
        const fields = cfg.fields.map(f => {
            const value = record[f.name] ?? f.default ?? '';
            let input;
            if (f.type === 'select') {
                input = `<select name="${f.name}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none">
                    ${f.options.map(o => `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`).join('')}
                </select>`;
            } else if (f.type === 'number') {
                input = `<input type="number" name="${f.name}" value="${value}" ${f.required ? 'required' : ''} class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none">`;
            } else if (f.type === 'date') {
                input = `<input type="date" name="${f.name}" value="${value}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none">`;
            } else if (f.type === 'textarea') {
                input = `<textarea name="${f.name}" rows="3" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">${value}</textarea>`;
            } else {
                input = `<input type="text" name="${f.name}" value="${value}" ${f.required ? 'required' : ''} class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none">`;
            }
            return `<div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">${f.label}${f.required ? ' *' : ''}</label>${input}</div>`;
        }).join('');

        return `
            <form onsubmit="App.saveRecord(event, '${cfg.entity}', '${record[cfg.idKey || 'id'] || ''}')" class="space-y-4">
                ${fields}
                <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button type="button" onclick="App.closeModal()" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" class="px-6 py-2 text-sm bg-brand-brown text-white rounded-lg font-semibold hover:bg-brand-dark">Save</button>
                </div>
            </form>`;
    },

    saveRecord(e, entity, existingId) {
        e.preventDefault();
        const cfg = FormConfigs[entity];
        const data = {};
        new FormData(e.target).forEach((v, k) => { data[k] = v; });

        if (existingId) {
            const idx = ERP[cfg.store].findIndex(r => r[cfg.idKey || 'id'] == existingId);
            ERP[cfg.store][idx] = { ...ERP[cfg.store][idx], ...data };
            this.toast(`${cfg.label} updated`, 'success');
        } else {
            data[cfg.idKey || 'id'] = cfg.generateId();
            ERP[cfg.store].unshift(data);
            this.toast(`${cfg.label} created`, 'success');
        }
        this.closeModal();
        this.saveState();
        this.navigateTo(this.currentModule);
    },

    deleteRecord(entity, id) {
        const cfg = FormConfigs[entity];
        if (!cfg) return;
        this.openModal('Confirm Delete', `
            <p class="text-gray-600 mb-6">Are you sure you want to delete this ${cfg.label}?</p>
            <div class="flex justify-end gap-2">
                <button onclick="App.closeModal()" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onclick="App.confirmDelete('${entity}', '${id}')" class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg">Delete</button>
            </div>`, 'sm');
    },

    confirmDelete(entity, id) {
        const cfg = FormConfigs[entity];
        ERP[cfg.store] = ERP[cfg.store].filter(r => r[cfg.idKey || 'id'] != id);
        this.closeModal();
        this.toast(`${cfg.label} deleted`, 'success');
        this.saveState();
        this.navigateTo(this.currentModule);
    },

    // ============ TOAST ============
    toast(message, type = 'success') {
        const container = document.getElementById('toastContainer') || (() => {
            const el = document.createElement('div');
            el.id = 'toastContainer';
            el.className = 'fixed top-6 right-6 z-[100] flex flex-col gap-2';
            document.body.appendChild(el);
            return el;
        })();
        const colors = { success: 'border-green-500 text-green-700', error: 'border-red-500 text-red-700', info: 'border-blue-500 text-blue-700' };
        const icons = { success: '✅', error: '⚠️', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `bg-white px-4 py-3 rounded-xl shadow-xl border-l-4 ${colors[type]} flex items-center gap-3 min-w-[280px] animate-toast`;
        toast.innerHTML = `<span>${icons[type]}</span><span class="text-sm font-medium">${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    },

    // ============ PERSISTENCE ============
    saveState() {
        try {
            const state = {
                accountsPayable: ERP.accountsPayable, accountsReceivable: ERP.accountsReceivable,
                vendors: ERP.vendors, inventory: ERP.inventory, employees: ERP.employees,
                crmLeads: ERP.crmLeads, crmTasks: ERP.crmTasks, projects: ERP.projects,
                purchaseOrders: ERP.purchaseOrders, contracts: ERP.contracts,
                kanbanBoards: ERP.kanbanBoards, activeBoardId: ERP.activeBoardId,
                users: ERP.users, notifications: ERP.notifications,
                chatChannels: ERP.chatChannels, chatMessages: ERP.chatMessages,
                documents: ERP.documents, emails: ERP.emails, calendarEvents: ERP.calendarEvents,
                workflowRequests: ERP.workflowRequests, settings: ERP.settings,
                favorites: ERP.favorites
            };
            localStorage.setItem('abo_erp_state', JSON.stringify(state));
        } catch (err) { console.warn('Save state failed', err); }
    },

    loadState() {
        try {
            const saved = localStorage.getItem('abo_erp_state');
            if (!saved) return;
            const state = JSON.parse(saved);
            Object.keys(state).forEach(k => { ERP[k] = state[k]; });
        } catch (err) { console.warn('Load state failed', err); }
    },

    resetState() {
        localStorage.removeItem('abo_erp_state');
        this.toast('State reset. Reloading...', 'info');
        setTimeout(() => location.reload(), 800);
    },

    // ============ FAVORITES ============
    toggleFavorite(moduleId, event) {
        event.stopPropagation();
        ERP.favorites = ERP.favorites || [];
        const idx = ERP.favorites.indexOf(moduleId);
        if (idx >= 0) ERP.favorites.splice(idx, 1);
        else ERP.favorites.push(moduleId);
        this.saveState();
        this.renderSidebar();
    },

    // ============ COMMAND PALETTE ============
    openCommandPalette() {
        if (document.getElementById('cmdOverlay')) return;
        const allModules = NAV.flatMap(g => g.items);
        const overlay = document.createElement('div');
        overlay.id = 'cmdOverlay';
        overlay.className = 'cmd-overlay';
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        overlay.innerHTML = `
            <div class="cmd-palette">
                <input id="cmdInput" class="cmd-input" placeholder="Type a command or search modules..." autofocus>
                <div class="cmd-results" id="cmdResults">
                    <div class="cmd-section-label">Pages</div>
                    ${allModules.map(m => `
                        <div class="cmd-item" onclick="App.navigateTo('${m.id}'); document.getElementById('cmdOverlay').remove();">
                            <span>${this.icon(m.icon)}</span>
                            <span>${m.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        document.body.appendChild(overlay);
        const input = document.getElementById('cmdInput');
        input.focus();
        input.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allModules.filter(m => m.label.toLowerCase().includes(term) || m.id.toLowerCase().includes(term));
            document.getElementById('cmdResults').innerHTML = `
                <div class="cmd-section-label">Results (${filtered.length})</div>
                ${filtered.slice(0, 8).map(m => `
                    <div class="cmd-item" onclick="App.navigateTo('${m.id}'); document.getElementById('cmdOverlay').remove();">
                        <span>${this.icon(m.icon)}</span>
                        <span>${m.label}</span>
                    </div>
                `).join('') || '<div class="cmd-item">No results</div>'}
            `;
        };
    },

    // ============ KEYBOARD ============
    initKeyboard() {
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.openCommandPalette();
            }
            if (e.key === 'Escape') {
                document.getElementById('cmdOverlay')?.remove();
                this.closeModal();
            }
            if (e.key === '?' && !e.target.matches('input, textarea, select')) {
                this.showShortcuts();
            }
        });
    },

    showShortcuts() {
        this.openModal('Keyboard Shortcuts', `
            <div class="space-y-2 text-sm">
                <div class="flex justify-between py-2 border-b border-gray-50"><span>Command palette</span><kbd class="text-xs bg-gray-100 px-2 py-1 rounded">⌘ K</kbd></div>
                <div class="flex justify-between py-2 border-b border-gray-50"><span>Close modal</span><kbd class="text-xs bg-gray-100 px-2 py-1 rounded">Esc</kbd></div>
                <div class="flex justify-between py-2 border-b border-gray-50"><span>Show shortcuts</span><kbd class="text-xs bg-gray-100 px-2 py-1 rounded">?</kbd></div>
            </div>
        `, 'sm');
    },

    // ============ ROLE ============
    switchRole(role) {
        ERP.currentUser.role = role;
        this.saveState();
        this.toast(`Switched to ${role} role`, 'success');
        const roleEl = document.getElementById('roleBadge');
        if (roleEl) roleEl.textContent = role;
        this.navigateTo(this.currentModule);
    },

    // ============ NOTIFICATIONS ============
    renderNotifications() {
        const list = document.getElementById('notifList');
        if (!list) return;
        const typeColor = { success: 'bg-green-500', warning: 'bg-amber-500', danger: 'bg-red-500', info: 'bg-blue-500' };
        const items = ERP.notifications || [];
        if (items.length === 0) {
            list.innerHTML = '<p class="p-4 text-sm text-gray-400 text-center">No notifications</p>';
            return;
        }
        list.innerHTML = items.map(n => `
            <div class="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex items-start gap-3" onclick="App.markNotificationRead(${n.id})">
                <div class="w-2 h-2 rounded-full mt-1.5 ${typeColor[n.type] || 'bg-gray-400'}"></div>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">${n.text || n.title || ''}</p>
                    <p class="text-xs text-gray-400 mt-1">${n.time || (n.createdAt ? App.timeAgo(n.createdAt) : '')}</p>
                </div>
                ${n.unread ? '<div class="w-2 h-2 bg-brand-brown rounded-full mt-1.5"></div>' : ''}
            </div>
        `).join('');
    },

    markAllRead() {
        (ERP.notifications || []).forEach(n => n.unread = false);
        this.renderNotifications();
        const dot = document.getElementById('notifDot');
        if (dot) dot.style.display = 'none';
        this.saveState();
        this.toast('All notifications marked as read', 'success');
    },

    markNotificationRead(id) {
        const n = (ERP.notifications || []).find(x => x.id == id);
        if (n) {
            n.unread = false;
            this.renderNotifications();
            if (!ERP.notifications.some(x => x.unread)) {
                const dot = document.getElementById('notifDot');
                if (dot) dot.style.display = 'none';
            }
            this.saveState();
        }
    },

    // ============ NAVIGATION ============
    currentModule: 'dashboard',
    collapsedSections: {},

    toggleSection(section) {
        this.collapsedSections[section] = !this.collapsedSections[section];
        this.renderSidebar();
    },

    renderSidebar() {
        const sidebarNav = document.getElementById('sidebarNav');
        if (!sidebarNav) return;
        ERP.favorites = ERP.favorites || [];
        sidebarNav.innerHTML = NAV.map(g => {
            const collapsed = this.collapsedSections[g.section];
            return `
                <div class="nav-section ${collapsed ? 'collapsed' : ''}">
                    <p class="nav-section-title nav-section-header" onclick="App.toggleSection('${g.section}')">
                        <span>${g.section}</span>
                        <span class="chevron">▾</span>
                    </p>
                    <div class="nav-section-items">
                        ${g.items.map(i => `
                            <a href="#" class="nav-link ${ERP.favorites.includes(i.id) ? 'favorite' : ''}" data-module="${i.id}" onclick="event.preventDefault(); App.navigateTo('${i.id}')">
                                ${this.icon(i.icon)} ${i.label}
                                ${i.external ? '<svg class="w-3 h-3 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' : ''}
                                <span class="fav-btn ${ERP.favorites.includes(i.id) ? 'active' : ''}" onclick="App.toggleFavorite('${i.id}', event)">★</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    navigateTo(module) {
        // Handle external link items
        const allItems = NAV.flatMap(g => g.items);
        const navItem = allItems.find(i => i.id === module);
        if (navItem && navItem.external) {
            window.open(navItem.external, '_blank');
            return;
        }
        
        this.currentModule = module;
        const view = Views[module];
        if (!view) { console.warn('No view for ' + module); return; }
        const meta = META[module] || ['Dashboard', ''];
        document.getElementById('pageTitle').textContent = meta[0];
        document.getElementById('pageSubtitle').textContent = meta[1];
        document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.module === module));
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = view();
        contentArea.classList.remove('content-enter');
        void contentArea.offsetWidth;
        contentArea.classList.add('content-enter');
        contentArea.querySelectorAll('[data-module]').forEach(el => {
            el.addEventListener('click', () => this.navigateTo(el.dataset.module));
        });
        if (window.innerWidth < 1024) document.getElementById('sidebar').classList.add('-translate-x-full');
    }
};

// ============================================================
// NAVIGATION CONFIG - With Supplier Portal
// ============================================================
const NAV = [
    { section: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'home' }] },
    { section: 'Collaboration', items: [
        { id: 'chat', label: 'Team Chat', icon: 'chat' },
        { id: 'email', label: 'Email', icon: 'mail' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar' },
        { id: 'documents', label: 'Documents', icon: 'folder' }
    ]},
    { section: 'Financial', items: [
        { id: 'gl', label: 'General Ledger', icon: 'book' },
        { id: 'ap', label: 'Accounts Payable', icon: 'arrow-up' },
        { id: 'ar', label: 'Accounts Receivable', icon: 'arrow-down' },
        { id: 'budgets', label: 'Budgets', icon: 'chart' },
        { id: 'cashflow', label: 'Cash Flow', icon: 'trending' }
    ]},
    { section: 'Operations', items: [
        { id: 'inventory', label: 'Inventory', icon: 'box' },
        { id: 'warehouses', label: 'Warehouses', icon: 'building' },
        { id: 'production', label: 'Production', icon: 'factory' },
        { id: 'quality', label: 'Quality Control', icon: 'shield' }
    ]},
    { section: 'Procurement', items: [
        { id: 'vendors', label: 'Vendors', icon: 'users' },
        { id: 'purchaseorders', label: 'Purchase Orders', icon: 'cart' },
        { id: 'contracts', label: 'Contracts & SLA', icon: 'file' },
        { id: 'contingent', label: 'Contingent Workforce', icon: 'briefcase' }
    ]},
    { section: 'People', items: [
        { id: 'employees', label: 'Employees', icon: 'users' },
        { id: 'payroll', label: 'Payroll', icon: 'money' },
        { id: 'attendance', label: 'Attendance', icon: 'calendar' },
        { id: 'recruitment', label: 'Recruitment', icon: 'search' },
        { id: 'performance', label: 'Performance', icon: 'star' },
        { id: 'training', label: 'Training', icon: 'book' }
    ]},
    { section: 'Sales & CRM', items: [
        { id: 'contacts', label: 'Contacts', icon: 'users' },
        { id: 'leads', label: 'Pipeline & Leads', icon: 'trending' },
        { id: 'tasks', label: 'Tasks', icon: 'check' }
    ]},
    { section: 'Projects', items: [
        { id: 'projects', label: 'All Projects', icon: 'layers' },
        { id: 'milestones', label: 'Milestones', icon: 'flag' },
        { id: 'kanban', label: 'Kanban Board', icon: 'layers' }
    ]},
    { section: 'Workflow', items: [
        { id: 'workflow', label: 'Approvals', icon: 'workflow' },
        { id: 'reports', label: 'Reports & BI', icon: 'report' }
    ]},
    { section: 'System', items: [
        { id: 'automation', label: 'Automation', icon: 'zap' },
        { id: 'audit', label: 'Audit Logs', icon: 'shield' },
        { id: 'users', label: 'User Management', icon: 'users' },
        { id: 'profile', label: 'My Profile', icon: 'users' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
    ]},
    { section: 'Procurement Workspace', items: [
        { id: 'procurementVendors', label: 'Vendor Management', icon: 'briefcase' },
        { id: 'procurementRfq', label: 'RFQ & Sourcing', icon: 'cart' }
    ]},
    { section: 'Supplier Portal', items: [
        { id: 'portal', label: 'Open Supplier Connect →', icon: 'users', external: '../supplier-portal/index.html' }
    ]}
];

const META = {
    dashboard: ['Dashboard', 'Real-time enterprise overview'],
    chat: ['Team Chat', 'Real-time messaging'],
    email: ['Email', 'Inbox & compose'],
    calendar: ['Calendar', 'Events & deadlines'],
    documents: ['Documents', 'Files & contracts'],
    gl: ['General Ledger', 'Chart of accounts'],
    ap: ['Accounts Payable', 'Vendor invoices'],
    ar: ['Accounts Receivable', 'Customer invoices'],
    budgets: ['Budgets', 'Departmental allocation'],
    cashflow: ['Cash Flow', 'Forecast & trends'],
    inventory: ['Inventory', 'Stock & warehouses'],
    warehouses: ['Warehouses', 'Facility utilization'],
    production: ['Production', 'Manufacturing'],
    quality: ['Quality Control', 'Inspection'],
    vendors: ['Vendors', 'Procurement'],
    purchaseorders: ['Purchase Orders', 'PO management'],
    contracts: ['Contracts & SLA', 'Compliance'],
    contingent: ['Contingent Workforce', 'Temp staff'],
    employees: ['Employees', 'HR directory'],
    payroll: ['Payroll', 'Salary processing'],
    attendance: ['Attendance', 'Time & leave'],
    recruitment: ['Recruitment', 'Hiring'],
    performance: ['Performance', 'Reviews'],
    training: ['Training', 'Development'],
    contacts: ['Contacts', 'CRM directory'],
    leads: ['Pipeline', 'Sales tracking'],
    tasks: ['Tasks', 'Reminders'],
    projects: ['Projects', 'Tracking'],
    milestones: ['Milestones', 'Deliverables'],
    kanban: ['Kanban Board', 'Drag & drop tasks'],
    workflow: ['Approvals', 'Pending requests'],
    reports: ['Reports & BI', 'Analytics'],
    automation: ['Automation', 'Workflows'],
    audit: ['Audit Logs', 'Security'],
    users: ['User Management', 'Roles & permissions'],
    profile: ['My Profile', 'Account settings'],
    settings: ['Settings', 'System configuration'],
    procurementVendors: ['Vendor Management', 'Supplier lifecycle, compliance, and performance'],
    procurementRfq: ['RFQ & Sourcing', 'Create opportunities, invite suppliers, manage deadlines']
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    App.loadState();
    const u = ERP.currentUser;
    document.getElementById('userInitials').textContent = u.avatar;
    document.getElementById('topInitials').textContent = u.avatar;
    document.getElementById('userName').textContent = u.name;
    document.getElementById('userRole').textContent = u.role;
    const roleBadge = document.getElementById('roleBadge');
    if (roleBadge) roleBadge.textContent = u.role;

    App.renderSidebar();
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('-translate-x-full');
    });

    App.renderNotifications();
    if (ERP.notifications.some(n => n.unread)) {
        document.getElementById('notifDot').style.display = 'block';
    } else {
        document.getElementById('notifDot').style.display = 'none';
    }

    App.initKeyboard();

    setTimeout(() => App.navigateTo('dashboard'), 0);
});

window.App = App;