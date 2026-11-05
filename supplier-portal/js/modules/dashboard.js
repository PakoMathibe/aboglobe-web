// ============================================================
// PORTAL MODULE: Dashboard
// ============================================================

Portal.VIEWS.dashboard = function() {
    const s = Portal.currentSupplier;
    if (!s) return '<p>Not signed in</p>';
    
    const rfqs = Portal.getMyRfqs();
    const quotations = Portal.getMyQuotations();
    const orders = Portal.getMyOrders();
    const invoices = Portal.getMyInvoices();
    
    const openRfqs = rfqs.filter(r => r.status === 'published');
    const submittedQuotes = quotations.filter(q => q.status === 'submitted' || q.status === 'under_review');
    const awardedQuotes = quotations.filter(q => q.status === 'awarded');
    const pendingInvoices = invoices.filter(i => i.status !== 'paid');
    
    const profilePct = Portal.Identity.getProfileCompleteness();
    const expiringDocs = Portal.Identity.getExpiringDocuments();
    const canQuote = Portal.Identity.canQuote();
    const blockers = Portal.Identity.getQuoteBlockers();
    
    // Build task list
    const tasks = [];
    
    // Deadline-critical RFQs
    openRfqs.forEach(r => {
        const deadline = new Date(r.submissionDeadline);
        const days = Math.floor((deadline - Date.now()) / 86400000);
        if (days <= 3 && days >= 0) {
            tasks.push({
                icon: '!',
                type: 'urgent',
                title: `${r.title} closes soon`,
                meta: `${r.id} · ${days}d ${Math.floor((deadline - Date.now()) % 86400000 / 3600000)}h left`,
                action: `Portal.Opportunities.open('${r.id}')`
            });
        }
    });
    
    // Profile incomplete
    if (profilePct < 100) {
        tasks.push({
            icon: '📋',
            type: 'warning',
            title: `Complete your company profile (${profilePct}%)`,
            meta: 'Required for compliance and eligibility',
            action: `Portal.navigateTo('profile')`
        });
    }
    
    // Expiring documents
    expiringDocs.forEach(d => {
        tasks.push({
            icon: '⚠',
            type: 'warning',
            title: `${d.documentType} expiring soon`,
            meta: `Expires ${Portal.formatDate(d.expiryDate)}`,
            action: `Portal.navigateTo('profile')`
        });
    });
    
    // Can't quote (blockers)
    if (!canQuote && blockers.length > 0) {
        tasks.push({
            icon: '⊘',
            type: 'urgent',
            title: 'You cannot submit quotations',
            meta: blockers[0],
            action: `Portal.navigateTo('profile')`
        });
    }
    
    // Draft quotations
    const drafts = quotations.filter(q => q.status === 'draft');
    drafts.forEach(q => {
        tasks.push({
            icon: '📝',
            type: 'info',
            title: `Draft quotation for ${q.rfqId}`,
            meta: 'Ready to submit',
            action: `Portal.Quotations.edit('${q.id}')`
        });
    });
    
    return `
        <div class="space-y-6">
            <!-- Welcome banner -->
            <div class="bg-gradient-to-br from-portal-navy to-portal-slate rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-5 -mr-20 -mt-20"></div>
                <div class="absolute bottom-0 right-32 w-32 h-32 rounded-full bg-blue-400 opacity-10"></div>
                <div class="relative z-10">
                    <div class="text-sm text-blue-200 mb-1">Welcome back</div>
                    <h2 class="text-2xl lg:text-3xl font-bold mb-2">${Portal.esc(s.tradingName)}</h2>
                    <div class="flex flex-wrap items-center gap-3 text-sm">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10">
                            <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            ${s.onboardingStatus === 'qualified' ? 'Qualified Supplier' : 'Onboarding Pending'}
                        </span>
                        ${canQuote 
                            ? '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10"><span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>Eligible to Quote</span>'
                            : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/30"><span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>${Portal.esc(blockers[0] || 'Not eligible')}</span>`
                        }
                    </div>
                </div>
            </div>
            
            <!-- KPI grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                ${kpiCard('Open RFQs', openRfqs.length, 'Awaiting response', 'blue', '🔍', `Portal.navigateTo('opportunities')`)}
                ${kpiCard('Submitted Quotes', submittedQuotes.length, 'Under review', 'amber', '📄', `Portal.navigateTo('quotations')`)}
                ${kpiCard('Awarded', awardedQuotes.length, 'Won business', 'green', '🏆', `Portal.navigateTo('quotations')`)}
                ${kpiCard('Pending Invoices', pendingInvoices.length, 'Awaiting payment', 'red', '💳', `Portal.navigateTo('invoices')`)}
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Tasks -->
                <div class="lg:col-span-2">
                    <div class="portal-card">
                        <div class="portal-section-title">Your Tasks</div>
                        ${tasks.length === 0 ? `
                            <div class="p-empty">
                                <div class="p-empty-icon">✓</div>
                                <h3>All caught up</h3>
                                <p>No outstanding tasks. Browse open RFQs to find new opportunities.</p>
                            </div>
                        ` : tasks.map(t => `
                            <div class="portal-task" onclick="${t.action}">
                                <div class="portal-task-icon ${t.type}">${t.icon}</div>
                                <div class="portal-task-content">
                                    <div class="portal-task-title">${Portal.esc(t.title)}</div>
                                    <div class="portal-task-meta">${Portal.esc(t.meta)}</div>
                                </div>
                                <svg class="w-4 h-4 text-portal-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Profile completeness + quick info -->
                <div class="space-y-6">
                    <div class="portal-card">
                        <div class="portal-section-title">Profile</div>
                        <div style="text-align: center; padding: 8px 0 16px;">
                            <div style="font-size: 42px; font-weight: 800; color: var(--p-accent);">${profilePct}%</div>
                            <div style="font-size: 12px; color: var(--p-muted); margin-top: 4px;">Complete</div>
                        </div>
                        <div class="p-progress" style="margin-bottom: 12px;">
                            <div class="p-progress-fill ${profilePct === 100 ? 'success' : profilePct >= 70 ? 'accent' : 'warning'}" style="width: ${profilePct}%;"></div>
                        </div>
                        <button class="p-btn p-btn-secondary p-btn-sm" style="width: 100%;" onclick="Portal.navigateTo('profile')">
                            ${profilePct === 100 ? 'View Profile' : 'Complete Profile'}
                        </button>
                    </div>
                    
                    <div class="portal-card">
                        <div class="portal-section-title">Recent Activity</div>
                        ${[].concat(
                            quotations.slice(0, 3).map(q => ({
                                title: `Quotation ${q.id}`,
                                meta: `${Portal.badgeLabel(q.status)}`,
                                time: q.updatedAt || q.createdAt,
                                badge: q.status
                            })),
                            awardedQuotes.slice(0, 1).map(q => ({
                                title: `${q.rfqId} awarded`,
                                meta: `You won this opportunity`,
                                time: q.awardedAt,
                                badge: 'awarded'
                            }))
                        ).length === 0 ? '<p style="font-size: 13px; color: var(--p-muted); padding: 12px 0;">No recent activity</p>' :
                            [].concat(
                                quotations.slice(0, 3).map(q => ({
                                    title: `Quotation ${q.id}`,
                                    meta: q.rfqId,
                                    time: q.updatedAt || q.createdAt,
                                    badge: q.status
                                })),
                                awardedQuotes.slice(0, 1).map(q => ({
                                    title: `${q.rfqId} awarded`,
                                    meta: `You won this opportunity`,
                                    time: q.awardedAt,
                                    badge: 'awarded'
                                }))
                            ).map(a => `
                                <div style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center;">
                                    <div style="min-width: 0;">
                                        <div style="font-size: 12px; font-weight: 600; color: var(--p-navy);">${Portal.esc(a.title)}</div>
                                        <div style="font-size: 11px; color: var(--p-muted);">${Portal.esc(a.meta)} · ${Portal.timeAgo(a.time)}</div>
                                    </div>
                                    <span class="portal-badge ${Portal.badgeClass(a.badge)}" style="flex-shrink: 0;">${Portal.badgeLabel(a.badge)}</span>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
};

function kpiCard(label, value, sub, color, icon, onclick) {
    return `
        <div class="portal-kpi" onclick="${onclick}">
            <div class="portal-kpi-icon ${color}">${icon}</div>
            <div class="portal-kpi-label">${label}</div>
            <div class="portal-kpi-value">${value}</div>
            <div class="portal-kpi-sub">${sub}</div>
        </div>
    `;
}