// ============================================================
// PROCUREMENT - INVOICE MATCHING
// ============================================================

(function() {
    'use strict';
    
    if (!window.Procurement) {
        console.error('[Invoice] Procurement not loaded');
        return;
    }
    if (typeof window.Views === 'undefined') {
        console.error('[Invoice] Views not defined');
        return;
    }
    
    const P = window.Procurement;
    const esc = P.escapeHtml;
    
    // ============================================================
    // INIT
    // ============================================================
    function initInvoiceModule() {
        if (!P.data) { P.init(); }
        if (!P.data) { setTimeout(initInvoiceModule, 100); return; }
        
        if (!P.data.invoices) P.data.invoices = [];
        if (!P.data.invoiceMatches) P.data.invoiceMatches = [];
        if (!P.data.invoiceExceptions) P.data.invoiceExceptions = [];
        
        if (!P.data.invoiceConfig) {
            P.data.invoiceConfig = {
                priceTolerancePct: 1,
                quantityTolerance: 0,
                totalToleranceZAR: 1.00
            };
        }
        
        seedInvoices();
        
        window.Views.procurementInvoice = function() {
            return renderInvoiceDashboard();
        };
        
        console.log('[Invoice] Module ready -', (P.data.invoices || []).length, 'invoices');
    }
    
    if (P.initialized && P.data) {
        initInvoiceModule();
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initInvoiceModule, 50));
    }
    
    // ============================================================
    // SEED
    // ============================================================
    function seedInvoices() {
        if (P.data.invoices.length > 0) return;
        
        // Invoice for PO-2026-0002 (partially received) - should have quantity mismatch
        const po2 = (P.data.purchaseOrders || []).find(p => p.id === 'PO-2026-0002');
        if (po2) {
            P.data.invoices.push({
                id: 'INV-2026-0001',
                supplierInvoiceNumber: 'MER-INV-1042',
                poId: 'PO-2026-0002',
                vendorId: 'VEN-0001',
                invoiceDate: '2026-10-26',
                receivedDate: '2026-10-26',
                dueDate: '2026-11-25',
                currency: 'ZAR',
                lineItems: [
                    { line: 1, description: '48-port managed switch', qty: 4, uom: 'units', unitPrice: 35000 },
                    { line: 2, description: 'SFP+ 10G transceiver', qty: 8, uom: 'units', unitPrice: 2500 }
                ],
                subtotal: 160000,
                tax: 24000,
                total: 184000,
                matchingStatus: 'pending',
                approvalStatus: 'pending',
                paymentStatus: 'not_scheduled',
                createdAt: '2026-10-26T10:00:00+02:00'
            });
        }
        
        // Invoice for PO-2026-0003 (partially received, over-billing scenario)
        const po3 = (P.data.purchaseOrders || []).find(p => p.id === 'PO-2026-0003');
        if (po3) {
            P.data.invoices.push({
                id: 'INV-2026-0002',
                supplierInvoiceNumber: 'BAFM-INV-088',
                poId: 'PO-2026-0003',
                vendorId: 'VEN-0005',
                invoiceDate: '2026-10-18',
                receivedDate: '2026-10-18',
                dueDate: '2026-11-17',
                currency: 'ZAR',
                lineItems: [
                    { line: 1, description: 'Monthly deep clean - HQ', qty: 3, uom: 'months', unitPrice: 45000 },
                    { line: 2, description: 'HVAC quarterly maintenance', qty: 1, uom: 'service', unitPrice: 28000 }
                ],
                subtotal: 163000,
                tax: 24450,
                total: 187450,
                matchingStatus: 'pending',
                approvalStatus: 'pending',
                paymentStatus: 'not_scheduled',
                createdAt: '2026-10-18T14:00:00+02:00'
            });
        }
        
        P.save();
    }
    
    // ============================================================
    // DASHBOARD
    // ============================================================
    function renderInvoiceDashboard() {
        const invoices = P.data.invoices || [];
        const exceptions = P.data.invoiceExceptions || [];
        
        const stats = {
            total: invoices.length,
            matched: invoices.filter(i => i.matchingStatus === 'matched' || i.matchingStatus === 'matched_within_tolerance').length,
            exceptions: invoices.filter(i => i.matchingStatus === 'exception').length,
            pending: invoices.filter(i => i.approvalStatus === 'pending' && i.matchingStatus !== 'exception').length,
            paid: invoices.filter(i => i.paymentStatus === 'paid_simulated').length,
            totalValue: invoices.reduce((s, i) => s + (i.total || 0), 0)
        };
        
        return `
            <div class="proc-dashboard-page">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 800; color: var(--proc-text); margin-bottom: 4px;">Invoice Matching</h2>
                        <p style="font-size: 14px; color: var(--proc-text-muted);">3-way match PO ↔ Receipt ↔ Invoice · Manage exceptions · Track payments</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="proc-btn proc-btn-secondary" onclick="ProcurementInvoice.exportCSV()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Export
                        </button>
                        <button class="proc-btn proc-btn-primary" onclick="ProcurementInvoice.openCreateModal()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Capture Invoice
                        </button>
                    </div>
                </div>
                
                <div class="proc-dashboard">
                    ${kpi('Total Invoices', stats.total, 'All time', 'primary')}
                    ${kpi('Matched', stats.matched, 'Ready for approval', 'success')}
                    ${kpi('Exceptions', stats.exceptions, 'Needs action', 'danger')}
                    ${kpi('Pending Approval', stats.pending, 'Awaiting review', 'warning')}
                    ${kpi('Simulated Paid', stats.paid, 'Marked paid', 'success')}
                </div>
                
                <div class="proc-register" style="margin-top: 24px;">
                    <div class="proc-register-toolbar">
                        <h3 style="font-weight: 700; font-size: 15px;">Invoice Register</h3>
                        <div class="proc-filter-row" style="flex: none;">
                            <input type="text" placeholder="Search invoices..." 
                                class="proc-search-input" 
                                style="padding: 8px 12px; border: 1px solid var(--proc-border); border-radius: 8px; font-size: 13px; width: 240px;"
                                oninput="ProcurementInvoice.filter(this.value)">
                        </div>
                    </div>
                    
                    ${invoices.length === 0 ? `
                        <div class="proc-empty">
                            <div class="proc-empty-icon">📄</div>
                            <h3>No invoices</h3>
                            <p>Capture an invoice or submit from the supplier portal.</p>
                        </div>
                    ` : `
                        <div style="overflow-x: auto;">
                            <table class="proc-table" id="invoiceTable">
                                <thead>
                                    <tr>
                                        <th>Invoice #</th>
                                        <th>Supplier</th>
                                        <th>PO</th>
                                        <th>Date</th>
                                        <th style="text-align: right;">Amount</th>
                                        <th>Match</th>
                                        <th>Approval</th>
                                        <th>Payment</th>
                                        <th style="text-align: right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${invoices.map(inv => renderInvoiceRow(inv)).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
    
    function kpi(label, value, sub, variant) {
        return `
            <div class="proc-kpi kpi-${variant}">
                <div class="proc-kpi-label">${label}</div>
                <div class="proc-kpi-value">${value}</div>
                <div class="proc-kpi-sub">${sub}</div>
            </div>
        `;
    }
    
    function renderInvoiceRow(inv) {
        const supplier = getSupplier(inv.vendorId);
        
        return `
            <tr onclick="ProcurementInvoice.openInvoice('${inv.id}')">
                <td>
                    <div style="font-family: monospace; font-weight: 700; color: var(--proc-primary); font-size: 12px;">${esc(inv.id)}</div>
                    <div style="font-size: 11px; color: var(--proc-text-muted);">${esc(inv.supplierInvoiceNumber)}</div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="vendor-avatar" style="background: ${getAvatarColor(supplier?.tradingName || '?')}; width: 28px; height: 28px; font-size: 10px;">${getInitials(supplier?.tradingName || '?')}</div>
                        <div style="font-weight: 600; font-size: 13px;">${esc(supplier?.tradingName || inv.vendorId)}</div>
                    </div>
                </td>
                <td><span style="font-family: monospace; font-size: 12px;">${esc(inv.poId || '—')}</span></td>
                <td style="font-size: 12px;">${P.formatDate(inv.invoiceDate)}</td>
                <td style="font-weight: 700; text-align: right;">${P.formatZAR(inv.total)}</td>
                <td>${matchBadge(inv.matchingStatus)}</td>
                <td>${approvalBadge(inv.approvalStatus)}</td>
                <td>${paymentBadge(inv.paymentStatus)}</td>
                <td style="text-align: right;" onclick="event.stopPropagation()">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementInvoice.openInvoice('${inv.id}')">View →</button>
                </td>
            </tr>
        `;
    }
    
    function matchBadge(s) {
        const map = {
            pending: { c: 'neutral', l: 'Not Matched' },
            matched: { c: 'success', l: 'Matched' },
            matched_within_tolerance: { c: 'success', l: 'Matched (Tol.)' },
            exception: { c: 'danger', l: 'Exception' },
            manually_approved: { c: 'warning', l: 'Approved' }
        };
        const m = map[s] || { c: 'neutral', l: s };
        return `<span class="proc-badge proc-badge-${m.c}">${m.l}</span>`;
    }
    
    function approvalBadge(s) {
        const map = {
            pending: { c: 'warning', l: 'Pending' },
            approved: { c: 'success', l: 'Approved' },
            rejected: { c: 'danger', l: 'Rejected' }
        };
        const m = map[s] || { c: 'neutral', l: s };
        return `<span class="proc-badge proc-badge-${m.c}">${m.l}</span>`;
    }
    
    function paymentBadge(s) {
        const map = {
            not_scheduled: { c: 'neutral', l: '—' },
            scheduled_simulated: { c: 'info', l: 'Scheduled*' },
            paid_simulated: { c: 'success', l: 'Paid*' }
        };
        const m = map[s] || { c: 'neutral', l: s };
        return `<span class="proc-badge proc-badge-${m.c}">${m.l}</span>`;
    }
    
    function getSupplier(id) {
        return (P.data.suppliers || []).find(s => s.id === id);
    }
    
    function getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    }
    
    function getAvatarColor(name) {
        const colors = ['#8B5E34', '#5C3A21', '#C6A664', '#059669', '#2563EB', '#7C3AED', '#DC2626', '#D97706'];
        let hash = 0;
        for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }
    
    // ============================================================
    // INVOICE DETAIL
    // ============================================================
    let activeInvTab = 'overview';
    
    function renderInvoiceDetail(invId) {
        const inv = (P.data.invoices || []).find(i => i.id === invId);
        if (!inv) return '<div class="proc-empty"><h3>Invoice not found</h3></div>';
        
        const tabs = [
            { id: 'overview', label: 'Overview' },
            { id: 'match', label: '3-Way Match' },
            { id: 'exceptions', label: 'Exceptions' },
            { id: 'activity', label: 'Activity' }
        ];
        
        return `
            <div class="proc-detail-page">
                <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementInvoice.backToDashboard()">
                        ← Back to Invoices
                    </button>
                    <div style="display: flex; gap: 6px;">
                        ${renderInvoiceActions(inv)}
                    </div>
                </div>
                
                <div class="proc-detail-header">
                    <div class="proc-detail-header-inner">
                        <div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                                <span style="font-family: monospace; font-size: 11px; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px;">${esc(inv.id)}</span>
                                ${matchBadge(inv.matchingStatus)}
                                ${approvalBadge(inv.approvalStatus)}
                            </div>
                            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${esc(inv.supplierInvoiceNumber)}</h1>
                            <p style="color: rgba(255,255,255,0.7); font-size: 13px;">
                                ${esc(getSupplier(inv.vendorId)?.tradingName || inv.vendorId)} · ${P.formatZAR(inv.total)} · Due ${P.formatDate(inv.dueDate)}
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Linked PO</div>
                            <div style="font-size: 15px; font-weight: 800; font-family: monospace;">${esc(inv.poId || '—')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="proc-tabs">
                    ${tabs.map(t => `
                        <button class="proc-tab ${activeInvTab === t.id ? 'active' : ''}" 
                            onclick="ProcurementInvoice.switchTab('${t.id}')">${t.label}</button>
                    `).join('')}
                </div>
                
                <div class="proc-tab-content">
                    ${renderInvTab(activeInvTab, inv)}
                </div>
            </div>
        `;
    }
    
    function renderInvoiceActions(inv) {
        const actions = [];
        
        if (inv.matchingStatus === 'pending' || inv.matchingStatus === 'exception') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementInvoice.runMatch('${inv.id}')">${inv.matchingStatus === 'pending' ? 'Run Match' : 'Re-run Match'}</button>`);
        }
        
        if ((inv.matchingStatus === 'matched' || inv.matchingStatus === 'matched_within_tolerance') && inv.approvalStatus === 'pending') {
            actions.push(`<button class="proc-btn proc-btn-success proc-btn-sm" onclick="ProcurementInvoice.approveInvoice('${inv.id}')">Approve</button>`);
            actions.push(`<button class="proc-btn proc-btn-danger proc-btn-sm" onclick="ProcurementInvoice.rejectInvoice('${inv.id}')">Reject</button>`);
        }
        
        if (inv.approvalStatus === 'approved' && inv.paymentStatus === 'not_scheduled') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementInvoice.schedulePayment('${inv.id}')">Schedule Payment (Simulated)</button>`);
        }
        
        if (inv.paymentStatus === 'scheduled_simulated') {
            actions.push(`<button class="proc-btn proc-btn-success proc-btn-sm" onclick="ProcurementInvoice.markPaid('${inv.id}')">Mark Paid (Simulated)</button>`);
        }
        
        return actions.join('');
    }
    
    function renderInvTab(tab, inv) {
        switch (tab) {
            case 'overview': return renderInvOverviewTab(inv);
            case 'match': return renderInvMatchTab(inv);
            case 'exceptions': return renderInvExceptionsTab(inv);
            case 'activity': return renderInvActivityTab(inv);
            default: return renderInvOverviewTab(inv);
        }
    }
    
    function renderInvOverviewTab(inv) {
        return `
            <div class="proc-grid-2">
                <div class="proc-card">
                    <div class="proc-card-title">Invoice Details</div>
                    <div class="proc-field"><span class="proc-field-label">Internal Ref</span><span class="proc-field-value">${esc(inv.id)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Supplier Invoice</span><span class="proc-field-value">${esc(inv.supplierInvoiceNumber)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Linked PO</span><span class="proc-field-value">${esc(inv.poId || '—')}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Invoice Date</span><span class="proc-field-value">${P.formatDate(inv.invoiceDate)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Received</span><span class="proc-field-value">${P.formatDate(inv.receivedDate)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Due Date</span><span class="proc-field-value">${P.formatDate(inv.dueDate)}</span></div>
                </div>
                
                <div class="proc-card">
                    <div class="proc-card-title">Financials</div>
                    <div class="proc-field"><span class="proc-field-label">Subtotal</span><span class="proc-field-value">${P.formatZAR(inv.subtotal)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">VAT (15%)</span><span class="proc-field-value">${P.formatZAR(inv.tax)}</span></div>
                    <div class="proc-field"><span class="proc-field-label" style="font-weight: 800; color: var(--proc-primary);">Total</span><span class="proc-field-value" style="font-weight: 800; color: var(--proc-primary); font-size: 16px;">${P.formatZAR(inv.total)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Match Status</span><span class="proc-field-value">${matchBadge(inv.matchingStatus)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Approval</span><span class="proc-field-value">${approvalBadge(inv.approvalStatus)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Payment</span><span class="proc-field-value">${paymentBadge(inv.paymentStatus)}</span></div>
                </div>
            </div>
            
            <div class="proc-card" style="margin-top: 20px;">
                <div class="proc-card-title">Line Items (${(inv.lineItems || []).length})</div>
                <table class="proc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th style="text-align: right;">Qty</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Line Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(inv.lineItems || []).map(li => `
                            <tr>
                                <td><span style="font-weight: 800; color: var(--proc-primary);">${li.line}</span></td>
                                <td style="font-weight: 600;">${esc(li.description)}</td>
                                <td style="text-align: right;">${li.qty} ${esc(li.uom)}</td>
                                <td style="text-align: right;">${P.formatZAR(li.unitPrice)}</td>
                                <td style="text-align: right; font-weight: 700;">${P.formatZAR(li.qty * li.unitPrice)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    function renderInvMatchTab(inv) {
        const po = (P.data.purchaseOrders || []).find(p => p.id === inv.poId);
        const receipts = (P.data.goodsReceipts || []).filter(r => r.poId === inv.poId);
        const match = (P.data.invoiceMatches || []).find(m => m.invoiceId === inv.id);
        
        if (!po) {
            return `
                <div class="proc-card">
                    <div class="proc-empty">
                        <h3>No purchase order linked</h3>
                        <p>Cannot perform 3-way match without a PO reference.</p>
                    </div>
                </div>
            `;
        }
        
        const received = {};
        receipts.forEach(r => {
            (r.lines || []).forEach(l => {
                received[l.line] = (received[l.line] || 0) + (l.acceptedQty || 0);
            });
        });
        
        return `
            <div class="match-hero">
                <div class="match-hero-col">
                    <div class="match-hero-label">Ordered (PO)</div>
                    <div class="match-hero-value">${(po.lineItems || []).length} lines</div>
                    <div class="match-hero-ref">${esc(po.id)}</div>
                    <div class="match-hero-amount">${P.formatZAR(po.total)}</div>
                </div>
                <div class="match-hero-col">
                    <div class="match-hero-label">Received (GRN)</div>
                    <div class="match-hero-value">${Object.values(received).reduce((s, q) => s + q, 0)} units</div>
                    <div class="match-hero-ref">${receipts.length} receipts</div>
                    <div class="match-hero-amount">${P.formatZAR(po.lineItems.reduce((s, li) => s + ((received[li.line] || 0) * li.unitPrice), 0))}</div>
                </div>
                <div class="match-hero-col">
                    <div class="match-hero-label">Invoiced</div>
                    <div class="match-hero-value">${(inv.lineItems || []).reduce((s, li) => s + li.qty, 0)} units</div>
                    <div class="match-hero-ref">${esc(inv.id)}</div>
                    <div class="match-hero-amount">${P.formatZAR(inv.total)}</div>
                </div>
            </div>
            
            <div class="proc-card" style="margin-bottom: 20px;">
                <div class="proc-card-title">Matching Tolerances</div>
                <div class="tolerance-grid">
                    <div class="tolerance-item">
                        <div class="tolerance-value">${P.data.invoiceConfig.priceTolerancePct}%</div>
                        <div class="tolerance-label">Price Variance</div>
                    </div>
                    <div class="tolerance-item">
                        <div class="tolerance-value">${P.data.invoiceConfig.quantityTolerance}</div>
                        <div class="tolerance-label">Quantity Variance</div>
                    </div>
                    <div class="tolerance-item">
                        <div class="tolerance-value">${P.formatZAR(P.data.invoiceConfig.totalToleranceZAR)}</div>
                        <div class="tolerance-label">Total Variance</div>
                    </div>
                </div>
            </div>
            
            <div class="match-table">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px;">#</th>
                            <th>Description</th>
                            <th style="text-align: right;">Ordered</th>
                            <th style="text-align: right;">Received</th>
                            <th style="text-align: right;">Invoiced</th>
                            <th style="text-align: right;">PO Price</th>
                            <th style="text-align: right;">Inv Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(inv.lineItems || []).map(invLine => {
                            const poLine = (po.lineItems || []).find(pl => pl.line === invLine.line);
                            const recvQty = received[invLine.line] || 0;
                            const qtyMatch = invLine.qty <= recvQty;
                            const priceMatch = poLine && Math.abs(invLine.unitPrice - poLine.unitPrice) / poLine.unitPrice * 100 <= P.data.invoiceConfig.priceTolerancePct;
                            
                            let rowClass = 'line-match';
                            if (!qtyMatch || !priceMatch) rowClass = 'line-mismatch';
                            
                            return `
                                <tr class="${rowClass}">
                                    <td style="font-weight: 700;">${invLine.line}</td>
                                    <td>${esc(invLine.description)}</td>
                                    <td style="text-align: right;">${poLine?.qty || '—'}</td>
                                    <td style="text-align: right; font-weight: 600;">${recvQty}</td>
                                    <td style="text-align: right; font-weight: 600;">${invLine.qty}</td>
                                    <td style="text-align: right;">${poLine ? P.formatZAR(poLine.unitPrice) : '—'}</td>
                                    <td style="text-align: right; ${!priceMatch ? 'color: var(--proc-danger); font-weight: 700;' : ''}">${P.formatZAR(invLine.unitPrice)}</td>
                                    <td>
                                        ${qtyMatch && priceMatch ? '<span class="proc-badge proc-badge-success">✓ Match</span>' : ''}
                                        ${!qtyMatch ? '<span class="proc-badge proc-badge-danger">Qty ✕</span>' : ''}
                                        ${!priceMatch ? '<span class="proc-badge proc-badge-danger">Price ✕</span>' : ''}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            ${match ? `
                <div class="proc-card" style="margin-top: 20px;">
                    <div class="proc-card-title">Last Match Run</div>
                    <div class="proc-field"><span class="proc-field-label">Matched At</span><span class="proc-field-value">${P.formatDateTime(match.matchedAt)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Result</span><span class="proc-field-value">${matchBadge(match.status)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Matched Amount</span><span class="proc-field-value">${P.formatZAR(match.matchedAmount)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Variance</span><span class="proc-field-value" style="color: ${match.varianceAmount !== 0 ? 'var(--proc-danger)' : 'var(--proc-success)'};">${P.formatZAR(match.varianceAmount)}</span></div>
                </div>
            ` : ''}
        `;
    }
    
    function renderInvExceptionsTab(inv) {
        const exceptions = (P.data.invoiceExceptions || []).filter(e => e.invoiceId === inv.id);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Exceptions (${exceptions.length})</div>
                ${exceptions.length === 0 ? `
                    <p style="color: var(--proc-text-muted); font-size: 13px; padding: 20px 0;">No exceptions detected.</p>
                ` : exceptions.map(e => `
                    <div class="exception-card severity-${e.severity}">
                        <div class="exception-header">
                            <div>
                                <span class="exception-type ${e.type}">${e.type}</span>
                                <span style="font-size: 12px; color: var(--proc-text-muted); margin-left: 8px;">${esc(e.id)}</span>
                            </div>
                            <span class="proc-badge ${e.status === 'open' ? 'proc-badge-danger' : 'proc-badge-success'}">${esc(e.status)}</span>
                        </div>
                        <div class="exception-desc">${esc(e.description)}</div>
                        <div class="exception-meta">${P.formatDateTime(e.createdAt)}${e.varianceAmount ? ` · Variance: ${P.formatZAR(e.varianceAmount)}` : ''}</div>
                        ${e.status === 'open' ? `
                            <div style="margin-top: 12px; display: flex; gap: 8px;">
                                <button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementInvoice.resolveException('${e.id}')">Resolve</button>
                                <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementInvoice.waiveException('${e.id}')">Waive</button>
                            </div>
                        ` : `
                            <div style="margin-top: 8px; font-size: 12px; color: var(--proc-text-muted);">
                                ${esc(e.resolution || '')}
                            </div>
                        `}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function renderInvActivityTab(inv) {
        const events = [
            { time: inv.createdAt, user: 'System', action: 'Invoice captured' }
        ];
        
        const matches = (P.data.invoiceMatches || []).filter(m => m.invoiceId === inv.id);
        matches.forEach(m => events.push({ time: m.matchedAt, user: 'System', action: `Match run — ${m.status}` }));
        
        if (inv.approvedAt) events.push({ time: inv.approvedAt, user: inv.approvedBy || 'System', action: 'Invoice approved' });
        if (inv.paidAt) events.push({ time: inv.paidAt, user: 'System', action: 'Marked as paid (simulated)' });
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Activity Timeline</div>
                <div class="proc-timeline">
                    ${events.sort((a, b) => new Date(b.time) - new Date(a.time)).map(e => `
                        <div class="proc-timeline-item">
                            <div class="proc-timeline-time">${P.formatDateTime(e.time)} · ${esc(e.user)}</div>
                            <div class="proc-timeline-title">${esc(e.action)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // ============================================================
    // MATCHING ENGINE
    // ============================================================
    function runMatch(invId) {
        const inv = (P.data.invoices || []).find(i => i.id === invId);
        if (!inv) return { error: 'Invoice not found' };
        
        const po = (P.data.purchaseOrders || []).find(p => p.id === inv.poId);
        if (!po) {
            inv.matchingStatus = 'exception';
            createException(invId, 'missing', 'high', 'No PO reference linked', 0);
            return { error: 'No PO linked' };
        }
        
        const receipts = (P.data.goodsReceipts || []).filter(r => r.poId === inv.poId);
        const received = {};
        receipts.forEach(r => {
            (r.lines || []).forEach(l => {
                received[l.line] = (received[l.line] || 0) + (l.acceptedQty || 0);
            });
        });
        
        // Clear old exceptions
        P.data.invoiceExceptions = (P.data.invoiceExceptions || []).filter(e => e.invoiceId !== invId);
        
        const config = P.data.invoiceConfig;
        const exceptions = [];
        let totalVariance = 0;
        
        (inv.lineItems || []).forEach(invLine => {
            const poLine = (po.lineItems || []).find(pl => pl.line === invLine.line);
            if (!poLine) {
                exceptions.push({ type: 'missing', severity: 'high', description: `Line ${invLine.line} has no matching PO line`, varianceAmount: invLine.qty * invLine.unitPrice });
                return;
            }
            
            // Quantity match
            const recvQty = received[invLine.line] || 0;
            const qtyVariance = invLine.qty - recvQty;
            if (qtyVariance > config.quantityTolerance) {
                exceptions.push({
                    type: 'quantity',
                    severity: qtyVariance > poLine.qty * 0.1 ? 'high' : 'medium',
                    description: `Line ${invLine.line}: Invoiced ${invLine.qty} but only ${recvQty} accepted. Variance: ${qtyVariance}`,
                    varianceAmount: qtyVariance * invLine.unitPrice
                });
                totalVariance += qtyVariance * invLine.unitPrice;
            }
            
            // Price match
            if (poLine.unitPrice > 0) {
                const priceVariancePct = Math.abs(invLine.unitPrice - poLine.unitPrice) / poLine.unitPrice * 100;
                if (priceVariancePct > config.priceTolerancePct) {
                    exceptions.push({
                        type: 'price',
                        severity: priceVariancePct > 5 ? 'high' : 'medium',
                        description: `Line ${invLine.line}: PO price ${P.formatZAR(poLine.unitPrice)} vs Invoiced ${P.formatZAR(invLine.unitPrice)} (${priceVariancePct.toFixed(1)}% variance)`,
                        varianceAmount: (invLine.unitPrice - poLine.unitPrice) * invLine.qty
                    });
                    totalVariance += (invLine.unitPrice - poLine.unitPrice) * invLine.qty;
                }
            }
        });
        
        // Duplicate check
        const duplicates = (P.data.invoices || []).filter(i => 
            i.id !== invId && 
            i.vendorId === inv.vendorId && 
            i.supplierInvoiceNumber.toLowerCase() === inv.supplierInvoiceNumber.toLowerCase()
        );
        if (duplicates.length > 0) {
            exceptions.push({
                type: 'duplicate',
                severity: 'high',
                description: `Potential duplicate of ${duplicates[0].id}`,
                varianceAmount: inv.total
            });
        }
        
        // Create exception records
        exceptions.forEach(ex => {
            createException(invId, ex.type, ex.severity, ex.description, ex.varianceAmount);
        });
        
        // Update invoice
        inv.matchingStatus = exceptions.length > 0 ? 'exception' : (Math.abs(totalVariance) <= config.totalToleranceZAR ? 'matched' : 'exception');
        inv.matchedAt = new Date().toISOString();
        
        // Store match record
        if (!P.data.invoiceMatches) P.data.invoiceMatches = [];
        P.data.invoiceMatches.push({
            id: 'MAT-' + Date.now(),
            invoiceId: invId,
            poId: inv.poId,
            receiptIds: receipts.map(r => r.id),
            status: inv.matchingStatus,
            exceptions: exceptions.map(e => e.type),
            matchedAmount: inv.total - totalVariance,
            varianceAmount: totalVariance,
            matchedAt: new Date().toISOString()
        });
        
        P.save();
        
        return { success: true, exceptions: exceptions.length, status: inv.matchingStatus };
    }
    
    function createException(invoiceId, type, severity, description, varianceAmount) {
        if (!P.data.invoiceExceptions) P.data.invoiceExceptions = [];
        P.data.invoiceExceptions.push({
            id: 'EXC-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            invoiceId,
            type,
            severity,
            description,
            varianceAmount: varianceAmount || 0,
            status: 'open',
            createdAt: new Date().toISOString()
        });
    }
    
    // ============================================================
    // PUBLIC API
    // ============================================================
    window.ProcurementInvoice = {
        filter(term) {
            const rows = document.querySelectorAll('#invoiceTable tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(term.toLowerCase()) ? '' : 'none';
            });
        },
        
        openInvoice(id) {
            activeInvTab = 'overview';
            document.body.dataset.currentInvId = id;
            document.getElementById('contentArea').innerHTML = renderInvoiceDetail(id);
            document.getElementById('contentArea').scrollTop = 0;
        },
        
        backToDashboard() {
            document.body.dataset.currentInvId = '';
            document.getElementById('contentArea').innerHTML = renderInvoiceDashboard();
        },
        
        switchTab(tab) {
            activeInvTab = tab;
            const id = document.body.dataset.currentInvId;
            if (id) document.getElementById('contentArea').innerHTML = renderInvoiceDetail(id);
        },
        
        runMatch(invId) {
            const result = runMatch(invId);
            if (result.error) {
                if (window.App) window.App.toast(result.error, 'error');
            } else {
                if (window.App) window.App.toast(
                    result.exceptions > 0 
                        ? `Match complete: ${result.exceptions} exception(s) found` 
                        : 'Invoice matched successfully',
                    result.exceptions > 0 ? 'info' : 'success'
                );
            }
            document.getElementById('contentArea').innerHTML = renderInvoiceDetail(invId);
        },
        
        approveInvoice(invId) {
            if (!confirm('Approve this invoice for payment?')) return;
            const inv = (P.data.invoices || []).find(i => i.id === invId);
            if (!inv) return;
            
            inv.approvalStatus = 'approved';
            inv.approvedAt = new Date().toISOString();
            inv.approvedBy = (window.ERP?.currentUser?.name || 'Sarah Chen');
            P.save();
            
            document.getElementById('contentArea').innerHTML = renderInvoiceDetail(invId);
            if (window.App) window.App.toast('Invoice approved', 'success');
        },
        
        rejectInvoice(invId) {
            const reason = prompt('Reason for rejection:');
            if (!reason) return;
            
            const inv = (P.data.invoices || []).find(i => i.id === invId);
            if (!inv) return;
            
            inv.approvalStatus = 'rejected';
            inv.rejectedAt = new Date().toISOString();
            inv.rejectionReason = reason;
            P.save();
            
            document.getElementById('contentArea').innerHTML = renderInvoiceDetail(invId);
            if (window.App) window.App.toast('Invoice rejected', 'error');
        },
        
        schedulePayment(invId) {
            if (!confirm('Schedule payment? This is SIMULATED — no real money will move.')) return;
            const inv = (P.data.invoices || []).find(i => i.id === invId);
            if (!inv) return;
            
            inv.paymentStatus = 'scheduled_simulated';
            inv.scheduledAt = new Date().toISOString();
            P.save();
            
            document.getElementById('contentArea').innerHTML = renderInvoiceDetail(invId);
            if (window.App) window.App.toast('Payment scheduled (simulated)', 'info');
        },
        
        markPaid(invId) {
            if (!confirm('Mark as paid? This is SIMULATED — no real money will move.')) return;
            const inv = (P.data.invoices || []).find(i => i.id === invId);
            if (!inv) return;
            
            inv.paymentStatus = 'paid_simulated';
            inv.paidAt = new Date().toISOString();
            P.save();
            
            document.getElementById('contentArea').innerHTML = renderInvoiceDetail(invId);
            if (window.App) window.App.toast('Marked as paid (simulated)', 'success');
        },
        
        resolveException(excId) {
            const exc = (P.data.invoiceExceptions || []).find(e => e.id === excId);
            if (!exc) return;
            const resolution = prompt('Resolution notes (required):');
            if (!resolution) return;
            
            exc.status = 'resolved';
            exc.resolution = resolution;
            exc.resolvedAt = new Date().toISOString();
            P.save();
            
            // Check if all exceptions resolved
            const invId = exc.invoiceId;
            const remaining = (P.data.invoiceExceptions || []).filter(e => e.invoiceId === invId && e.status === 'open');
            if (remaining.length === 0) {
                const inv = (P.data.invoices || []).find(i => i.id === invId);
                if (inv) {
                    inv.matchingStatus = 'matched_within_tolerance';
                }
            }
            P.save();
            
            const currentInvId = document.body.dataset.currentInvId;
            if (currentInvId) document.getElementById('contentArea').innerHTML = renderInvoiceDetail(currentInvId);
            if (window.App) window.App.toast('Exception resolved', 'success');
        },
        
        waiveException(excId) {
            const reason = prompt('Reason for waiving (required, will be recorded):');
            if (!reason) return;
            
            const exc = (P.data.invoiceExceptions || []).find(e => e.id === excId);
            if (!exc) return;
            
            exc.status = 'waived';
            exc.resolution = `Waived: ${reason}`;
            exc.resolvedAt = new Date().toISOString();
            P.save();
            
            const currentInvId = document.body.dataset.currentInvId;
            if (currentInvId) document.getElementById('contentArea').innerHTML = renderInvoiceDetail(currentInvId);
            if (window.App) window.App.toast('Exception waived', 'info');
        },
        
        openCreateModal() {
            const suppliers = (P.data.suppliers || []).filter(s => s.onboardingStatus === 'qualified');
            const pos = (P.data.purchaseOrders || []).filter(p => ['issued', 'partially_received', 'fully_received'].includes(p.status));
            
            ProcModal('Capture Invoice', `
                <form id="createInvForm" onsubmit="ProcurementInvoice.saveNewInvoice(event)">
                    <div class="proc-form-row">
                        <div class="proc-form-group">
                            <label class="proc-form-label">Supplier *</label>
                            <select class="proc-form-select" name="vendorId" required>
                                <option value="">Select supplier...</option>
                                ${suppliers.map(s => `<option value="${s.id}">${esc(s.tradingName)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Linked PO *</label>
                            <select class="proc-form-select" name="poId" required>
                                <option value="">Select PO...</option>
                                ${pos.map(p => `<option value="${p.id}">${p.id} (${P.formatZAR(p.total)})</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="proc-form-row">
                        <div class="proc-form-group">
                            <label class="proc-form-label">Supplier Invoice # *</label>
                            <input class="proc-form-input" name="supplierInvoiceNumber" required placeholder="e.g. SUP-INV-001">
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Invoice Date</label>
                            <input class="proc-form-input" type="date" name="invoiceDate" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                    <div class="proc-form-row">
                        <div class="proc-form-group">
                            <label class="proc-form-label">Due Date</label>
                            <input class="proc-form-input" type="date" name="dueDate" value="${new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}">
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Currency</label>
                            <select class="proc-form-select" name="currency"><option>ZAR</option></select>
                        </div>
                    </div>
                    <div class="proc-form-group">
                        <label class="proc-form-label">Line Items (JSON - demo)</label>
                        <textarea class="proc-form-textarea" name="lineItems" rows="6" placeholder='[{"description":"Item 1","qty":10,"unitPrice":1500}]'>[{"line":1,"description":"Sample item","qty":10,"uom":"units","unitPrice":1000}]</textarea>
                        <p style="font-size: 11px; color: var(--proc-text-muted); margin-top: 4px;">Demo: paste JSON array of line items</p>
                    </div>
                </form>
            `, `
                <button class="proc-btn proc-btn-secondary" onclick="ProcurementInvoice.closeModal()">Cancel</button>
                <button class="proc-btn proc-btn-primary" onclick="document.getElementById('createInvForm').requestSubmit()">Capture Invoice</button>
            `, 'lg');
        },
        
        saveNewInvoice(e) {
            e.preventDefault();
            const fd = new FormData(e.target);
            
            let lineItems = [];
            try {
                lineItems = JSON.parse(fd.get('lineItems') || '[]');
            } catch (err) {
                alert('Invalid JSON in line items');
                return;
            }
            
            if (lineItems.length === 0) {
                alert('At least one line item required');
                return;
            }
            
            const subtotal = lineItems.reduce((s, li) => s + (li.qty * li.unitPrice), 0);
            const tax = subtotal * 0.15;
            
            const inv = {
                id: 'INV-2026-' + String((P.data.invoices || []).length + 1).padStart(4, '0'),
                supplierInvoiceNumber: fd.get('supplierInvoiceNumber'),
                poId: fd.get('poId'),
                vendorId: fd.get('vendorId'),
                invoiceDate: fd.get('invoiceDate'),
                receivedDate: new Date().toISOString().split('T')[0],
                dueDate: fd.get('dueDate'),
                currency: fd.get('currency'),
                lineItems,
                subtotal,
                tax,
                total: subtotal + tax,
                matchingStatus: 'pending',
                approvalStatus: 'pending',
                paymentStatus: 'not_scheduled',
                createdAt: new Date().toISOString()
            };
            
            if (!P.data.invoices) P.data.invoices = [];
            P.data.invoices.push(inv);
            P.save();
            this.closeModal();
            document.getElementById('contentArea').innerHTML = renderInvoiceDashboard();
            if (window.App) window.App.toast('Invoice captured', 'success');
        },
        
        closeModal() {
            document.getElementById('procModal')?.remove();
        },
        
        exportCSV() {
            const invoices = P.data.invoices || [];
            const headers = ['Invoice #', 'Supplier Invoice', 'Supplier', 'PO', 'Invoice Date', 'Amount', 'Match', 'Approval', 'Payment'];
            const rows = invoices.map(inv => [
                inv.id, inv.supplierInvoiceNumber, getSupplier(inv.vendorId)?.tradingName || inv.vendorId,
                inv.poId || '—', P.formatDate(inv.invoiceDate), inv.total,
                inv.matchingStatus, inv.approvalStatus, inv.paymentStatus
            ]);
            const csv = [headers, ...rows].map(row => row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    
    function ProcModal(title, bodyHtml, footerHtml, size = 'md') {
        const sizes = { sm: 'max-width: 500px;', md: 'max-width: 700px;', lg: 'max-width: 900px;', xl: 'max-width: 1200px;' };
        const existing = document.getElementById('procModal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.id = 'procModal';
        modal.className = 'proc-modal-overlay';
        modal.innerHTML = `
            <div class="proc-modal" style="${sizes[size]}">
                <div class="proc-modal-header">
                    <h3 class="proc-modal-title">${title}</h3>
                    <button onclick="ProcurementInvoice.closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--proc-text-muted);">×</button>
                </div>
                <div class="proc-modal-body">${bodyHtml}</div>
                <div class="proc-modal-footer">${footerHtml}</div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
})();