// ============================================================
// PORTAL MODULE: Purchase Orders (Phase 5 - Full)
// ============================================================

Portal.VIEWS.orders = function() {
    const orders = Portal.getMyOrders();
    
    if (orders.length === 0) {
        return `
            <div class="portal-card">
                <div class="p-empty">
                    <div class="p-empty-icon">📦</div>
                    <h3>No purchase orders yet</h3>
                    <p>When a buyer issues a purchase order to you, it will appear here.</p>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="portal-card">
            <div class="portal-section-title">Purchase Orders (${orders.length})</div>
            <table class="portal-table">
                <thead>
                    <tr>
                        <th>PO #</th>
                        <th>Issued</th>
                        <th>Delivery By</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => `
                        <tr onclick="Portal.Orders.open('${o.id}')">
                            <td style="font-family: monospace; font-weight: 700; color: var(--p-accent);">${Portal.esc(o.id)}</td>
                            <td>${Portal.formatDate(o.issuedAt || o.createdAt)}</td>
                            <td>${Portal.formatDate(o.requiredDeliveryDate)}</td>
                            <td style="font-weight: 700;">${Portal.formatZAR(o.total)}</td>
                            <td><span class="portal-badge ${Portal.badgeClass(o.status)}">${Portal.badgeLabel(o.status)}</span></td>
                            <td style="text-align: right;">
                                <button class="p-btn p-btn-secondary p-btn-sm" onclick="event.stopPropagation(); Portal.Orders.open('${o.id}')">View →</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
};

Portal.Orders = {
    open: function(poId) {
        const po = (Procurement.data.purchaseOrders || []).find(p => p.id === poId);
        if (!po) {
            Portal.toast('PO not found', 'error');
            return;
        }
        
        const canAcknowledge = po.status === 'issued' && po.acknowledgement?.status === 'pending';
        const isAcknowledged = po.acknowledgement?.status === 'acknowledged';
        
        Portal.openModal(`Purchase Order ${po.id}`, `
            <div class="space-y-4">
                <div style="padding: 14px; background: var(--p-surface); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 11px; color: var(--p-muted); text-transform: uppercase; font-weight: 700;">Status</div>
                            <div style="font-weight: 700; font-size: 15px; margin-top: 2px;">${Portal.badgeLabel(po.status)}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 11px; color: var(--p-muted); text-transform: uppercase; font-weight: 700;">Total</div>
                            <div style="font-weight: 800; font-size: 22px; color: var(--p-accent); margin-top: 2px;">${Portal.formatZAR(po.total)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="p-grid-2">
                    <div class="portal-card" style="padding: 16px;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Order Details</div>
                        <div class="p-field-row"><span class="p-field-row-label">Order Date</span><span class="p-field-row-value">${Portal.formatDate(po.orderDate)}</span></div>
                        <div class="p-field-row"><span class="p-field-row-label">Required By</span><span class="p-field-row-value">${Portal.formatDate(po.requiredDeliveryDate)}</span></div>
                        <div class="p-field-row"><span class="p-field-row-label">Payment Terms</span><span class="p-field-row-value">${Portal.esc(po.paymentTerms || 'Net 30')}</span></div>
                    </div>
                    <div class="portal-card" style="padding: 16px;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Delivery</div>
                        <div style="font-size: 12px; color: var(--p-slate); line-height: 1.5;">${Portal.esc(po.deliveryAddress || '—')}</div>
                    </div>
                </div>
                
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Line Items</div>
                    <table class="portal-table" style="border: 1px solid var(--p-border); border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr>
                                <th style="padding: 10px;">#</th>
                                <th style="padding: 10px;">Description</th>
                                <th style="padding: 10px; text-align: right;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Unit Price</th>
                                <th style="padding: 10px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(po.lineItems || []).map(li => `
                                <tr>
                                    <td style="padding: 10px; font-weight: 700; color: var(--p-accent);">${li.line}</td>
                                    <td style="padding: 10px;">${Portal.esc(li.description)}</td>
                                    <td style="padding: 10px; text-align: right;">${li.qty} ${Portal.esc(li.uom)}</td>
                                    <td style="padding: 10px; text-align: right;">${Portal.formatZAR(li.unitPrice)}</td>
                                    <td style="padding: 10px; text-align: right; font-weight: 700;">${Portal.formatZAR(li.qty * li.unitPrice)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                ${isAcknowledged ? `
                    <div class="p-alert p-alert-success">
                        <div class="p-alert-icon">✓</div>
                        <div>
                            <strong>You acknowledged this PO</strong><br>
                            Confirmed delivery: ${Portal.formatDate(po.acknowledgement.confirmedDeliveryDate)}
                        </div>
                    </div>
                ` : canAcknowledge ? `
                    <div class="p-alert p-alert-warning">
                        <div class="p-alert-icon">⚠</div>
                        <div>
                            <strong>Action required</strong><br>
                            Please acknowledge this PO to confirm you've received it.
                        </div>
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Confirmed Delivery Date</label>
                        <input class="p-input" type="date" id="ackDeliveryDate" value="${po.requiredDeliveryDate}">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Comments (optional)</label>
                        <textarea class="p-textarea" id="ackComments" rows="2" placeholder="Any delivery notes or concerns..."></textarea>
                    </div>
                ` : ''}
                
                <div style="display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--p-border);">
                    <button class="p-btn p-btn-secondary" onclick="Portal.closeModal()">Close</button>
                    ${canAcknowledge ? `
                        <button class="p-btn p-btn-primary" onclick="Portal.Orders.acknowledge('${po.id}')">Acknowledge PO</button>
                    ` : ''}
                </div>
            </div>
        `, 'xl');
    },
    
    acknowledge: function(poId) {
        const po = (Procurement.data.purchaseOrders || []).find(p => p.id === poId);
        if (!po) return;
        
        const date = document.getElementById('ackDeliveryDate')?.value;
        const comments = document.getElementById('ackComments')?.value || '';
        
        if (!date) {
            alert('Please confirm a delivery date');
            return;
        }
        
        po.acknowledgement = {
            status: 'acknowledged',
            acknowledgedAt: new Date().toISOString(),
            confirmedDeliveryDate: date,
            comments
        };
        
        Procurement.save();
        Portal.closeModal();
        Portal.navigateTo('orders');
        Portal.toast('PO acknowledged successfully');
    }
};