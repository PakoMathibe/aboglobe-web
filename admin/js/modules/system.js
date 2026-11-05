// ============================================================
// MODULE: System
// ============================================================

Views.automation = () => h('Process Automation', 'Repetitive workflows running automatically') +
    `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${ERP.automations.map(a => `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 content-enter">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">${i('zap')}</div>
                        <div>
                            <h4 class="font-bold text-brand-dark">${a.name}</h4>
                            <p class="text-xs text-gray-500">${a.description}</p>
                        </div>
                    </div>
                    <span class="badge ${b(a.status)}">${a.status}</span>
                </div>
                <div class="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div><p class="text-[10px] text-gray-500 uppercase">Trigger</p><p class="text-xs font-semibold mt-0.5">${a.trigger}</p></div>
                    <div><p class="text-[10px] text-gray-500 uppercase">Runs (30d)</p><p class="text-xs font-bold text-brand-brown mt-0.5">${a.runsLast30Days}</p></div>
                    <div><p class="text-[10px] text-gray-500 uppercase">Success</p><p class="text-xs font-bold text-green-600 mt-0.5">${a.successRate}%</p></div>
                </div>
            </div>
        `).join('')}
    </div>`;

Views.audit = () => {
    const rows = ERP.auditLogs.map(l => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${l.id}</td>
            <td class="font-semibold">${l.user}</td>
            <td>${l.action}</td>
            <td><span class="badge badge-neutral">${l.module}</span></td>
            <td class="text-xs text-gray-500">${l.timestamp}</td>
            <td><span class="badge badge-${l.type}">${l.type}</span></td>
            <td></td>
        </tr>`);
    return h('Audit Logs', 'Immutable record of all security events') +
        `<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            ${k('Total Events', ERP.auditLogs.length, 'Last 30 days')}
            ${k('Success', ERP.auditLogs.filter(l=>l.type==='success').length)}
            ${k('Warnings', ERP.auditLogs.filter(l=>l.type==='warning').length)}
            ${k('Critical', ERP.auditLogs.filter(l=>l.type==='danger').length, 'Requires review')}
        </div>` +
        t(['Log ID', 'User', 'Action', 'Module', 'Timestamp', 'Type'], rows, { title: 'Security Audit Trail', count: ERP.auditLogs.length });
};