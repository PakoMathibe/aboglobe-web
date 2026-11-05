// ============================================================
// PROCUREMENT - PURCHASE ORDERS & RECEIVING
// ============================================================

(function() {
    'use strict';
    
    if (!window.Procurement) {
        console.error('[PO] Procurement not loaded');
        return;
    }
    if (typeof window.Views === 'undefined') {
        console.error('[PO] Views not defined');
        return;
    }
    
    const P = window.Procurement;
    const esc = P.escapeHtml;
    
    // ============================================================
    // INIT
    // ============================================================
    function initPoModule() {
        if (!P.data) { P.init(); }
        if (!P.data) { setTimeout(initPoModule, 100); return; }
        
        if (!P.data.purchaseOrders) P.data.purchaseOrders = [];
        if (!P.data.goodsReceipts) P.data.goodsReceipts = [];
        if (!P.data.discrepancies) P.data.discrepancies = [];
        if (!P.data.poAmendments) P.data.poAmendments = [];
        
        seedPurchaseOrders();
        
        window.Views.procurementPO = function() {
            return renderPoDashboard();
        };
        
        console.log('[PO] Module ready -', (P.data.purchaseOrders || []).length, 'POs');
    }
    
    if (P.initialized && P.data) {
        initPoModule();
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initPoModule, 50));
    }
    
    // ============================================================
    // SEED
    // ============================================================
    function seedPurchaseOrders() {
        if (P.data.purchaseOrders.length > 0) return;
        
        // Only create a PO if there's an award to base it on. Otherwise create standalone POs for demo.
        const awards = P.data.awards || [];
        
        P.data.purchaseOrders.push(
            {
                id: 'PO-2026-0001',
                awardId: awards[0]?.id || null,
                rfqId: 'RFQ-2026-0003',
                vendorId: 'VEN-0003',
                buyer: 'Sarah Chen',
                department: 'Operations',
                costCentre: 'OPS-LOG-2026',
                status: 'issued',
                revision: 1,
                currency: 'ZAR',
                orderDate: '2026-10-16',
                requiredDeliveryDate: '2026-12-01',
                deliveryAddress: 'ABO Central Warehouse, 5 Industrial Way, Johannesburg, 2001',
                paymentTerms: 'Net 30',
                lineItems: [
                    { line: 1, description: 'Road freight - JHB to CPT', qty: 24, uom: 'trips', unitPrice: 17500, receivedQty: 0 },
                    { line: 2, description: 'Road freight - JHB to DBN', qty: 18, uom: 'trips', unitPrice: 11500, receivedQty: 0 }
                ],
                subtotal: 627000,
                tax: 94050,
                total: 721050,
                acknowledgement: { status: 'acknowledged', acknowledgedAt: '2026-10-16T14:30:00+02:00', confirmedDeliveryDate: '2026-11-28', comments: 'Confirmed, will deliver in 3 batches' },
                createdAt: '2026-10-16T09:00:00+02:00',
                issuedAt: '2026-10-16T09:30:00+02:00'
            },
            {
                id: 'PO-2026-0002',
                awardId: null,
                rfqId: null,
                vendorId: 'VEN-0001',
                buyer: 'Elena Rodriguez',
                department: 'Information Technology',
                costCentre: 'IT-INFRA-2026',
                status: 'issued',
                revision: 1,
                currency: 'ZAR',
                orderDate: '2026-10-10',
                requiredDeliveryDate: '2026-11-15',
                deliveryAddress: 'ABO HQ, 12 Innovation Road, Sandton, 2196',
                paymentTerms: 'Net 30',
                lineItems: [
                    { line: 1, description: '48-port managed switch', qty: 4, uom: 'units', unitPrice: 35000, receivedQty: 2 },
                    { line: 2, description: 'SFP+ 10G transceiver', qty: 8, uom: 'units', unitPrice: 2500, receivedQty: 8 }
                ],
                subtotal: 160000,
                tax: 24000,
                total: 184000,
                acknowledgement: { status: 'acknowledged', acknowledgedAt: '2026-10-11T10:00:00+02:00', confirmedDeliveryDate: '2026-11-10', comments: '' },
                createdAt: '2026-10-10T09:00:00+02:00',
                issuedAt: '2026-10-10T09:15:00+02:00'
            },
            {
                id: 'PO-2026-0003',
                awardId: null,
                rfqId: null,
                vendorId: 'VEN-0005',
                buyer: 'Sarah Chen',
                department: 'Facilities',
                costCentre: 'FAC-HQ-2026',
                status: 'partially_received',
                revision: 1,
                currency: 'ZAR',
                orderDate: '2026-09-20',
                requiredDeliveryDate: '2026-10-15',
                deliveryAddress: 'ABO HQ, 12 Innovation Road, Sandton, 2196',
                paymentTerms: 'Net 30',
                lineItems: [
                    { line: 1, description: 'Monthly deep clean - HQ', qty: 3, uom: 'months', unitPrice: 45000, receivedQty: 2 },
                    { line: 2, description: 'HVAC quarterly maintenance', qty: 1, uom: 'service', unitPrice: 28000, receivedQty: 0 }
                ],
                subtotal: 163000,
                tax: 24450,
                total: 187450,
                acknowledgement: { status: 'acknowledged', acknowledgedAt: '2026-09-21T08:00:00+02:00', confirmedDeliveryDate: '2026-10-15', comments: '' },
                createdAt: '2026-09-20T09:00:00+02:00',
                issuedAt: '2026-09-20T10:00:00+02:00'
            },
            {
                id: 'PO-2026-0004',
                awardId: null,
                rfqId: null,
                vendorId: 'VEN-0004',
                buyer: 'Aisha Patel',
                department: 'Human Resources',
                costCentre: 'HR-OFF-2026',
                status: 'pending_approval',
                revision: 1,
                currency: 'ZAR',
                orderDate: new Date().toISOString().split('T')[0],
                requiredDeliveryDate: '2026-12-01',
                deliveryAddress: 'ABO HQ, 12 Innovation Road, Sandton, 2196',
                paymentTerms: 'Net 30',
                lineItems: [
                    { line: 1, description: 'Ergonomic office chairs', qty: 20, uom: 'units', unitPrice: 3800, receivedQty: 0 },
                    { line: 2, description: 'Standing desks', qty: 10, uom: 'units', unitPrice: 6500, receivedQty: 0 }
                ],
                subtotal: 141000,
                tax: 21150,
                total: 162150,
                acknowledgement: { status: 'pending', acknowledgedAt: null, confirmedDeliveryDate: null },
                createdAt: new Date().toISOString()
            }
        );
        
        // Seed goods receipts for PO-0002 (partially received) and PO-0003
        P.data.goodsReceipts.push(
            {
                id: 'GRN-2026-0001',
                poId: 'PO-2026-0002',
                vendorId: 'VEN-0001',
                deliveryNoteRef: 'MER-DN-001',
                receivedDate: '2026-10-25',
                receivedBy: 'David Kim',
                lines: [
                    { line: 1, orderedQty: 4, previouslyReceived: 0, receivedNow: 2, acceptedQty: 2, rejectedQty: 0, damagedQty: 0, notes: 'Delivered in two batches' },
                    { line: 2, orderedQty: 8, previouslyReceived: 0, receivedNow: 8, acceptedQty: 8, rejectedQty: 0, damagedQty: 0, notes: '' }
                ],
                status: 'posted',
                createdAt: '2026-10-25T11:00:00+02:00'
            },
            {
                id: 'GRN-2026-0002',
                poId: 'PO-2026-0003',
                vendorId: 'VEN-0005',
                deliveryNoteRef: 'BAFM-002',
                receivedDate: '2026-10-15',
                receivedBy: 'Sarah Chen',
                lines: [
                    { line: 1, orderedQty: 3, previouslyReceived: 1, receivedNow: 1, acceptedQty: 1, rejectedQty: 0, damagedQty: 0, notes: '' },
                    { line: 2, orderedQty: 1, previouslyReceived: 0, receivedNow: 0, acceptedQty: 0, rejectedQty: 0, damagedQty: 0, notes: 'Service not yet rendered' }
                ],
                status: 'posted',
                createdAt: '2026-10-15T14:00:00+02:00'
            }
        );
        
        P.save();
    }
    
    // ============================================================
    // DASHBOARD
    // ============================================================
    function renderPoDashboard() {
        const pos = P.data.purchaseOrders || [];
        
        const stats = {
            total: pos.length,
            pending: pos.filter(p => p.status === 'pending_approval').length,
            issued: pos.filter(p => p.status === 'issued' || p.status === 'partially_received').length,
            received: pos.filter(p => p.status === 'fully_received' || p.status === 'closed').length,
            totalValue: pos.filter(p => ['issued', 'partially_received', 'fully_received'].includes(p.status)).reduce((s, p) => s + (p.total || 0), 0)
        };
        
        return `
            <div class="proc-dashboard-page">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 800; color: var(--proc-text); margin-bottom: 4px;">Purchase Orders & Receiving</h2>
                        <p style="font-size: 14px; color: var(--proc-text-muted);">Manage POs, track deliveries, record receipts</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="proc-btn proc-btn-secondary" onclick="ProcurementPO.exportCSV()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Export
                        </button>
                        <button class="proc-btn proc-btn-primary" onclick="ProcurementPO.openCreateModal()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            New PO
                        </button>
                    </div>
                </div>
                
                <div class="proc-dashboard">
                    ${kpi('Total POs', stats.total, 'All time', 'primary')}
                    ${kpi('Pending Approval', stats.pending, 'Awaiting sign-off', 'warning')}
                    ${kpi('Outstanding', stats.issued, 'Awaiting delivery', 'info')}
                    ${kpi('Completed', stats.received, 'Fully received', 'success')}
                    ${kpi('Total Value', P.formatZAR(stats.totalValue), 'Active POs', 'primary')}
                </div>
                
                ${renderPoRegister()}
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
    
    let poFilters = { search: '', status: 'all', vendor: 'all' };
    
    function renderPoRegister() {
        const pos = getFilteredPos();
        const vendors = [...new Set((P.data.purchaseOrders || []).map(p => p.vendorId))].sort();
        
        return `
            <div class="proc-register">
                <div class="proc-register-toolbar">
                    <div class="proc-filter-row">
                        <div class="proc-search-input">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input type="text" placeholder="Search POs..." value="${esc(poFilters.search)}" oninput="ProcurementPO.setFilter('search', this.value)">
                        </div>
                        <select class="proc-filter-chip" onchange="ProcurementPO.setFilter('status', this.value)">
                            <option value="all" ${poFilters.status === 'all' ? 'selected' : ''}>All Statuses</option>
                            <option value="draft" ${poFilters.status === 'draft' ? 'selected' : ''}>Draft</option>
                            <option value="pending_approval" ${poFilters.status === 'pending_approval' ? 'selected' : ''}>Pending Approval</option>
                            <option value="issued" ${poFilters.status === 'issued' ? 'selected' : ''}>Issued</option>
                            <option value="partially_received" ${poFilters.status === 'partially_received' ? 'selected' : ''}>Partially Received</option>
                            <option value="fully_received" ${poFilters.status === 'fully_received' ? 'selected' : ''}>Fully Received</option>
                            <option value="closed" ${poFilters.status === 'closed' ? 'selected' : ''}>Closed</option>
                            <option value="cancelled" ${poFilters.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <select class="proc-filter-chip" onchange="ProcurementPO.setFilter('vendor', this.value)">
                            <option value="all" ${poFilters.vendor === 'all' ? 'selected' : ''}>All Suppliers</option>
                            ${vendors.map(v => {
                                const supplier = getSupplier(v);
                                return `<option value="${v}" ${poFilters.vendor === v ? 'selected' : ''}>${esc(supplier?.tradingName || v)}</option>`;
                            }).join('')}
                        </select>
                    </div>
                </div>
                
                ${pos.length === 0 ? emptyPoState() : `
                <div style="overflow-x: auto;">
                    <table class="proc-table">
                        <thead>
                            <tr>
                                <th>PO #</th>
                                <th>Supplier</th>
                                <th>Order Date</th>
                                <th>Delivery By</th>
                                <th>Value</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th style="text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pos.map(p => renderPoRow(p)).join('')}
                        </tbody>
                    </table>
                </div>
                `}
            </div>
        `;
    }
    
    function renderPoRow(po) {
        const supplier = getSupplier(po.vendorId);
        const progress = calculateReceiptProgress(po);
        
        return `
            <tr onclick="ProcurementPO.openPo('${po.id}')">
                <td><span style="font-family: monospace; font-weight: 700; color: var(--proc-primary); font-size: 12px;">${esc(po.id)}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="vendor-avatar" style="background: ${getAvatarColor(supplier?.tradingName || '?')}; width: 28px; height: 28px; font-size: 10px;">${getInitials(supplier?.tradingName || '?')}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 13px;">${esc(supplier?.tradingName || po.vendorId)}</div>
                            <div style="font-size: 11px; color: var(--proc-text-muted);">${esc(po.department)}</div>
                        </div>
                    </div>
                </td>
                <td style="font-size: 12px;">${P.formatDate(po.orderDate)}</td>
                <td style="font-size: 12px;">${P.formatDate(po.requiredDeliveryDate)}</td>
                <td style="font-weight: 700; font-size: 13px;">${P.formatZAR(po.total)}</td>
                <td>
                    <div style="min-width: 100px;">
                        <div style="font-size: 11px; color: var(--proc-text-muted); margin-bottom: 3px;">${progress.received}/${progress.total} units</div>
                        <div class="po-progress">
                            <div class="po-progress-segment po-progress-received" style="width: ${progress.pct}%"></div>
                            <div class="po-progress-segment po-progress-pending" style="width: ${100 - progress.pct}%"></div>
                        </div>
                    </div>
                </td>
                <td>${getStatusBadge(po.status)}</td>
                <td style="text-align: right;" onclick="event.stopPropagation()">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementPO.openPo('${po.id}')">View →</button>
                </td>
            </tr>
        `;
    }
    
    function getFilteredPos() {
        let list = [...(P.data.purchaseOrders || [])];
        
        if (poFilters.search) {
            const q = poFilters.search.toLowerCase();
            list = list.filter(p => 
                (p.id || '').toLowerCase().includes(q) ||
                (getSupplier(p.vendorId)?.tradingName || '').toLowerCase().includes(q) ||
                (p.department || '').toLowerCase().includes(q)
            );
        }
        
        if (poFilters.status !== 'all') list = list.filter(p => p.status === poFilters.status);
        if (poFilters.vendor !== 'all') list = list.filter(p => p.vendorId === poFilters.vendor);
        
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    function emptyPoState() {
        return `
            <div class="proc-empty">
                <div class="proc-empty-icon">📦</div>
                <h3>No purchase orders</h3>
                <p>Create a PO from an awarded RFQ or manually.</p>
            </div>
        `;
    }
    
    function getStatusBadge(status) {
        const map = {
            draft: { c: 'neutral', l: 'Draft' },
            pending_approval: { c: 'warning', l: 'Pending Approval' },
            issued: { c: 'info', l: 'Issued' },
            acknowledged: { c: 'info', l: 'Acknowledged' },
            partially_received: { c: 'warning', l: 'Partially Received' },
            fully_received: { c: 'success', l: 'Fully Received' },
            closed: { c: 'success', l: 'Closed' },
            cancelled: { c: 'danger', l: 'Cancelled' },
            on_hold: { c: 'warning', l: 'On Hold' }
        };
        const m = map[status] || { c: 'neutral', l: status };
        return `<span class="proc-badge proc-badge-${m.c}">${m.l}</span>`;
    }
    
    // ============================================================
    // PO DETAIL
    // ============================================================
    let activePoTab = 'overview';
    
    function renderPoDetail(poId) {
        const po = (P.data.purchaseOrders || []).find(p => p.id === poId);
        if (!po) return '<div class="proc-empty"><h3>PO not found</h3></div>';
        
        const tabs = [
            { id: 'overview', label: 'Overview' },
            { id: 'lines', label: 'Line Items' },
            { id: 'receipts', label: 'Goods Receipts' },
            { id: 'discrepancies', label: 'Discrepancies' },
            { id: 'activity', label: 'Activity' }
        ];
        
        return `
            <div class="proc-detail-page">
                <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementPO.backToDashboard()">
                        ← Back to POs
                    </button>
                    <div style="display: flex; gap: 6px;">
                        ${renderPoActions(po)}
                    </div>
                </div>
                
                <div class="proc-detail-header">
                    <div class="proc-detail-header-inner">
                        <div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                                <span style="font-family: monospace; font-size: 11px; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px;">${esc(po.id)}</span>
                                ${getStatusBadge(po.status)}
                            </div>
                            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${esc(getSupplier(po.vendorId)?.tradingName || po.vendorId)}</h1>
                            <p style="color: rgba(255,255,255,0.7); font-size: 13px;">
                                ${P.formatZAR(po.total)} · Ordered ${P.formatDate(po.orderDate)} · By ${P.formatDate(po.requiredDeliveryDate)}
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Receipt Progress</div>
                            <div style="font-size: 15px; font-weight: 800;">${calculateReceiptProgress(po).received} / ${calculateReceiptProgress(po).total} units</div>
                        </div>
                    </div>
                </div>
                
                <div class="proc-tabs">
                    ${tabs.map(t => `
                        <button class="proc-tab ${activePoTab === t.id ? 'active' : ''}" 
                            onclick="ProcurementPO.switchTab('${t.id}')">${t.label}</button>
                    `).join('')}
                </div>
                
                <div class="proc-tab-content">
                    ${renderPoTab(activePoTab, po)}
                </div>
            </div>
        `;
    }
    
    function renderPoActions(po) {
        const actions = [];
        
        if (po.status === 'draft') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementPO.submitForApproval('${po.id}')">Submit for Approval</button>`);
        }
        if (po.status === 'pending_approval') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementPO.approvePo('${po.id}')">Approve & Issue</button>`);
        }
        if (po.status === 'issued' || po.status === 'acknowledged' || po.status === 'partially_received') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementPO.openReceiptModal('${po.id}')">Record Delivery</button>`);
        }
        if (po.status === 'fully_received') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementPO.closePo('${po.id}')">Close PO</button>`);
        }
        if (['draft', 'pending_approval', 'issued'].includes(po.status)) {
            actions.push(`<button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementPO.viewPrint('${po.id}')">Print PO</button>`);
            actions.push(`<button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementPO.cancelPo('${po.id}')">Cancel</button>`);
        }
        
        return actions.join('');
    }
    
    function renderPoTab(tab, po) {
        switch (tab) {
            case 'overview': return renderPoOverviewTab(po);
            case 'lines': return renderPoLinesTab(po);
            case 'receipts': return renderPoReceiptsTab(po);
            case 'discrepancies': return renderPoDiscrepanciesTab(po);
            case 'activity': return renderPoActivityTab(po);
            default: return renderPoOverviewTab(po);
        }
    }
    
    function renderPoOverviewTab(po) {
        const receipts = (P.data.goodsReceipts || []).filter(r => r.poId === po.id);
        const discrepancies = (P.data.discrepancies || []).filter(d => d.poId === po.id);
        
        return `
            <div class="proc-grid-2">
                <div class="proc-card">
                    <div class="proc-card-title">Order Information</div>
                    <div class="proc-field"><span class="proc-field-label">PO Number</span><span class="proc-field-value">${esc(po.id)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Buyer</span><span class="proc-field-value">${esc(po.buyer)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Department</span><span class="proc-field-value">${esc(po.department)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Cost Centre</span><span class="proc-field-value">${esc(po.costCentre || '—')}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Order Date</span><span class="proc-field-value">${P.formatDate(po.orderDate)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Required By</span><span class="proc-field-value">${P.formatDate(po.requiredDeliveryDate)}</span></div>
                </div>
                
                <div class="proc-card">
                    <div class="proc-card-title">Commercial</div>
                    <div class="proc-field"><span class="proc-field-label">Subtotal</span><span class="proc-field-value">${P.formatZAR(po.subtotal)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">VAT (15%)</span><span class="proc-field-value">${P.formatZAR(po.tax)}</span></div>
                    <div class="proc-field"><span class="proc-field-label" style="font-weight: 800; color: var(--proc-primary);">Total</span><span class="proc-field-value" style="font-weight: 800; color: var(--proc-primary); font-size: 16px;">${P.formatZAR(po.total)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Payment Terms</span><span class="proc-field-value">${esc(po.paymentTerms || 'Net 30')}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Delivery Address</span><span class="proc-field-value">${esc(po.deliveryAddress || '—')}</span></div>
                </div>
            </div>
            
            <div class="proc-card" style="margin-top: 20px;">
                <div class="proc-card-title">Supplier Acknowledgement</div>
                ${po.acknowledgement?.status === 'acknowledged' ? `
                    <div class="proc-field"><span class="proc-field-label">Status</span><span class="proc-field-value"><span class="proc-badge proc-badge-success">✓ Acknowledged</span></span></div>
                    <div class="proc-field"><span class="proc-field-label">Acknowledged At</span><span class="proc-field-value">${P.formatDateTime(po.acknowledgement.acknowledgedAt)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Confirmed Delivery</span><span class="proc-field-value">${P.formatDate(po.acknowledgement.confirmedDeliveryDate)}</span></div>
                    ${po.acknowledgement.comments ? `<div class="proc-field"><span class="proc-field-label">Comments</span><span class="proc-field-value">${esc(po.acknowledgement.comments)}</span></div>` : ''}
                ` : `
                    <div style="text-align: center; padding: 20px; color: var(--proc-text-muted);">
                        <div style="font-size: 32px; opacity: 0.3; margin-bottom: 8px;">⏳</div>
                        <div style="font-size: 13px;">Awaiting supplier acknowledgement in portal</div>
                    </div>
                `}
            </div>
            
            <div class="proc-grid-3" style="margin-top: 20px;">
                <div class="rfq-summary-card">
                    <div class="rfq-summary-label">Line Items</div>
                    <div class="rfq-summary-value">${(po.lineItems || []).length}</div>
                </div>
                <div class="rfq-summary-card">
                    <div class="rfq-summary-label">Goods Receipts</div>
                    <div class="rfq-summary-value">${receipts.length}</div>
                </div>
                <div class="rfq-summary-card">
                    <div class="rfq-summary-label">Open Discrepancies</div>
                    <div class="rfq-summary-value" style="color: ${discrepancies.filter(d => d.status === 'open').length > 0 ? 'var(--proc-danger)' : 'var(--proc-success)'};">${discrepancies.filter(d => d.status === 'open').length}</div>
                </div>
            </div>
        `;
    }
    
    function renderPoLinesTab(po) {
        const received = getReceivedQuantities(po.id);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Line Items (${(po.lineItems || []).length})</div>
                <table class="proc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th style="text-align: right;">Ordered</th>
                            <th style="text-align: right;">Received</th>
                            <th style="text-align: right;">Outstanding</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Line Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(po.lineItems || []).map(li => {
                            const recv = received[li.line] || 0;
                            const outstanding = li.qty - recv;
                            return `
                                <tr>
                                    <td><span style="font-weight: 800; color: var(--proc-primary);">${li.line}</span></td>
                                    <td style="font-weight: 600;">${esc(li.description)}</td>
                                    <td style="text-align: right;">${li.qty} ${esc(li.uom)}</td>
                                    <td style="text-align: right; color: var(--proc-success); font-weight: 700;">${recv}</td>
                                    <td style="text-align: right; font-weight: 700; color: ${outstanding > 0 ? 'var(--proc-warning)' : 'var(--proc-success)'};">${outstanding}</td>
                                    <td style="text-align: right;">${P.formatZAR(li.unitPrice)}</td>
                                    <td style="text-align: right; font-weight: 700;">${P.formatZAR(li.qty * li.unitPrice)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    function renderPoReceiptsTab(po) {
        const receipts = (P.data.goodsReceipts || []).filter(r => r.poId === po.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">
                    <span>Goods Receipts (${receipts.length})</span>
                    ${['issued', 'acknowledged', 'partially_received'].includes(po.status) ? `
                        <button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementPO.openReceiptModal('${po.id}')">+ Record Delivery</button>
                    ` : ''}
                </div>
                ${receipts.length === 0 ? `
                    <p style="color: var(--proc-text-muted); font-size: 13px; padding: 20px 0;">No deliveries recorded yet.</p>
                ` : receipts.map(r => `
                    <div class="proc-compliance-item" style="margin-bottom: 12px;">
                        <div class="compliance-icon ok">📦</div>
                        <div class="compliance-body">
                            <div class="compliance-title">${esc(r.id)} <span style="font-size: 11px; color: var(--proc-text-muted); font-weight: 400;">· Delivery Note: ${esc(r.deliveryNoteRef)}</span></div>
                            <div class="compliance-meta">Received ${P.formatDate(r.receivedDate)} by ${esc(r.receivedBy)}</div>
                            <div class="compliance-meta" style="margin-top: 4px;">
                                ${r.lines.map(l => {
                                    const poLine = (po.lineItems || []).find(x => x.line === l.line);
                                    return `Line ${l.line}: ${l.receivedNow} ${poLine?.uom || 'units'} (${l.acceptedQty} accepted)`;
                                }).join(' · ')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function renderPoDiscrepanciesTab(po) {
        const discrepancies = (P.data.discrepancies || []).filter(d => d.poId === po.id);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Discrepancies (${discrepancies.length})</div>
                ${discrepancies.length === 0 ? `
                    <p style="color: var(--proc-text-muted); font-size: 13px; padding: 20px 0;">No discrepancies recorded.</p>
                ` : discrepancies.map(d => `
                    <div class="proc-risk-item">
                        <div class="risk-header">
                            <div>
                                <div style="font-weight: 700; font-size: 14px;">
                                    <span class="discrepancy-badge ${d.type}">${d.type}</span>
                                    ${esc(d.id)}
                                </div>
                                <div style="font-size: 12px; color: var(--proc-text-muted); margin-top: 4px;">${esc(d.description)}</div>
                            </div>
                            <span class="proc-badge ${d.status === 'open' ? 'proc-badge-danger' : 'proc-badge-success'}">${esc(d.status)}</span>
                        </div>
                        <div style="font-size: 12px; color: var(--proc-text-muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--proc-border);">
                            ${d.status === 'open' ? `<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementPO.resolveDiscrepancy('${d.id}')">Resolve</button>` : `Resolved: ${esc(d.resolution || '—')}`}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function renderPoActivityTab(po) {
        const events = [
            { time: po.createdAt, user: po.buyer, action: 'PO created' }
        ];
        if (po.issuedAt) events.push({ time: po.issuedAt, user: po.buyer, action: 'PO issued to supplier' });
        if (po.acknowledgement?.acknowledgedAt) events.push({ time: po.acknowledgement.acknowledgedAt, user: getSupplier(po.vendorId)?.tradingName, action: 'Acknowledged by supplier' });
        
        const receipts = (P.data.goodsReceipts || []).filter(r => r.poId === po.id);
        receipts.forEach(r => events.push({ time: r.createdAt, user: r.receivedBy, action: `Goods received: ${r.id}` }));
        
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
    // CALCULATIONS
    // ============================================================
    function calculateReceiptProgress(po) {
        const totalUnits = (po.lineItems || []).reduce((s, li) => s + li.qty, 0);
        const received = getReceivedQuantities(po.id);
        const totalReceived = Object.values(received).reduce((s, q) => s + q, 0);
        return {
            received: totalReceived,
            total: totalUnits,
            pct: totalUnits > 0 ? Math.round((totalReceived / totalUnits) * 100) : 0
        };
    }
    
    function getReceivedQuantities(poId) {
        const receipts = (P.data.goodsReceipts || []).filter(r => r.poId === poId);
        const result = {};
        receipts.forEach(r => {
            (r.lines || []).forEach(l => {
                result[l.line] = (result[l.line] || 0) + (l.acceptedQty || 0);
            });
        });
        return result;
    }
    
    // ============================================================
    // HELPERS
    // ============================================================
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
    // PUBLIC API
    // ============================================================
    window.ProcurementPO = {
        setFilter(key, value) {
            poFilters[key] = value;
            document.getElementById('contentArea').innerHTML = renderPoDashboard();
        },
        
        openPo: function(id) {
            activePoTab = 'overview';
            document.body.dataset.currentPoId = id;
            document.getElementById('contentArea').innerHTML = renderPoDetail(id);
            document.getElementById('contentArea').scrollTop = 0;
        },
        
        backToDashboard: function() {
            document.body.dataset.currentPoId = '';
            document.getElementById('contentArea').innerHTML = renderPoDashboard();
        },
        
        switchTab: function(tab) {
            activePoTab = tab;
            const id = document.body.dataset.currentPoId;
            if (id) document.getElementById('contentArea').innerHTML = renderPoDetail(id);
        },
        
        openCreateModal: function() {
            const suppliers = (P.data.suppliers || []).filter(s => s.onboardingStatus === 'qualified');
            
            PortalLikeModal('Create Purchase Order', `
                <form id="createPoForm" onsubmit="ProcurementPO.saveNewPo(event)">
                    <div class="proc-form-row">
                        <div class="proc-form-group">
                            <label class="proc-form-label">Supplier *</label>
                            <select class="proc-form-select" name="vendorId" required>
                                <option value="">Select supplier...</option>
                                ${suppliers.map(s => `<option value="${s.id}">${esc(s.tradingName)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Department</label>
                            <select class="proc-form-select" name="department">
                                ${['Operations', 'Information Technology', 'Finance', 'Human Resources', 'Facilities'].map(d => `<option>${d}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="proc-form-row">
                        <div class="proc-form-group">
                            <label class="proc-form-label">Order Date</label>
                            <input class="proc-form-input" type="date" name="orderDate" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Required By *</label>
                            <input class="proc-form-input" type="date" name="requiredDeliveryDate" required>
                        </div>
                    </div>
                    <div class="proc-form-group">
                        <label class="proc-form-label">Delivery Address</label>
                        <input class="proc-form-input" name="deliveryAddress" value="ABO HQ, 12 Innovation Road, Sandton, 2196">
                    </div>
                    <div class="proc-form-group">
                        <label class="proc-form-label">Payment Terms</label>
                        <select class="proc-form-select" name="paymentTerms">
                            <option>Net 30</option><option>Net 45</option><option>Net 60</option><option>Per event</option>
                        </select>
                    </div>
                    <div class="proc-form-group">
                        <label class="proc-form-label">Line Items (JSON - demo)</label>
                        <textarea class="proc-form-textarea" name="lineItems" rows="5" placeholder='[{"description":"Item 1","qty":10,"unitPrice":1500}]'>[{"description":"Office chairs","qty":20,"unitPrice":3800}]</textarea>
                        <p style="font-size: 11px; color: var(--proc-text-muted); margin-top: 4px;">Demo: paste JSON array of line items</p>
                    </div>
                </form>
            `, `
                <button class="proc-btn proc-btn-secondary" onclick="ProcurementPO.closeModal()">Cancel</button>
                <button class="proc-btn proc-btn-primary" onclick="document.getElementById('createPoForm').requestSubmit()">Create Draft PO</button>
            `, 'lg');
        },
        
        saveNewPo: function(e) {
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
            
            lineItems = lineItems.map((li, i) => ({
                line: i + 1,
                description: li.description,
                qty: li.qty,
                uom: li.uom || 'units',
                unitPrice: li.unitPrice,
                receivedQty: 0
            }));
            
            const subtotal = lineItems.reduce((s, li) => s + (li.qty * li.unitPrice), 0);
            const tax = subtotal * 0.15;
            
            const po = {
                id: 'PO-2026-' + String((P.data.purchaseOrders || []).length + 1).padStart(4, '0'),
                awardId: null,
                rfqId: null,
                vendorId: fd.get('vendorId'),
                buyer: (window.ERP?.currentUser?.name || 'Sarah Chen'),
                department: fd.get('department'),
                costCentre: null,
                status: 'draft',
                revision: 1,
                currency: 'ZAR',
                orderDate: fd.get('orderDate'),
                requiredDeliveryDate: fd.get('requiredDeliveryDate'),
                deliveryAddress: fd.get('deliveryAddress'),
                paymentTerms: fd.get('paymentTerms'),
                lineItems,
                subtotal,
                tax,
                total: subtotal + tax,
                acknowledgement: { status: 'pending', acknowledgedAt: null },
                createdAt: new Date().toISOString()
            };
            
            P.data.purchaseOrders.push(po);
            P.save();
            this.closeModal();
            document.getElementById('contentArea').innerHTML = renderPoDashboard();
            if (window.App) window.App.toast('PO created as draft', 'success');
        },
        
        submitForApproval: function(id) {
            const po = (P.data.purchaseOrders || []).find(p => p.id === id);
            if (!po) return;
            po.status = 'pending_approval';
            po.submittedAt = new Date().toISOString();
            P.save();
            document.getElementById('contentArea').innerHTML = renderPoDetail(id);
            if (window.App) window.App.toast('Submitted for approval', 'success');
        },
        
        approvePo: function(id) {
            if (!confirm('Approve and issue this PO to the supplier?')) return;
            const po = (P.data.purchaseOrders || []).find(p => p.id === id);
            if (!po) return;
            po.status = 'issued';
            po.issuedAt = new Date().toISOString();
            P.save();
            document.getElementById('contentArea').innerHTML = renderPoDetail(id);
            if (window.App) window.App.toast('PO issued to supplier', 'success');
        },
        
        cancelPo: function(id) {
            if (!confirm('Cancel this PO? This cannot be undone.')) return;
            const po = (P.data.purchaseOrders || []).find(p => p.id === id);
            if (!po) return;
            po.status = 'cancelled';
            po.cancelledAt = new Date().toISOString();
            P.save();
            document.getElementById('contentArea').innerHTML = renderPoDetail(id);
            if (window.App) window.App.toast('PO cancelled', 'info');
        },
        
        closePo: function(id) {
            if (!confirm('Close this PO? All items must be received.')) return;
            const po = (P.data.purchaseOrders || []).find(p => p.id === id);
            if (!po) return;
            po.status = 'closed';
            po.closedAt = new Date().toISOString();
            P.save();
            document.getElementById('contentArea').innerHTML = renderPoDetail(id);
            if (window.App) window.App.toast('PO closed', 'success');
        },
        
        openReceiptModal: function(poId) {
            const po = (P.data.purchaseOrders || []).find(p => p.id === poId);
            if (!po) return;
            
            const received = getReceivedQuantities(po.id);
            
            PortalLikeModal(`Record Delivery for ${po.id}`, `
                <form id="receiptForm" onsubmit="ProcurementPO.saveReceipt(event, '${poId}')">
                    <div class="proc-form-row">
                        <div class="proc-form-group">
                            <label class="proc-form-label">Delivery Note Reference *</label>
                            <input class="proc-form-input" name="deliveryNoteRef" required placeholder="e.g. SUP-DN-001">
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Received Date *</label>
                            <input class="proc-form-input" type="date" name="receivedDate" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                    </div>
                    <div class="proc-form-group">
                        <label class="proc-form-label">Received By</label>
                        <input class="proc-form-input" name="receivedBy" value="${window.ERP?.currentUser?.name || 'Sarah Chen'}">
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <div class="proc-form-label" style="margin-bottom: 12px;">Line Items</div>
                        ${(po.lineItems || []).map(li => {
                            const prevRecv = received[li.line] || 0;
                            const outstanding = li.qty - prevRecv;
                            return `
                                <div style="padding: 16px; border: 1px solid var(--proc-border); border-radius: 10px; margin-bottom: 12px;">
                                    <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px;">Line ${li.line}: ${esc(li.description)}</div>
                                    <div style="font-size: 12px; color: var(--proc-text-muted); margin-bottom: 12px;">
                                        Ordered: ${li.qty} ${esc(li.uom)} · Previously received: ${prevRecv} · Outstanding: ${outstanding}
                                    </div>
                                    ${outstanding > 0 ? `
                                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                                            <div>
                                                <label class="proc-form-label" style="font-size: 11px;">Received Now</label>
                                                <input class="receipt-input" type="number" name="recv_${li.line}" min="0" max="${outstanding}" value="${outstanding}" data-line="${li.line}">
                                            </div>
                                            <div>
                                                <label class="proc-form-label" style="font-size: 11px;">Accepted</label>
                                                <input class="receipt-input" type="number" name="accepted_${li.line}" min="0" value="${outstanding}">
                                            </div>
                                            <div>
                                                <label class="proc-form-label" style="font-size: 11px;">Rejected</label>
                                                <input class="receipt-input reject" type="number" name="rejected_${li.line}" min="0" value="0">
                                            </div>
                                            <div>
                                                <label class="proc-form-label" style="font-size: 11px;">Damaged</label>
                                                <input class="receipt-input damage" type="number" name="damaged_${li.line}" min="0" value="0">
                                            </div>
                                        </div>
                                    ` : `<div style="font-size: 12px; color: var(--proc-success); font-weight: 600;">✓ Fully received</div>`}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </form>
            `, `
                <button class="proc-btn proc-btn-secondary" onclick="ProcurementPO.closeModal()">Cancel</button>
                <button class="proc-btn proc-btn-primary" onclick="document.getElementById('receiptForm').requestSubmit()">Post Goods Receipt</button>
            `, 'xl');
        },
        
        saveReceipt: function(e, poId) {
            e.preventDefault();
            const fd = new FormData(e.target);
            const po = (P.data.purchaseOrders || []).find(p => p.id === poId);
            if (!po) return;
            
            const lines = [];
            po.lineItems.forEach(li => {
                const recvNow = parseInt(fd.get(`recv_${li.line}`)) || 0;
                if (recvNow <= 0) return;
                
                const accepted = parseInt(fd.get(`accepted_${li.line}`)) || 0;
                const rejected = parseInt(fd.get(`rejected_${li.line}`)) || 0;
                const damaged = parseInt(fd.get(`damaged_${li.line}`)) || 0;
                
                lines.push({
                    line: li.line,
                    orderedQty: li.qty,
                    previouslyReceived: getReceivedQuantities(po.id)[li.line] || 0,
                    receivedNow: recvNow,
                    acceptedQty: accepted,
                    rejectedQty: rejected,
                    damagedQty: damaged,
                    notes: ''
                });
                
                // Create discrepancy if rejected/damaged
                if (rejected > 0 || damaged > 0) {
                    if (!P.data.discrepancies) P.data.discrepancies = [];
                    P.data.discrepancies.push({
                        id: 'DIS-' + Date.now() + '-' + li.line,
                        poId: po.id,
                        vendorId: po.vendorId,
                        type: rejected > 0 ? 'rejected' : 'damaged',
                        description: `Line ${li.line}: ${rejected} rejected, ${damaged} damaged of ${esc(li.description)}`,
                        status: 'open',
                        createdAt: new Date().toISOString()
                    });
                }
            });
            
            if (lines.length === 0) {
                alert('No quantities received');
                return;
            }
            
            const receipt = {
                id: 'GRN-2026-' + String((P.data.goodsReceipts || []).length + 1).padStart(4, '0'),
                poId: po.id,
                vendorId: po.vendorId,
                deliveryNoteRef: fd.get('deliveryNoteRef'),
                receivedDate: fd.get('receivedDate'),
                receivedBy: fd.get('receivedBy'),
                lines,
                status: 'posted',
                createdAt: new Date().toISOString()
            };
            
            if (!P.data.goodsReceipts) P.data.goodsReceipts = [];
            P.data.goodsReceipts.push(receipt);
            
            // Update PO status
            const newReceived = getReceivedQuantities(po.id);
            const allReceived = po.lineItems.every(li => (newReceived[li.line] || 0) >= li.qty);
            po.status = allReceived ? 'fully_received' : 'partially_received';
            
            P.save();
            this.closeModal();
            document.getElementById('contentArea').innerHTML = renderPoDetail(poId);
            if (window.App) window.App.toast(`Goods receipt ${receipt.id} posted`, 'success');
        },
        
        resolveDiscrepancy: function(disId) {
            const disc = (P.data.discrepancies || []).find(d => d.id === disId);
            if (!disc) return;
            const resolution = prompt('Resolution notes:');
            if (!resolution) return;
            disc.status = 'resolved';
            disc.resolution = resolution;
            disc.resolvedAt = new Date().toISOString();
            P.save();
            const poId = document.body.dataset.currentPoId;
            if (poId) document.getElementById('contentArea').innerHTML = renderPoDetail(poId);
            if (window.App) window.App.toast('Discrepancy resolved', 'success');
        },
        
        viewPrint: function(poId) {
            const po = (P.data.purchaseOrders || []).find(p => p.id === poId);
            if (!po) return;
            const supplier = getSupplier(po.vendorId);
            
            PortalLikeModal(`Purchase Order ${po.id}`, `
                <div class="po-document">
                    <div class="po-doc-header">
                        <div>
                            <div class="po-doc-logo">ABO GROUP</div>
                            <div style="font-size: 12px; color: var(--proc-text-muted); margin-top: 4px;">ABO International Group (Pty) Ltd</div>
                            <div style="font-size: 12px; color: var(--proc-text-muted);">12 Innovation Road, Sandton, 2196</div>
                            <div style="font-size: 12px; color: var(--proc-text-muted);">VAT: 4123456789</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="po-doc-title">Purchase Order</div>
                            <div class="po-doc-number">${esc(po.id)}</div>
                            <div style="font-size: 12px; color: var(--proc-text-muted); margin-top: 4px;">Rev ${po.revision} · ${P.formatDate(po.orderDate)}</div>
                        </div>
                    </div>
                    
                    <div class="po-doc-meta">
                        <div class="po-doc-meta-block">
                            <strong>To:</strong>
                            <span>${esc(supplier?.legalName || supplier?.tradingName || po.vendorId)}</span><br>
                            <span>${esc(supplier?.businessAddress || '')}</span><br>
                            <span>${esc(supplier?.province || '')}</span><br>
                            <span>VAT: ${esc(supplier?.vatNumber || '—')}</span>
                        </div>
                        <div class="po-doc-meta-block">
                            <strong>Details:</strong>
                            <span>Department: ${esc(po.department)}</span><br>
                            <span>Buyer: ${esc(po.buyer)}</span><br>
                            <span>Required By: ${P.formatDate(po.requiredDeliveryDate)}</span><br>
                            <span>Terms: ${esc(po.paymentTerms)}</span>
                        </div>
                    </div>
                    
                    <table class="po-doc-table">
                        <thead>
                            <tr>
                                <th style="width: 40px;">#</th>
                                <th>Description</th>
                                <th style="text-align: right; width: 80px;">Qty</th>
                                <th style="text-align: right; width: 100px;">Unit Price</th>
                                <th style="text-align: right; width: 120px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(po.lineItems || []).map(li => `
                                <tr>
                                    <td style="font-weight: 700; color: var(--proc-primary);">${li.line}</td>
                                    <td>${esc(li.description)}</td>
                                    <td style="text-align: right;">${li.qty} ${esc(li.uom)}</td>
                                    <td style="text-align: right;">${P.formatZAR(li.unitPrice)}</td>
                                    <td style="text-align: right; font-weight: 700;">${P.formatZAR(li.qty * li.unitPrice)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="po-doc-totals">
                        <div>
                            <div class="po-doc-total-row">
                                <span>Subtotal:</span>
                                <span>${P.formatZAR(po.subtotal)}</span>
                            </div>
                            <div class="po-doc-total-row">
                                <span>VAT (15%):</span>
                                <span>${P.formatZAR(po.tax)}</span>
                            </div>
                            <div class="po-doc-total-row grand">
                                <span>Total:</span>
                                <span>${P.formatZAR(po.total)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="font-size: 11px; color: var(--proc-text-muted); padding-top: 20px; border-top: 1px solid var(--proc-border);">
                        <strong>Delivery Address:</strong> ${esc(po.deliveryAddress)}<br>
                        <strong>Instructions:</strong> Please quote PO number on all correspondence and delivery notes. Delivery accepted at the address above during business hours.
                    </div>
                </div>
            `, `
                <button class="proc-btn proc-btn-secondary" onclick="ProcurementPO.closeModal()">Close</button>
                <button class="proc-btn proc-btn-primary" onclick="window.print()">🖨 Print</button>
            `, 'xl');
        },
        
        exportCSV: function() {
            const pos = getFilteredPos();
            const headers = ['PO #', 'Supplier', 'Department', 'Order Date', 'Required By', 'Total', 'Status'];
            const rows = pos.map(p => [
                p.id, getSupplier(p.vendorId)?.tradingName || p.vendorId, p.department,
                P.formatDate(p.orderDate), P.formatDate(p.requiredDeliveryDate),
                p.total, p.status
            ]);
            const csv = [headers, ...rows].map(row => row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `purchase-orders-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        },
        
        closeModal: function() {
            document.getElementById('procModal')?.remove();
        }
    };
    
    // Helper modal (reuse proc-modal styles)
    function PortalLikeModal(title, bodyHtml, footerHtml, size = 'lg') {
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
                    <button onclick="ProcurementPO.closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--proc-text-muted);">×</button>
                </div>
                <div class="proc-modal-body">${bodyHtml}</div>
                <div class="proc-modal-footer">${footerHtml}</div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
})();