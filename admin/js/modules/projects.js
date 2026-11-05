// ============================================================
// MODULE: Projects
// ============================================================

Views.projects = () => {
    const rows = ERP.projects.map(p => {
        const color = p.progress === 100 ? 'bg-green-500' : 'bg-brand-brown';
        return `<tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${p.id}</td>
            <td class="font-semibold">${p.name}</td>
            <td><div class="flex items-center gap-2"><div class="progress-bar w-24"><div class="progress-fill ${color}" style="width:${p.progress}%"></div></div><span class="text-xs font-bold">${p.progress}%</span></div></td>
            <td>${c(p.budget)}</td>
            <td class="text-amber-600 font-semibold">${c(p.spent)}</td>
            <td>${d(p.deadline)}</td>
            <td><span class="badge ${b(p.status)}">${p.status}</span></td>
            <td>${ra('projects', p.id)}</td>
        </tr>`;
    });
    return h('Project Management', 'Resource allocation and milestone tracking') +
        t(['ID', 'Project', 'Progress', 'Budget', 'Spent', 'Deadline', 'Status'], rows, { title: 'Active Projects', count: ERP.projects.length, entity: 'projects' });
};

Views.milestones = () => {
    const rows = ERP.milestones.map(m => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${m.id}</td>
            <td class="font-semibold">${m.project}</td>
            <td>${m.title}</td>
            <td>${d(m.dueDate)}</td>
            <td><span class="badge ${b(m.status)}">${m.status}</span></td>
            <td></td>
        </tr>`);
    return h('Milestones', 'Key project deliverables and deadlines') +
        t(['ID', 'Project', 'Milestone', 'Due Date', 'Status'], rows, { title: 'Project Milestones', count: ERP.milestones.length });
};