// ============================================================
// MODULE: CRM
// ============================================================

Views.contacts = () => {
    const rows = ERP.crmContacts.map(x => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${x.id}</td>
            <td class="font-semibold">${x.name}</td>
            <td>${x.company}</td>
            <td>${x.email}</td>
            <td>${x.phone}</td>
            <td>${d(x.lastContact)}</td>
            <td><span class="badge ${b(x.status)}">${x.status}</span></td>
            <td></td>
        </tr>`);
    return h('Contacts & Organizations', 'Customer profiles and communication history') +
        t(['ID', 'Name', 'Company', 'Email', 'Phone', 'Last Contact', 'Status'], rows, { title: 'CRM Contacts', count: ERP.crmContacts.length });
};

Views.leads = () => {
    const rows = ERP.crmLeads.map(l => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${l.id}</td>
            <td class="font-semibold">${l.company}</td>
            <td>${l.contact}</td>
            <td class="font-bold">${c(l.value)}</td>
            <td><span class="badge ${b(l.stage)}">${l.stage}</span></td>
            <td><div class="flex items-center gap-2"><div class="progress-bar w-16"><div class="progress-fill bg-brand-gold" style="width:${l.probability}%"></div></div><span class="text-xs font-bold">${l.probability}%</span></div></td>
            <td>${l.assignedTo}</td>
            <td>${ra('crmLeads', l.id)}</td>
        </tr>`);
    const pipeline = ERP.crmLeads.reduce((s,l)=>s+l.value,0);
    return h('Lead & Pipeline Tracking', 'Monitor deals across sales stages') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${k('Total Pipeline', c(pipeline), '', '+25%')}
            ${k('Active Leads', ERP.crmLeads.filter(l=>l.stage!=='Closed Won').length)}
            ${k('Won Deals', ERP.crmLeads.filter(l=>l.stage==='Closed Won').length)}
        </div>` +
        t(['ID', 'Company', 'Contact', 'Value', 'Stage', 'Probability', 'Owner'], rows, { title: 'Sales Pipeline', count: ERP.crmLeads.length, entity: 'crmLeads' });
};

Views.tasks = () => {
    const rows = ERP.crmTasks.map(x => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${x.id}</td>
            <td class="font-semibold">${x.title}</td>
            <td>${x.assignedTo}</td>
            <td>${d(x.dueDate)}</td>
            <td><span class="badge ${b(x.priority)}">${x.priority}</span></td>
            <td><span class="badge ${b(x.status)}">${x.status}</span></td>
            <td>${ra('crmTasks', x.id)}</td>
        </tr>`);
    return h('Task & Calendar', 'Follow-ups, reminders, and assignments') +
        t(['ID', 'Task', 'Assigned To', 'Due Date', 'Priority', 'Status'], rows, { title: 'CRM Tasks', count: ERP.crmTasks.length, entity: 'crmTasks' });
};