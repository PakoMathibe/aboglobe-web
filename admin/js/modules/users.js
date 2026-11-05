// ============================================================
// MODULE: User Management
// ============================================================

Views.users = () => {
    const users = ERP.users || [];
    const rows = users.map(u => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${u.id}</td>
            <td class="font-semibold flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-brand-cream text-brand-brown flex items-center justify-center text-[10px] font-bold">
                    ${u.name.split(' ').map(n=>n[0]).join('')}
                </div>
                ${u.name}
            </td>
            <td>${u.email}</td>
            <td><span class="badge badge-info">${u.role}</span></td>
            <td>${u.mfa === 'Yes' ? '🔐 Enabled' : '⚠️ Disabled'}</td>
            <td><span class="badge ${b(u.status)}">${u.status}</span></td>
            <td>${ra('users', u.id)}</td>
        </tr>`);
    const stats = {
        Admin: users.filter(u => u.role === 'Admin').length,
        Editor: users.filter(u => u.role === 'Editor').length,
        Viewer: users.filter(u => u.role === 'Viewer').length,
        Finance: users.filter(u => u.role === 'Finance').length,
        HR: users.filter(u => u.role === 'HR').length
    };
    return h('User Management', 'Manage accounts, roles, and permissions', `
        <button onclick="App.openCreateModal('users')" class="px-4 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">+ Invite User</button>
    `) +
    `<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        ${Object.entries(stats).map(([role, count]) => `
            <div class="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <p class="text-2xl font-bold text-brand-dark">${count}</p>
                <p class="text-[11px] font-semibold text-gray-500 uppercase">${role}</p>
            </div>
        `).join('')}
    </div>` +
    t(['ID', 'User', 'Email', 'Role', 'MFA', 'Status'], rows, { title: 'All Users', count: users.length, entity: 'users' });
};