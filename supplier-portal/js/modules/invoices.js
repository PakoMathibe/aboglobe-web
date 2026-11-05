// ============================================================
// PORTAL MODULE: Invoices (Phase 6 - Full)
// ============================================================

Portal.VIEWS.invoices = function() {
    const invoices = Portal.getMyInvoices();
    
    if (invoices.length === 0) {
        return `
            <div class="portal-card">
                <div class="p-empty">
                    <div class="p-empty-icon">💳</div>
                    <h3>No invoices yet</h3>
                    <p>You can submit invoices against purchase orders. Click below to get started.</p>
                    <button class="p-btn p-btn-primary" style="margin-top: 16px;" onclick="Portal.Invoices.openSubmit()">
                        Submit Invoice
                    </button>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="space-y-4">
            <div style="display: flex; justify-content: flex-end;">
                <button class="p-btn p-btn-primary" onclick="Portal.Invoices.openSubmit()">
                    + Submit Invoice
                </button>
            </div>
            
            <div class="portal-card">
                <div class="portal-section-title">My Invoices (${invoices.length})</div>
                <table class="portal-table">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>PO</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Match</th>
                            <th>Approval</th>
                            <th>Payment</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(inv => `
                            <tr onclick="Portal.Invoices.open('${inv.id}')">
                                <td>
                                    <div style="font-family: monospace; font-weight: 700; color: var(--p-accent);">${Portal.esc(inv.id)}</div>
                                    <div style="font-size: 11px; color: var(--p-muted);">${Portal.esc(inv.supplierInvoiceNumber)}</div>
                                </td>
                                <td style="font-family: monospace; font-size: 12px;">${Portal.esc(inv.poId || '—')}</td>
                                <td style="font-size: 12px;">${Portal.formatDate(inv.invoiceDate)}</td>
                                <td style="font-weight: 700;">${Portal.formatZAR(inv.total)}</td>
                                <td>${matchBadge(inv.matchingStatus)}</td>
                                <td>${approvalBadge(inv.approvalStatus)}</td>
                                <td>${paymentBadge(inv.paymentStatus)}</td>
                                <td style="text-align: right;">
                                    <button class="p-btn p-btn-secondary p-btn-sm" onclick="event.stopPropagation(); Portal.Invoices.open('${inv.id}')">View →</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

function matchBadge(s) {
    const map = {
        pending: { c: 'portal-badge-neutral', l: 'Pending' },
        matched: { c: 'portal-badge-success', l: 'Matched' },
        matched_within_tolerance: { c: 'portal-badge-success', l: 'Matched' },
        exception: { c: 'portal-badge-danger', l: 'Exception' },
        manually_approved: { c: 'portal-badge-warning', l: 'Approved' }
    };
    const m = map[s] || { c: 'portal-badge-neutral', l: s };
    return `<span class="portal-badge ${m.c}">${m.l}</span>`;
}

function approvalBadge(s) {
    const map = {
        pending: { c: 'portal-badge-warning', l: 'Pending' },
        approved: { c: 'portal-badge-success', l: 'Approved' },
        rejected: { c: 'portal-badge-danger', l: 'Rejected' }
    };
    const m = map[s] || { c: 'portal-badge-neutral', l: s };
    return `<span class="portal-badge ${m.c}">${m.l}</span>`;
}

function paymentBadge(s) {
    const map = {
        not_scheduled: { c: 'portal-badge-neutral', l: '—' },
        scheduled_simulated: { c: 'portal-badge-info', l: 'Scheduled*' },
        paid_simulated: { c: 'portal-badge-success', l: 'Paid*' }
    };
    const m = map[s] || { c: 'portal-badge-neutral', l: s };
    return `<span class="portal-badge ${m.c}">${m.l}</span>`;
}

Portal.Invoices = {
    open: function(invId) {
        const inv = (Procurement.data.invoices || []).find(i => i.id === invId);
        if (!inv) {
            Portal.toast('Invoice not found', 'error');
            return;
        }
        
        Portal.openModal(`Invoice ${inv.id}`, `
            <div class="space-y-4">
                <div style="padding: 14px; background: var(--p-surface); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 11px; color: var(--p-muted); text-transform: uppercase; font-weight: 700;">Amount</div>
                        <div style="font-weight: 800; font-size: 22px; color: var(--p-accent); margin-top: 2px;">${Portal.formatZAR(inv.total)}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="display: flex; gap: 6px; margin-bottom: 4px;">${matchBadge(inv.matchingStatus)}${approvalBadge(inv.approvalStatus)}</div>
                        ${paymentBadge(inv.paymentStatus)}
                    </div>
                </div>
                
                <div class="p-grid-2">
                    <div class="portal-card" style="padding: 14px;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Invoice Info</div>
                        <div class="p-field-row"><span class="p-field-row-label">Supplier Ref</span><span class="p-field-row-value">${Portal.esc(inv.supplierInvoiceNumber)}</span></div>
                        <div class="p-field-row"><span class="p-field-row-label">Linked PO</span><span class="p-field-row-value">${Portal.esc(inv.poId || '—')}</span></div>
                        <div class="p-field-row"><span class="p-field-row-label">Invoice Date</span><span class="p-field-row-value">${Portal.formatDate(inv.invoiceDate)}</span></div>
                        <div class="p-field-row"><span class="p-field-row-label">Due Date</span><span class="p-field-row-value">${Portal.formatDate(inv.dueDate)}</span></div>
                    </div>
                    <div class="portal-card" style="padding: 14px;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Financials</div>
                        <div class="p-field-row"><span class="p-field-row-label">Subtotal</span><span class="p-field-row-value">${Portal.formatZAR(inv.subtotal)}</span></div>
                        <div class="p-field-row"><span class="p-field-row-label">VAT</span><span class="p-field-row-value">${Portal.formatZAR(inv.tax)}</span></div>
                        <div class="p-field-row" style="font-weight: 800;"><span class="p-field-row-label" style="color: var(--p-text);">Total</span><span class="p-field-row-value" style="color: var(--p-accent);">${Portal.formatZAR(inv.total)}</span></div>
                    </div>
                </div>
                
                ${inv.matchingStatus === 'exception' ? `
                    <div class="p-alert p-alert-warning">
                        <div class="p-alert-icon">⚠</div>
                        <div>
                            <strong>This invoice has exceptions</strong><br>
                            The buyer is reviewing discrepancies. Please check your messages for clarification requests.
                        </div>
                    </div>
                ` : ''}
                
                ${inv.paymentStatus === 'paid_simulated' ? `
                    <div class="p-alert p-alert-success">
                        <div class="p-alert-icon">✓</div>
                        <div>
                            <strong>Payment recorded</strong><br>
                            Marked as paid (simulated) on ${Portal.formatDate(inv.paidAt)}.
                        </div>
                    </div>
                ` : ''}
                
                <div style="display: flex; justify-content: flex-end; padding-top: 12px; border-top: 1px solid var(--p-border);">
                    <button class="p-btn p-btn-secondary" onclick="Portal.closeModal()">Close</button>
                </div>
            </div>
        `, 'lg');
    },
    
    openSubmit: function() {
        const pos = Portal.getMyOrders().filter(p => ['issued', 'partially_received', 'fully_received'].includes(p.status));
        
        if (pos.length === 0) {
            Portal.toast('You have no eligible POs to invoice against', 'error');
            return;
        }
        
        Portal.openModal('Submit Invoice', `
            <form id="portalInvoiceForm" onsubmit="Portal.Invoices.submit(event)">
                <div class="p-form-group">
                    <label class="p-form-label">Purchase Order *</label>
                    <select class="p-select" name="poId" required onchange="Portal.Invoices.populateLines(this.value)">
                        <option value="">Select PO...</option>
                        ${pos.map(p => `<option value="${p.id}" data-total="${p.total}">${p.id} — ${Portal.formatZAR(p.total)}</option>`).join('')}
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="p-form-group">
                        <label class="p-form-label">Supplier Invoice # *</label>
                        <input class="p-input" name="supplierInvoiceNumber" required placeholder="e.g. SUP-INV-001">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Invoice Date *</label>
                        <input class="p-input" type="date" name="invoiceDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                
                <div class="p-form-group">
                    <label class="p-form-label">Line Items (auto-populated from PO)</label>
                    <div id="invoiceLines" style="border: 1px solid var(--p-border); border-radius: 8px; padding: 12px; background: var(--p-surface); min-height: 80px;">
                        <p style="font-size: 12px; color: var(--p-muted); text-align: center; padding: 20px;">Select a PO to auto-populate line items</p>
                    </div>
                </div>
                
                <div class="p-form-group">
                    <label class="p-form-label">Notes (optional)</label>
                    <textarea class="p-textarea" name="notes" rows="2" placeholder="Any additional context for the buyer..."></textarea>
                </div>
            </form>
        `, 'lg');
        
        // Replace footer with submit
        const modal = document.getElementById('portalModal');
        if (modal) {
            const footer = document.createElement('div');
            footer.className = 'p-modal-footer';
            footer.innerHTML = `
                <button class="p-btn p-btn-secondary" onclick="Portal.closeModal()">Cancel</button>
                <button class="p-btn p-btn-primary" onclick="document.getElementById('portalInvoiceForm').requestSubmit()">Submit Invoice</button>
            `;
            modal.querySelector('.p-modal').appendChild(footer);
        }
    },
    
    populateLines: function(poId) {
        const po = (Procurement.data.purchaseOrders || []).find(p => p.id === poId);
        const container = document.getElementById('invoiceLines');
        if (!container) return;
        
        if (!po) {
            container.innerHTML = '<p style="font-size: 12px; color: var(--p-muted); text-align: center; padding: 20px;">Select a PO to auto-populate line items</p>';
            return;
        }
        
        container.innerHTML = (po.lineItems || []).map(li => `
            <div style="display: grid; grid-template-columns: 2fr 80px 100px 100px; gap: 8px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--p-border);">
                <div style="font-size: 13px; font-weight: 600;">${Portal.esc(li.description)}</div>
                <div style="font-size: 12px; text-align: right; color: var(--p-muted);">${li.qty} ${Portal.esc(li.uom)}</div>
                <div style="font-size: 12px; text-align: right;">${Portal.formatZAR(li.unitPrice)}</div>
                <div style="font-size: 13px; font-weight: 700; text-align: right; color: var(--p-accent);">${Portal.formatZAR(li.qty * li.unitPrice)}</div>
            </div>
        `).join('');
    },
    
    submit: function(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const poId = fd.get('poId');
        const po = (Procurement.data.purchaseOrders || []).find(p => p.id === poId);
        
        if (!po) {
            alert('Please select a valid PO');
            return;
        }
        
        // Generate invoice from PO lines
        const lineItems = (po.lineItems || []).map(li => ({
            line: li.line,
            description: li.description,
            qty: li.qty,
            uom: li.uom,
            unitPrice: li.unitPrice
        }));
        
        const subtotal = lineItems.reduce((s, li) => s + (li.qty * li.unitPrice), 0);
        const tax = subtotal * 0.15;
        
        const inv = {
            id: 'INV-2026-' + String((Procurement.data.invoices || []).length + 1).padStart(4, '0'),
            supplierInvoiceNumber: fd.get('supplierInvoiceNumber'),
            poId: po.id,
            vendorId: Portal.currentSupplier.id,
            invoiceDate: fd.get('invoiceDate'),
            receivedDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            currency: 'ZAR',
            lineItems,
            subtotal,
            tax,
            total: subtotal + tax,
            matchingStatus: 'pending',
            approvalStatus: 'pending',
            paymentStatus: 'not_scheduled',
            notes: fd.get('notes'),
            createdAt: new Date().toISOString()
        };
        
        if (!Procurement.data.invoices) Procurement.data.invoices = [];
        Procurement.data.invoices.push(inv);
        Procurement.save();
        
        Portal.closeModal();
        Portal.navigateTo('invoices');
        Portal.toast('Invoice submitted for processing');
    }
};