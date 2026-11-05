// ============================================================
// MODULE: People
// ============================================================

Views.employees = () => {
    const rows = ERP.employees.map(e => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${e.id}</td>
            <td class="font-semibold flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-brand-cream text-brand-brown flex items-center justify-center text-[10px] font-bold">${e.name.split(' ').map(n=>n[0]).join('')}</div>
                ${e.name}
            </td>
            <td>${e.department}</td>
            <td><span class="badge badge-neutral">${e.role}</span></td>
            <td>${c(e.salary)}</td>
            <td>${d(e.joinDate)}</td>
            <td><span class="badge ${b(e.status)}">${e.status}</span></td>
            <td>${ra('employees', e.id)}</td>
        </tr>`);
    return h('Employee Management', 'Complete employee directory and records') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${k('Total Employees', ERP.employees.length)}
            ${k('Active', ERP.employees.filter(e=>e.status==='Active').length)}
            ${k('Total Payroll', c(ERP.employees.reduce((s,e)=>s+e.salary,0)), 'Annual')}
        </div>` +
        t(['ID', 'Employee', 'Department', 'Role', 'Salary', 'Joined', 'Status'], rows, { title: 'Employee Directory', count: ERP.employees.length, entity: 'employees' });
};

Views.payroll = () => {
    const rows = ERP.payroll.map(p => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${p.period}</td>
            <td class="font-semibold">${p.employee}</td>
            <td>${c(p.gross)}</td>
            <td class="text-red-600">${c(p.deductions)}</td>
            <td class="font-bold text-green-600">${c(p.net)}</td>
            <td><span class="badge ${b(p.status)}">${p.status}</span></td>
            <td class="text-right">
                ${p.status === 'Pending' 
                    ? `<button onclick="App.processPayroll('${p.employee}')" class="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700">Pay Now</button>`
                    : `<span class="text-xs text-green-600 font-semibold">✓ Done</span>`
                }
            </td>
        </tr>`);
    return h('Payroll Management', 'Automated salary processing') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${k('Gross Payroll', c(ERP.payroll.reduce((s,p)=>s+p.gross,0)))}
            ${k('Deductions', c(ERP.payroll.reduce((s,p)=>s+p.deductions,0)), 'Taxes & benefits')}
            ${k('Net Payroll', c(ERP.payroll.reduce((s,p)=>s+p.net,0)), 'This cycle')}
        </div>` +
        t(['Period', 'Employee', 'Gross', 'Deductions', 'Net', 'Status'], rows, { title: 'Payroll Records', count: ERP.payroll.length });
};

Views.attendance = () => {
    const rows = ERP.attendance.map(a => {
        const total = a.present + a.absent + a.leave;
        const pct = Math.round((a.present / total) * 100);
        return `<tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-semibold">${a.employee}</td>
            <td class="text-green-600 font-semibold">${a.present}</td>
            <td class="text-red-600 font-semibold">${a.absent}</td>
            <td class="text-amber-600 font-semibold">${a.leave}</td>
            <td>${a.overtime} hrs</td>
            <td><div class="flex items-center gap-2"><div class="progress-bar w-16"><div class="progress-fill bg-green-500" style="width:${pct}%"></div></div><span class="text-xs font-bold">${pct}%</span></div></td>
            <td></td>
        </tr>`;
    });
    return h('Attendance & Leave', 'Track daily attendance and leave management') +
        t(['Employee', 'Present', 'Absent', 'Leave', 'Overtime', 'Rate'], rows, { title: 'Attendance Records', count: ERP.attendance.length });
};

Views.recruitment = () => {
    const rows = ERP.recruitment.map(r => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${r.id}</td>
            <td class="font-semibold">${r.position}</td>
            <td>${r.department}</td>
            <td>${r.candidates}</td>
            <td>${r.shortlisted}</td>
            <td>${r.interviews}</td>
            <td><span class="badge ${b(r.status)}">${r.status}</span></td>
            <td></td>
        </tr>`);
    return h('Recruitment', 'Job postings, candidates, and interview pipeline') +
        t(['ID', 'Position', 'Department', 'Candidates', 'Shortlisted', 'Interviews', 'Status'], rows, { title: 'Open Positions', count: ERP.recruitment.length });
};

Views.performance = () => {
    const rows = ERP.performanceReviews.map(p => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-semibold">${p.employee}</td>
            <td>${p.period}</td>
            <td class="font-bold text-brand-gold">★ ${p.score}</td>
            <td><div class="flex items-center gap-2"><div class="progress-bar w-16"><div class="progress-fill bg-brand-gold" style="width:${p.goalsMet}%"></div></div><span class="text-xs font-bold">${p.goalsMet}%</span></div></td>
            <td>${p.reviewer}</td>
            <td></td>
        </tr>`);
    return h('Performance Management', 'Goal tracking, feedback, and appraisals') +
        t(['Employee', 'Period', 'Score', 'Goals Met', 'Reviewer'], rows, { title: 'Performance Reviews', count: ERP.performanceReviews.length });
};

Views.training = () => {
    const rows = ERP.training.map(x => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${x.id}</td>
            <td class="font-semibold">${x.program}</td>
            <td>${x.employee}</td>
            <td><div class="flex items-center gap-2"><div class="progress-bar w-20"><div class="progress-fill ${x.progress===100?'bg-green-500':'bg-brand-gold'}" style="width:${x.progress}%"></div></div><span class="text-xs font-bold">${x.progress}%</span></div></td>
            <td>${d(x.dueDate)}</td>
            <td><span class="badge ${b(x.status)}">${x.status}</span></td>
            <td></td>
        </tr>`);
    return h('Training & Development', 'Employee upskilling and certifications') +
        t(['ID', 'Program', 'Employee', 'Progress', 'Due Date', 'Status'], rows, { title: 'Training Programs', count: ERP.training.length });
};