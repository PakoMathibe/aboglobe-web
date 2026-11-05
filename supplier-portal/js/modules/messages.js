// ============================================================
// PORTAL MODULE: Messages
// Buyer-supplier communication linked to RFQs
// ============================================================

Portal.VIEWS.messages = function() {
    const messages = getMyMessages();
    
    return `
        <div class="space-y-6">
            <div class="portal-card">
                <div class="portal-section-title">Messages from ABO Group (${messages.length})</div>
                ${messages.length === 0 ? `
                    <div class="p-empty">
                        <div class="p-empty-icon">💬</div>
                        <h3>No messages yet</h3>
                        <p>Messages from the ABO procurement team will appear here. You can ask clarifications on RFQs from the opportunity detail view.</p>
                    </div>
                ` : messages.map(m => `
                    <div style="padding: 16px; border: 1px solid var(--p-border); border-radius: 10px; margin-bottom: 12px; ${m.read ? '' : 'background: #EFF6FF;'}">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <div style="font-weight: 700; font-size: 13px; color: var(--p-navy);">${Portal.esc(m.subject)}</div>
                            <div style="font-size: 11px; color: var(--p-muted);">${Portal.timeAgo(m.createdAt)}</div>
                        </div>
                        <div style="font-size: 12px; color: var(--p-slate); line-height: 1.5;">${Portal.esc(m.body)}</div>
                        ${m.rfqId ? `<div style="margin-top: 8px; font-size: 11px; color: var(--p-muted);">Related: <a style="color: var(--p-accent); cursor: pointer;" onclick="Portal.Opportunities.open('${m.rfqId}')">${Portal.esc(m.rfqId)}</a></div>` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div class="p-alert p-alert-info">
                <div class="p-alert-icon">ℹ</div>
                <div>
                    <strong>Need to ask a clarification?</strong> Open an opportunity and use the clarification form. Buyer responses will appear in the RFQ details.
                </div>
            </div>
        </div>
    `;
};

function getMyMessages() {
    if (!Procurement.data.portalMessages || !Portal.currentSupplier) return [];
    return Procurement.data.portalMessages
        .filter(m => m.supplierId === Portal.currentSupplier.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}