// ============================================================
// MODULE: Workflow & Approvals
// ============================================================

Views.workflow = () => {
    const pending = ERP.workflowRequests.filter(r => r.status === 'Pending');
    const approved = ERP.workflowRequests.filter(r => r.status === 'Approved');
    const rejected = ERP.workflowRequests.filter(r => r.status === 'Rejected');

    const rowHtml = (r, showActions = true) => `
        <tr>
            <td class="font-mono text-xs text-gray-500">${r.id}</td>
            <td><span class="badge badge-info">${r.type}</span></td>
            <td class="font-semibold">${r.reference}</td>
            <td>${r.requester}</td>
            <td class="font-bold">${r.amount ? App.fmtCurrency(r.amount) : '—'}</td>
            <td class="text-xs text-gray-500">${r.submittedAt}</td>
            <td><span class="badge ${App.badgeClass(r.status)}">${r.status}</span></td>
            <td class="text-right">
                ${showActions ? `
                    <div class="flex gap-1 justify-end">
                        <button onclick="App.approveRequest('${r.id}')" class="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700">Approve</button>
                        <button onclick="App.rejectRequest('${r.id}')" class="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded hover:bg-red-600">Reject</button>
                    </div>
                ` : ''}
            </td>
        </tr>`;

    return App.header('Workflow & Approvals', 'Pending requests require your action') +
    `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        ${App.kpiCard('Pending', pending.length, 'Needs approval')}
        ${App.kpiCard('Approved', approved.length, 'This period')}
        ${App.kpiCard('Rejected', rejected.length, 'This period')}
    </div>
    
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden content-enter mb-6">
        <div class="p-6 border-b border-gray-100">
            <h3 class="font-bold text-brand-dark">Pending Requests</h3>
            <p class="text-xs text-gray-500 mt-0.5">${pending.length} awaiting your decision</p>
        </div>
        <div class="overflow-x-auto">
            <table class="data-table w-full">
                <thead><tr><th>ID</th><th>Type</th><th>Reference</th><th>Requester</th><th>Amount</th><th>Submitted</th><th>Status</th><th class="text-right">Actions</th></tr></thead>
                <tbody>${pending.map(r => rowHtml(r, true)).join('') || '<tr><td colspan="8" class="text-center py-8 text-gray-400">No pending requests 🎉</td></tr>'}</tbody>
            </table>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden content-enter">
        <div class="p-6 border-b border-gray-100"><h3 class="font-bold text-brand-dark">Recent Decisions</h3></div>
        <div class="overflow-x-auto">
            <table class="data-table w-full">
                <thead><tr><th>ID</th><th>Type</th><th>Reference</th><th>Requester</th><th>Amount</th><th>Submitted</th><th>Status</th><th></th></tr></thead>
                <tbody>${[...approved, ...rejected].map(r => rowHtml(r, false)).join('') || '<tr><td colspan="8" class="text-center py-8 text-gray-400">No decisions yet</td></tr>'}</tbody>
            </table>
        </div>
    </div>`;
};