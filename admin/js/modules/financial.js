// ============================================================
// MODULE: Financial Management
// ============================================================

const fmtCurrency = App.fmtCurrency;
const fmtDate = App.fmtDate;
const badgeClass = App.badgeClass;
const kpiCard = App.kpiCard;
const table = App.table;
const header = App.header;
const rowActions = App.rowActions;

// ----- General Ledger -----
Views.gl = () => {
    const rows = ERP.generalLedger.map(g => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-brand-brown font-semibold">${g.id}</td>
            <td class="font-semibold">${g.account}</td>
            <td><span class="badge badge-neutral">${g.type}</span></td>
            <td>${g.debit ? fmtCurrency(g.debit) : '—'}</td>
            <td>${g.credit ? fmtCurrency(g.credit) : '—'}</td>
            <td class="font-bold text-brand-dark">${fmtCurrency(g.balance)}</td>
            <td></td>
        </tr>`);
    const asset = ERP.generalLedger.filter(g=>g.type==='Asset').reduce((s,g)=>s+g.balance,0);
    const liab = ERP.generalLedger.filter(g=>g.type==='Liability').reduce((s,g)=>s+g.balance,0);
    const rev = ERP.generalLedger.filter(g=>g.type==='Income').reduce((s,g)=>s+g.balance,0);
    return header('General Ledger', 'Chart of accounts and real-time balances') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${kpiCard('Total Assets', fmtCurrency(asset))}
            ${kpiCard('Total Liabilities', fmtCurrency(liab))}
            ${kpiCard('Total Revenue', fmtCurrency(rev), '', '+18%')}
        </div>` +
        table(['Account ID', 'Account Name', 'Type', 'Debit', 'Credit', 'Balance'], rows, { title: 'Chart of Accounts', count: ERP.generalLedger.length });
};

// ----- Accounts Payable -----
Views.ap = () => {
    const rows = ERP.accountsPayable.map(a => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${a.id}</td>
            <td class="font-semibold">${a.vendor}</td>
            <td class="font-mono text-xs">${a.invoice}</td>
            <td class="font-bold">${fmtCurrency(a.amount)}</td>
            <td>${fmtDate(a.dueDate)}</td>
            <td><span class="badge ${badgeClass(a.status)}">${a.status}</span></td>
            <td>${rowActions('accountsPayable', a.id)}</td>
        </tr>`);
    const total = ERP.accountsPayable.reduce((s, a) => s + a.amount, 0);
    const overdue = ERP.accountsPayable.filter(a => a.status === 'Overdue').length;
    const paid = ERP.accountsPayable.filter(a => a.status === 'Paid').reduce((s, a) => s + a.amount, 0);
    return header('Accounts Payable', 'Manage vendor invoices and payments') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${kpiCard('Total Payable', fmtCurrency(total), 'All invoices')}
            ${kpiCard('Overdue', overdue, 'Requires attention')}
            ${kpiCard('Paid This Month', fmtCurrency(paid))}
        </div>` +
        table(['ID', 'Vendor', 'Invoice', 'Amount', 'Due Date', 'Status'], rows, { title: 'Accounts Payable', count: ERP.accountsPayable.length, entity: 'accountsPayable' });
};

// ----- Accounts Receivable -----
Views.ar = () => {
    const rows = ERP.accountsReceivable.map(a => `
        <tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${a.id}</td>
            <td class="font-semibold">${a.customer}</td>
            <td class="font-mono text-xs">${a.invoice}</td>
            <td class="font-bold">${fmtCurrency(a.amount)}</td>
            <td>${fmtDate(a.dueDate)}</td>
            <td><span class="badge ${badgeClass(a.status)}">${a.status}</span></td>
            <td>${rowActions('accountsReceivable', a.id)}</td>
        </tr>`);
    const total = ERP.accountsReceivable.reduce((s, a) => s + a.amount, 0);
    const collected = ERP.accountsReceivable.filter(a => a.status === 'Paid').reduce((s, a) => s + a.amount, 0);
    const outstanding = ERP.accountsReceivable.filter(a => a.status !== 'Paid').length;
    return header('Accounts Receivable', 'Track incoming customer payments') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${kpiCard('Total Receivable', fmtCurrency(total))}
            ${kpiCard('Collected', fmtCurrency(collected), '', '+22%')}
            ${kpiCard('Outstanding', outstanding, 'Invoices')}
        </div>` +
        table(['ID', 'Customer', 'Invoice', 'Amount', 'Due Date', 'Status'], rows, { title: 'Accounts Receivable', count: ERP.accountsReceivable.length, entity: 'accountsReceivable' });
};

// ----- Budgets -----
Views.budgets = () => {
    const rows = ERP.budgets.map(b => {
        const pct = Math.round((b.spent / b.allocated) * 100);
        const color = pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-green-500';
        return `<tr>
            <td><input type="checkbox" class="rowCheckbox" onchange="App.updateBulkBar(document.querySelectorAll('#dataTable tbody input:checked').length)"></td>
            <td class="font-mono text-xs text-gray-500">${b.id}</td>
            <td class="font-semibold">${b.department}</td>
            <td>${b.period}</td>
            <td>${fmtCurrency(b.allocated)}</td>
            <td class="font-semibold text-amber-600">${fmtCurrency(b.spent)}</td>
            <td><div class="flex items-center gap-2"><div class="progress-bar w-20"><div class="progress-fill ${color}" style="width:${pct}%"></div></div><span class="text-xs font-bold">${pct}%</span></div></td>
            <td></td>
        </tr>`;
    });
    return header('Budgeting', 'Departmental budget allocation and utilization') +
        table(['ID', 'Department', 'Period', 'Allocated', 'Spent', 'Utilization'], rows, { title: 'Budget Overview', count: ERP.budgets.length });
};

// ----- Cash Flow -----
Views.cashflow = () => {
    const totalIn = ERP.cashFlow.inflow.reduce((a, b) => a + b, 0);
    const totalOut = ERP.cashFlow.outflow.reduce((a, b) => a + b, 0);
    const net = totalIn - totalOut;
    const max = Math.max(...ERP.cashFlow.inflow, ...ERP.cashFlow.outflow);
    return header('Cash Flow Forecasting', '6-month inflow vs outflow analysis') +
        `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${kpiCard('Total Inflow', fmtCurrency(totalIn), '', '+15%')}
            ${kpiCard('Total Outflow', fmtCurrency(totalOut), '', '+8%')}
            ${kpiCard('Net Cash Flow', fmtCurrency(net), 'Positive trend')}
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 content-enter">
            <div class="flex items-end gap-4 h-64 mb-4">
                ${ERP.cashFlow.labels.map((label, i) => {
                    const inH = (ERP.cashFlow.inflow[i] / max) * 100;
                    const outH = (ERP.cashFlow.outflow[i] / max) * 100;
                    return `<div class="flex-1 flex flex-col items-center gap-2">
                        <div class="flex gap-1 items-end w-full justify-center h-full">
                            <div class="w-2/5 bg-brand-gold rounded-t chart-bar" style="height:${inH}%"></div>
                            <div class="w-2/5 bg-brand-brown rounded-t chart-bar" style="height:${outH}%"></div>
                        </div>
                        <span class="text-[11px] font-semibold text-gray-500">${label}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
};