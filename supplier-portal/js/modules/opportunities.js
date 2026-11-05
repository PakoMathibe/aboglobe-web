// ============================================================
// PORTAL MODULE: Opportunities (Open RFQs)
// ============================================================

Portal.VIEWS.opportunities = function() {
    const rfqs = Portal.getMyRfqs().filter(r => r.status === 'published');
    const canQuote = Portal.Identity.canQuote();
    
    if (!canQuote) {
        const blockers = Portal.Identity.getQuoteBlockers();
        return `
            <div class="p-alert p-alert-warning">
                <div class="p-alert-icon">⚠</div>
                <div>
                    <div style="font-weight: 700; margin-bottom: 4px;">You cannot submit quotations yet</div>
                    <ul style="margin: 0; padding-left: 18px; font-size: 12px;">
                        ${blockers.map(b => `<li>${Portal.esc(b)}</li>`).join('')}
                    </ul>
                    <button class="p-btn p-btn-primary p-btn-sm" style="margin-top: 8px;" onclick="Portal.navigateTo('profile')">
                        Complete Profile
                    </button>
                </div>
            </div>
        `;
    }
    
    if (rfqs.length === 0) {
        return `
            <div class="portal-card">
                <div class="p-empty">
                    <div class="p-empty-icon">🔍</div>
                    <h3>No open opportunities</h3>
                    <p>You have no open RFQs to respond to right now. Check back soon or contact your buyer.</p>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="space-y-4">
            <div class="p-alert p-alert-info">
                <div class="p-alert-icon">ℹ</div>
                <div>You have <strong>${rfqs.length}</strong> open opportunities. Click any to view details and submit a quotation.</div>
            </div>
            ${rfqs.map(r => renderOpportunityCard(r)).join('')}
        </div>
    `;
};

function renderOpportunityCard(rfq) {
    const countdown = Portal.countdown(rfq.submissionDeadline);
    const estValue = (rfq.lineItems || []).reduce((s, li) => s + li.qty * li.estUnitPrice, 0);
    const myQuotes = Portal.getMyQuotations().filter(q => q.rfqId === rfq.id);
    const existingQuote = myQuotes[0];
    
    const cardClass = countdown.class === 'critical' ? 'critical' : countdown.class === 'urgent' ? 'urgent' : '';
    
    return `
        <div class="opportunity-card ${cardClass}" onclick="Portal.Opportunities.open('${rfq.id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                <div style="flex: 1; min-width: 0;">
                    <div class="opportunity-ref">${Portal.esc(rfq.id)}</div>
                    <div class="opportunity-title">${Portal.esc(rfq.title)}</div>
                    <div class="opportunity-meta">
                        <span>📍 ${Portal.esc(rfq.deliveryLocation)}</span>
                        <span>📦 ${(rfq.lineItems || []).length} item${(rfq.lineItems || []).length !== 1 ? 's' : ''}</span>
                        <span>💰 ${Portal.formatZAR(estValue)} est.</span>
                    </div>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                    <div class="opportunity-countdown ${countdown.class}">⏱ ${countdown.label}</div>
                    ${existingQuote ? `<div style="margin-top: 8px;"><span class="portal-badge ${Portal.badgeClass(existingQuote.status)}">${Portal.badgeLabel(existingQuote.status)}</span></div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// ============================================================
// DETAIL VIEW
// ============================================================
Portal.Opportunities = {
    open: function(rfqId) {
        const rfq = Procurement.data.rfqs.find(r => r.id === rfqId);
        if (!rfq) {
            Portal.toast('RFQ not found', 'error');
            return;
        }
        
        const myQuote = Portal.getMyQuotations().find(q => q.rfqId === rfqId);
        const countdown = Portal.countdown(rfq.submissionDeadline);
        const estValue = (rfq.lineItems || []).reduce((s, li) => s + li.qty * li.estUnitPrice, 0);
        const canQuote = Portal.Identity.canQuote();
        
        Portal.openModal(rfq.title, `
            <div class="space-y-4">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-family: monospace; font-size: 11px; color: var(--p-accent); font-weight: 700;">${Portal.esc(rfq.id)}</div>
                        <div style="font-size: 12px; color: var(--p-muted); margin-top: 2px;">${Portal.esc(rfq.department)} · ${Portal.esc(rfq.category)}</div>
                    </div>
                    <div class="opportunity-countdown ${countdown.class}">⏱ ${countdown.label}</div>
                </div>
                
                <div class="p-alert p-alert-info">
                    <div class="p-alert-icon">ℹ</div>
                    <div style="font-size: 12px;">
                        <strong>Submission deadline:</strong> ${Portal.formatDateTime(rfq.submissionDeadline)}<br>
                        <strong>Questions deadline:</strong> ${Portal.formatDateTime(rfq.questionsDeadline)}
                    </div>
                </div>
                
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Scope of Work</div>
                    <p style="font-size: 13px; color: var(--p-navy); line-height: 1.6;">${Portal.esc(rfq.justification)}</p>
                </div>
                
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Line Items (${(rfq.lineItems || []).length})</div>
                    <table class="portal-table" style="font-size: 12px; border: 1px solid var(--p-border); border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr>
                                <th style="padding: 8px 10px;">#</th>
                                <th style="padding: 8px 10px;">Description</th>
                                <th style="padding: 8px 10px; text-align: right;">Qty</th>
                                <th style="padding: 8px 10px; text-align: right;">Est. Unit</th>
                                <th style="padding: 8px 10px; text-align: right;">Est. Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(rfq.lineItems || []).map(li => `
                                <tr>
                                    <td style="padding: 8px 10px; font-weight: 700; color: var(--p-accent);">${li.line}</td>
                                    <td style="padding: 8px 10px;">${Portal.esc(li.description)}</td>
                                    <td style="padding: 8px 10px; text-align: right;">${li.qty} ${Portal.esc(li.uom)}</td>
                                    <td style="padding: 8px 10px; text-align: right;">${Portal.formatZAR(li.estUnitPrice)}</td>
                                    <td style="padding: 8px 10px; text-align: right; font-weight: 700;">${Portal.formatZAR(li.qty * li.estUnitPrice)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="background: var(--p-surface);">
                                <td colspan="4" style="padding: 10px; text-align: right; font-weight: 700;">Estimated Total</td>
                                <td style="padding: 10px; text-align: right; font-weight: 800; color: var(--p-accent);">${Portal.formatZAR(estValue)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; background: var(--p-surface); border-radius: 8px; font-size: 12px;">
                    <div><span style="color: var(--p-muted);">Payment Terms:</span> <strong>${Portal.esc(rfq.paymentTerms)}</strong></div>
                    <div><span style="color: var(--p-muted);">Validity:</span> <strong>${rfq.validityPeriod} days</strong></div>
                    <div><span style="color: var(--p-muted);">Warranty:</span> <strong>${rfq.warrantyMonths} months</strong></div>
                    <div><span style="color: var(--p-muted);">Delivery By:</span> <strong>${Portal.formatDate(rfq.requiredDeliveryDate)}</strong></div>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--p-border);">
                    <button class="p-btn p-btn-secondary" onclick="Portal.closeModal()">Close</button>
                    ${myQuote 
                        ? `<button class="p-btn p-btn-primary" onclick="Portal.closeModal(); Portal.Quotations.edit('${myQuote.id}')">View My Quotation</button>`
                        : canQuote 
                            ? `<button class="p-btn p-btn-primary" onclick="Portal.closeModal(); Portal.Quotations.create('${rfq.id}')">Submit Quotation →</button>`
                            : `<button class="p-btn p-btn-secondary" disabled>Not Eligible</button>`
                    }
                </div>
            </div>
        `, 'xl');
    }
};