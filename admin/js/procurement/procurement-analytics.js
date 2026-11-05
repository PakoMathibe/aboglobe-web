// ============================================================
// PROCUREMENT - ANALYTICS & REPORTING
// ============================================================

(function() {
    'use strict';
    
    if (!window.Procurement) return;
    if (typeof window.Views === 'undefined') return;
    
    const P = window.Procurement;
    const esc = P.escapeHtml;
    
    function initAnalyticsModule() {
        if (!P.data) { P.init(); }
        if (!P.data) { setTimeout(initAnalyticsModule, 100); return; }
        
        window.Views.procurementAnalytics = function() {
            return renderAnalyticsDashboard();
        };
        
        console.log('[Analytics] Module ready');
    }
    
    if (P.initialized && P.data) {
        initAnalyticsModule();
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initAnalyticsModule, 50));
    }
    
    function renderAnalyticsDashboard() {
        const stats = calculateStats();
        
        return `
            <div class="proc-dashboard-page">
                <div style="margin-bottom: 24px;">
                    <h2 style="font-size: 24px; font-weight: 800; color: var(--proc-text); margin-bottom: 4px;">Procurement Analytics</h2>
                    <p style="font-size: 14px; color: var(--proc-text-muted);">Spend, sourcing performance, supplier metrics & savings</p>
                </div>
                
                <!-- Spend Overview -->
                <div style="margin-bottom: 12px; font-size: 11px; font-weight: 700; color: var(--proc-text-muted); text-transform: uppercase; letter-spacing: 0.06em;">Spend Analysis</div>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="analytics-title">Total PO Value</div>
                        <div class="analytics-big-number">${P.formatZAR(stats.totalPoValue)}</div>
                        <div class="analytics-sub">${stats.totalPoCount} purchase orders</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Invoiced Value</div>
                        <div class="analytics-big-number">${P.formatZAR(stats.totalInvoiced)}</div>
                        <div class="analytics-sub">${stats.invoiceCount} invoices captured</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Awarded Spend</div>
                        <div class="analytics-big-number">${P.formatZAR(stats.awardedValue)}</div>
                        <div class="analytics-sub">${stats.awardCount} awards issued</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Outstanding Payables</div>
                        <div class="analytics-big-number" style="color: var(--proc-danger);">${P.formatZAR(stats.outstanding)}</div>
                        <div class="analytics-sub">Approved, not yet paid</div>
                    </div>
                </div>
                
                <!-- Sourcing Performance -->
                <div style="margin: 24px 0 12px; font-size: 11px; font-weight: 700; color: var(--proc-text-muted); text-transform: uppercase; letter-spacing: 0.06em;">Sourcing Performance</div>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="analytics-title">RFQs Published</div>
                        <div class="analytics-big-number">${stats.rfqPublished}</div>
                        <div class="analytics-sub">${stats.rfqClosed} closed · ${stats.rfqAwarded} awarded</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Avg. Quotations / RFQ</div>
                        <div class="analytics-big-number">${stats.avgQuotes.toFixed(1)}</div>
                        <div class="analytics-sub">${stats.totalQuotes} total submissions</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Response Rate</div>
                        <div class="analytics-big-number">${stats.responseRate}%</div>
                        <div class="analytics-sub">Suppliers who submitted</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Avg. Cycle Time</div>
                        <div class="analytics-big-number">${stats.avgCycleTime} <span style="font-size: 16px; color: var(--proc-text-muted);">days</span></div>
                        <div class="analytics-sub">RFQ publish → award</div>
                    </div>
                </div>
                
                <!-- Spend by Category -->
                <div class="analytics-card" style="margin-top: 24px;">
                    <div class="analytics-title">Spend by Category</div>
                    ${stats.spendByCategory.length === 0 ? '<p style="font-size: 13px; color: var(--proc-text-muted); padding: 20px 0;">No data</p>' : `
                        <div style="display: grid; gap: 10px; margin-top: 12px;">
                            ${stats.spendByCategory.map(cat => `
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="min-width: 130px; font-size: 12px; font-weight: 600;">${esc(cat.category)}</div>
                                    <div style="flex: 1; height: 8px; background: #F3F4F6; border-radius: 4px; overflow: hidden;">
                                        <div style="width: ${(cat.value / stats.maxCategoryValue * 100)}%; height: 100%; background: linear-gradient(90deg, var(--proc-primary-light), var(--proc-primary)); border-radius: 4px;"></div>
                                    </div>
                                    <div style="min-width: 100px; text-align: right; font-size: 12px; font-weight: 700;">${P.formatZAR(cat.value)}</div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
                
                <!-- Spend by Supplier -->
                <div class="analytics-card" style="margin-top: 20px;">
                    <div class="analytics-title">Top Suppliers by Spend</div>
                    ${stats.topSuppliers.length === 0 ? '<p style="font-size: 13px; color: var(--proc-text-muted); padding: 20px 0;">No data</p>' : `
                        <div style="margin-top: 12px;">
                            ${stats.topSuppliers.map(s => `
                                <div class="supplier-perf-row">
                                    <div class="supplier-perf-name">${esc(s.name)}</div>
                                    <div class="supplier-perf-bar">
                                        <div class="supplier-perf-fill" style="width: ${(s.value / stats.topSuppliers[0].value * 100)}%;"></div>
                                    </div>
                                    <div class="supplier-perf-value">${P.formatZAR(s.value)}</div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
                
                <!-- Savings -->
                <div style="margin: 24px 0 12px; font-size: 11px; font-weight: 700; color: var(--proc-text-muted); text-transform: uppercase; letter-spacing: 0.06em;">Savings Analysis</div>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="analytics-title">Estimated Savings</div>
                        <div class="analytics-big-number" style="color: var(--proc-success);">${P.formatZAR(stats.estimatedSavings)}</div>
                        <div class="analytics-sub">Awarded vs. estimated budget</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Avg. Savings %</div>
                        <div class="analytics-big-number">${stats.savingsPct}%</div>
                        <div class="analytics-sub">Across awarded RFQs</div>
                    </div>
                </div>
                
                <!-- Exceptions -->
                <div style="margin: 24px 0 12px; font-size: 11px; font-weight: 700; color: var(--proc-text-muted); text-transform: uppercase; letter-spacing: 0.06em;">Exceptions & Risk</div>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="analytics-title">Open Invoice Exceptions</div>
                        <div class="analytics-big-number" style="color: ${stats.openExceptions > 0 ? 'var(--proc-danger)' : 'var(--proc-success)'};">${stats.openExceptions}</div>
                        <div class="analytics-sub">${stats.invoiceExceptionCount} total detected</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Open Discrepancies</div>
                        <div class="analytics-big-number" style="color: ${stats.openDiscrepancies > 0 ? 'var(--proc-danger)' : 'var(--proc-success)'};">${stats.openDiscrepancies}</div>
                        <div class="analytics-sub">Goods receipt issues</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Overdue Invoices</div>
                        <div class="analytics-big-number" style="color: ${stats.overdueInvoices > 0 ? 'var(--proc-danger)' : 'var(--proc-success)'};">${stats.overdueInvoices}</div>
                        <div class="analytics-sub">Past due date</div>
                    </div>
                    <div class="analytics-card">
                        <div class="analytics-title">Suspended Vendors</div>
                        <div class="analytics-big-number">${stats.suspendedVendors}</div>
                        <div class="analytics-sub">Ineligible for new POs</div>
                    </div>
                </div>
                
                <div style="margin-top: 24px; padding: 12px 16px; background: #F9FAFB; border-radius: 8px; font-size: 11px; color: var(--proc-text-muted); text-align: center;">
                    ℹ All amounts are in ZAR. Simulated financial statuses are marked with *. Numbers derived from current demo state.
                </div>
            </div>
        `;
    }
    
    function calculateStats() {
        const rfqs = P.data.rfqs || [];
        const quotations = P.data.quotations || [];
        const awards = P.data.awards || [];
        const pos = P.data.purchaseOrders || [];
        const invoices = P.data.invoices || [];
        const exceptions = P.data.invoiceExceptions || [];
        const discrepancies = P.data.discrepancies || [];
        const vendors = P.data.suppliers || [];
        
        // Total PO value
        const totalPoValue = pos.filter(p => ['issued', 'partially_received', 'fully_received', 'closed'].includes(p.status))
            .reduce((s, p) => s + (p.total || 0), 0);
        
        // Total invoiced
        const totalInvoiced = invoices.reduce((s, i) => s + (i.total || 0), 0);
        
        // Awarded
        const awardedValue = awards.filter(a => a.status === 'issued').reduce((s, a) => s + (a.awardedValue || 0), 0);
        
        // Outstanding
        const outstanding = invoices.filter(i => i.approvalStatus === 'approved' && i.paymentStatus !== 'paid_simulated')
            .reduce((s, i) => s + (i.total || 0), 0);
        
        // Sourcing
        const rfqPublished = rfqs.filter(r => ['published', 'closed', 'under_evaluation', 'awarded'].includes(r.status)).length;
        const rfqClosed = rfqs.filter(r => ['closed', 'under_evaluation', 'awarded'].includes(r.status)).length;
        const rfqAwarded = rfqs.filter(r => r.status === 'awarded').length;
        const totalQuotes = quotations.filter(q => q.status === 'submitted' || q.status === 'awarded' || q.status === 'unsuccessful').length;
        const avgQuotes = rfqPublished > 0 ? totalQuotes / rfqPublished : 0;
        
        // Response rate
        let invitations = 0;
        let responded = 0;
        rfqs.filter(r => ['closed', 'under_evaluation', 'awarded'].includes(r.status)).forEach(r => {
            const invited = (r.invitedVendors || []).length;
            const quotesForRfq = quotations.filter(q => q.rfqId === r.id && (q.status === 'submitted' || q.status === 'awarded' || q.status === 'unsuccessful')).length;
            invitations += invited;
            responded += quotesForRfq;
        });
        const responseRate = invitations > 0 ? Math.round((responded / invitations) * 100) : 0;
        
        // Cycle time
        let totalCycleDays = 0;
        let cycleCount = 0;
        rfqs.filter(r => r.status === 'awarded' && r.publishedAt && r.awardedAt).forEach(r => {
            const days = (new Date(r.awardedAt) - new Date(r.publishedAt)) / 86400000;
            totalCycleDays += days;
            cycleCount++;
        });
        const avgCycleTime = cycleCount > 0 ? Math.round(totalCycleDays / cycleCount) : 0;
        
        // Spend by category
        const catMap = {};
        pos.filter(p => ['issued', 'partially_received', 'fully_received'].includes(p.status)).forEach(p => {
            const rfq = rfqs.find(r => r.id === p.rfqId);
            const cat = rfq?.category || 'Uncategorised';
            catMap[cat] = (catMap[cat] || 0) + (p.total || 0);
        });
        const spendByCategory = Object.entries(catMap).map(([category, value]) => ({ category, value }))
            .sort((a, b) => b.value - a.value).slice(0, 6);
        const maxCategoryValue = spendByCategory.length > 0 ? spendByCategory[0].value : 1;
        
        // Top suppliers
        const supMap = {};
        pos.filter(p => ['issued', 'partially_received', 'fully_received'].includes(p.status)).forEach(p => {
            const vendor = vendors.find(v => v.id === p.vendorId);
            const name = vendor?.tradingName || p.vendorId;
            supMap[name] = (supMap[name] || 0) + (p.total || 0);
        });
        const topSuppliers = Object.entries(supMap).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value).slice(0, 5);
        
        // Savings
        let estimatedBudget = 0;
        let awardedTotal = 0;
        rfqs.filter(r => r.status === 'awarded').forEach(r => {
            const est = (r.lineItems || []).reduce((s, li) => s + (li.qty * li.estUnitPrice), 0);
            estimatedBudget += est;
            awardedTotal += r.awardedValue || 0;
        });
        const estimatedSavings = estimatedBudget - awardedTotal;
        const savingsPct = estimatedBudget > 0 ? Math.round((estimatedSavings / estimatedBudget) * 100) : 0;
        
        // Exceptions
        const openExceptions = exceptions.filter(e => e.status === 'open').length;
        const invoiceExceptionCount = exceptions.length;
        const openDiscrepancies = discrepancies.filter(d => d.status === 'open').length;
        
        // Overdue
        const now = new Date();
        const overdueInvoices = invoices.filter(i => 
            i.dueDate && new Date(i.dueDate) < now && i.paymentStatus !== 'paid_simulated'
        ).length;
        
        // Suspended vendors
        const suspendedVendors = vendors.filter(v => v.operationalStatus === 'suspended').length;
        
        return {
            totalPoValue, totalPoCount: pos.length,
            totalInvoiced, invoiceCount: invoices.length,
            awardedValue, awardCount: awards.filter(a => a.status === 'issued').length,
            outstanding,
            rfqPublished, rfqClosed, rfqAwarded,
            totalQuotes, avgQuotes, responseRate, avgCycleTime,
            spendByCategory, maxCategoryValue,
            topSuppliers,
            estimatedSavings, savingsPct,
            openExceptions, invoiceExceptionCount,
            openDiscrepancies,
            overdueInvoices,
            suspendedVendors
        };
    }
    
})();