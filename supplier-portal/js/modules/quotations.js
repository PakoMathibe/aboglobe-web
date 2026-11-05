// ============================================================
// PORTAL MODULE: Quotations
// Create, edit, submit quotations
// ============================================================

Portal.VIEWS.quotations = function() {
    const quotations = Portal.getMyQuotations();
    
    if (quotations.length === 0) {
        return `
            <div class="portal-card">
                <div class="p-empty">
                    <div class="p-empty-icon">📄</div>
                    <h3>No quotations yet</h3>
                    <p>Browse open RFQs to submit your first quotation.</p>
                    <button class="p-btn p-btn-primary" style="margin-top: 16px;" onclick="Portal.navigateTo('opportunities')">
                        Browse Open RFQs
                    </button>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="portal-card">
            <div class="portal-section-title">My Quotations (${quotations.length})</div>
            <table class="portal-table">
                <thead>
                    <tr>
                        <th>Quotation #</th>
                        <th>RFQ</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${quotations.map(q => {
                        const rfq = Procurement.data.rfqs.find(r => r.id === q.rfqId);
                        const total = (q.lineItems || []).reduce((s, li) => s + (li.qty * li.unitPrice), 0);
                        return `
                            <tr onclick="Portal.Quotations.edit('${q.id}')">
                                <td style="font-family: monospace; font-weight: 700; color: var(--p-accent);">${Portal.esc(q.id)}</td>
                                <td>
                                    <div style="font-weight: 600;">${Portal.esc(rfq?.title || q.rfqId)}</div>
                                    <div style="font-size: 11px; color: var(--p-muted);">${Portal.esc(q.rfqId)}</div>
                                </td>
                                <td style="font-weight: 700;">${Portal.formatZAR(total)}</td>
                                <td><span class="portal-badge ${Portal.badgeClass(q.status)}">${Portal.badgeLabel(q.status)}</span></td>
                                <td style="font-size: 12px; color: var(--p-muted);">${Portal.timeAgo(q.updatedAt || q.createdAt)}</td>
                                <td style="text-align: right;">
                                    <button class="p-btn p-btn-secondary p-btn-sm" onclick="event.stopPropagation(); Portal.Quotations.edit('${q.id}')">Open →</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
};

// ============================================================
// ACTIONS
// ============================================================
Portal.Quotations = {
    create: function(rfqId) {
        const rfq = Procurement.data.rfqs.find(r => r.id === rfqId);
        if (!rfq) return;
        
        // Check for existing quotation
        const existing = Portal.getMyQuotations().find(q => q.rfqId === rfqId);
        if (existing) {
            Portal.Quotations.edit(existing.id);
            return;
        }
        
        const id = 'QUO-' + Date.now();
        const quote = {
            id,
            rfqId,
            vendorId: Portal.currentSupplier.id,
            supplierReference: `Q-${rfqId}-${Portal.currentSupplier.id.slice(-3)}`,
            revision: 1,
            status: 'draft',
            currency: 'ZAR',
            lineItems: (rfq.lineItems || []).map(li => ({
                line: li.line,
                description: li.description,
                qty: li.qty,
                uom: li.uom,
                unitPrice: 0,
                deliveryDays: 30,
                notes: ''
            })),
            deliveryLeadDays: 30,
            validUntil: addDays(new Date(), 30).toISOString().slice(0, 10),
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!Procurement.data.quotations) Procurement.data.quotations = [];
        Procurement.data.quotations.push(quote);
        Procurement.save();
        
        Portal.Quotations.edit(id);
    },
    
    edit: function(id) {
        const quote = Procurement.data.quotations.find(q => q.id === id);
        if (!quote) return;
        const rfq = Procurement.data.rfqs.find(r => r.id === quote.rfqId);
        
        const isReadOnly = quote.status !== 'draft';
        const total = (quote.lineItems || []).reduce((s, li) => s + (li.qty * li.unitPrice), 0);
        
        Portal.openModal(
            `Quotation ${quote.id} ${isReadOnly ? '— ' + Portal.badgeLabel(quote.status) : ''}`,
            `
            <div class="space-y-4">
                ${isReadOnly ? `
                    <div class="p-alert p-alert-info">
                        <div class="p-alert-icon">ℹ</div>
                        <div>This quotation is <strong>${Portal.badgeLabel(quote.status).toLowerCase()}</strong> and can no longer be edited.</div>
                    </div>
                ` : ''}
                
                <div style="padding: 12px; background: var(--p-surface); border-radius: 8px;">
                    <div style="font-size: 11px; color: var(--p-muted); text-transform: uppercase; font-weight: 700;">For RFQ</div>
                    <div style="font-weight: 700; font-size: 14px; margin-top: 4px;">${Portal.esc(rfq?.title || quote.rfqId)}</div>
                    <div style="font-size: 12px; color: var(--p-muted); margin-top: 2px;">${Portal.esc(quote.rfqId)}</div>
                </div>
                
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Line Items</div>
                    <div id="quoteLines">
                        ${quote.lineItems.map((li, idx) => renderQuoteLine(li, idx, isReadOnly)).join('')}
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="p-form-group">
                        <label class="p-form-label">Delivery Lead Time (days)</label>
                        <input class="p-input" type="number" value="${quote.deliveryLeadDays}" 
                            ${isReadOnly ? 'disabled' : ''}
                            oninput="Portal.Quotations.updateField('${quote.id}', 'deliveryLeadDays', parseInt(this.value))">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Valid Until</label>
                        <input class="p-input" type="date" value="${quote.validUntil}" 
                            ${isReadOnly ? 'disabled' : ''}
                            onchange="Portal.Quotations.updateField('${quote.id}', 'validUntil', this.value)">
                    </div>
                </div>
                
                <div class="p-form-group">
                    <label class="p-form-label">Commercial Notes</label>
                    <textarea class="p-textarea" rows="3" ${isReadOnly ? 'disabled' : ''}
                        oninput="Portal.Quotations.updateField('${quote.id}', 'notes', this.value)">${Portal.esc(quote.notes || '')}</textarea>
                </div>
                
                <div style="padding: 16px; background: var(--p-accent-light); border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: var(--p-accent); text-transform: uppercase;">Total Quotation Value</div>
                        <div style="font-size: 24px; font-weight: 800; color: var(--p-accent); margin-top: 4px;" id="quoteTotal">${Portal.formatZAR(total)}</div>
                    </div>
                    <div style="font-size: 11px; color: var(--p-muted); text-align: right;">
                        All prices excl. VAT<br>
                        ${quote.lineItems.length} line items
                    </div>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--p-border);">
                    <button class="p-btn p-btn-secondary" onclick="Portal.closeModal()">${isReadOnly ? 'Close' : 'Save Draft'}</button>
                    ${!isReadOnly ? `<button class="p-btn p-btn-success" onclick="Portal.Quotations.submit('${quote.id}')">Submit Quotation →</button>` : ''}
                </div>
            </div>
        `, 'xl');
    },
    
    updateLine: function(quoteId, lineIdx, field, value) {
        const quote = Procurement.data.quotations.find(q => q.id === quoteId);
        if (!quote || !quote.lineItems[lineIdx]) return;
        
        quote.lineItems[lineIdx][field] = value;
        quote.updatedAt = new Date().toISOString();
        Procurement.save();
        
        // Update the visible line total
        const line = quote.lineItems[lineIdx];
        const lineTotalEl = document.getElementById(`lineTotal-${lineIdx}`);
        if (lineTotalEl) lineTotalEl.textContent = Portal.formatZAR((line.qty || 0) * (line.unitPrice || 0));
        
        // Update overall total
        const total = quote.lineItems.reduce((s, li) => s + (li.qty * li.unitPrice), 0);
        const totalEl = document.getElementById('quoteTotal');
        if (totalEl) totalEl.textContent = Portal.formatZAR(total);
    },
    
    updateField: function(quoteId, field, value) {
        const quote = Procurement.data.quotations.find(q => q.id === quoteId);
        if (!quote) return;
        quote[field] = value;
        quote.updatedAt = new Date().toISOString();
        Procurement.save();
    },
    
    submit: function(quoteId) {
        const quote = Procurement.data.quotations.find(q => q.id === quoteId);
        if (!quote) return;
        
        // Validate
        const hasPricing = quote.lineItems.some(li => li.unitPrice > 0);
        if (!hasPricing) {
            Portal.toast('Please enter pricing for at least one line item', 'error');
            return;
        }
        
        if (!confirm('Submit this quotation? You will not be able to edit it after submission.')) return;
        
        quote.status = 'submitted';
        quote.submittedAt = new Date().toISOString();
        quote.updatedAt = new Date().toISOString();
        Procurement.save();
        
        Portal.closeModal();
        Portal.navigateTo('quotations');
        Portal.toast('Quotation submitted successfully');
    }
};

function renderQuoteLine(li, idx, isReadOnly) {
    return `
        <div class="quote-line">
            <div>
                <div style="font-size: 11px; color: var(--p-muted);">Line ${li.line}</div>
                <div style="font-weight: 600; font-size: 12px; color: var(--p-navy);">${Portal.esc(li.description)}</div>
                <div style="font-size: 11px; color: var(--p-muted);">${li.qty} ${Portal.esc(li.uom)}</div>
            </div>
            <div>
                <input class="p-input" type="number" placeholder="Unit price" value="${li.unitPrice || ''}"
                    ${isReadOnly ? 'disabled' : ''}
                    oninput="Portal.Quotations.updateLine('${li._quoteId || ''}', ${idx}, 'unitPrice', parseFloat(this.value) || 0)">
            </div>
            <div>
                <input class="p-input" type="number" placeholder="Days" value="${li.deliveryDays || ''}"
                    ${isReadOnly ? 'disabled' : ''}
                    oninput="Portal.Quotations.updateLine('${li._quoteId || ''}', ${idx}, 'deliveryDays', parseInt(this.value) || 0)">
            </div>
            <div></div>
            <div class="quote-line-total" id="lineTotal-${idx}">${Portal.formatZAR((li.qty || 0) * (li.unitPrice || 0))}</div>
        </div>
    `;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}