// ============================================================
// PROCUREMENT - VENDOR MANAGEMENT MODULE
// Register + Dashboard + Supplier 360°
// ============================================================

(function() {
    'use strict';
    
    const P = window.Procurement;
    const esc = P.escapeHtml;
    
    // ============================================================
    // REGISTER IN VIEWS
    // ============================================================
    
    if (typeof window.Views === 'undefined') {
        console.error('[Procurement] Views not defined. Ensure admin-core.js loaded first.');
        return;
    }
    
    window.Views.procurementVendors = function() {
        return renderVendorDashboard();
    };
    
    // ============================================================
    // MAIN DASHBOARD
    // ============================================================
    
    function renderVendorDashboard() {
        const suppliers = P.getSuppliers();
        
        const stats = {
            total: suppliers.length,
            active: suppliers.filter(s => s.operationalStatus === 'active').length,
            pending: suppliers.filter(s => ['submitted', 'under_review', 'info_required', 'draft'].includes(s.onboardingStatus)).length,
            suspended: suppliers.filter(s => s.operationalStatus === 'suspended').length,
            attention: suppliers.filter(s => s.complianceStatus === 'attention_required').length,
            expired: suppliers.filter(s => s.complianceStatus === 'expired').length,
            highRisk: suppliers.filter(s => s.riskRating === 'high' || s.riskRating === 'critical').length
        };
        
        return `
            <div class="proc-dashboard-page">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 800; color: var(--proc-text); margin-bottom: 4px;">Vendor Management</h2>
                        <p style="font-size: 14px; color: var(--proc-text-muted);">Supplier lifecycle, compliance, and performance</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="proc-btn proc-btn-secondary" onclick="ProcurementVendors.exportCSV()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Export
                        </button>
                        <button class="proc-btn proc-btn-primary" onclick="ProcurementVendors.openCreateModal()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Add Supplier
                        </button>
                    </div>
                </div>
                
                <div class="proc-dashboard">
                    ${kpiCard('Total Suppliers', stats.total, 'Registered vendors', '', 'primary')}
                    ${kpiCard('Active', stats.active, 'Approved & operating', '+12%', 'success')}
                    ${kpiCard('Pending Review', stats.pending, 'Awaiting qualification', '', 'warning')}
                    ${kpiCard('Compliance Alerts', stats.attention + stats.expired, `${stats.expired} expired`, '', stats.expired > 0 ? 'danger' : 'warning')}
                    ${kpiCard('High Risk', stats.highRisk, 'Requires attention', '', 'danger')}
                    ${kpiCard('Suspended', stats.suspended, 'Not eligible for POs', '', 'danger')}
                </div>
                
                ${renderRegister()}
            </div>
        `;
    }
    
    function kpiCard(label, value, sub, trend, variant) {
        const trendHtml = trend ? `<span class="proc-kpi-trend ${trend.startsWith('+') ? 'up' : 'down'}">${trend}</span>` : '';
        return `
            <div class="proc-kpi kpi-${variant}" onclick="ProcurementVendors.filterByKpi('${variant}')">
                ${trendHtml}
                <div class="proc-kpi-label">${label}</div>
                <div class="proc-kpi-value">${value}</div>
                <div class="proc-kpi-sub">${sub}</div>
            </div>
        `;
    }
    
    // ============================================================
    // VENDOR REGISTER TABLE
    // ============================================================
    
    let currentFilters = { search: '', status: 'all', risk: 'all', compliance: 'all', category: 'all' };
    let currentSort = { column: 'tradingName', direction: 'asc' };
    let selectedVendors = new Set();
    
    function renderRegister() {
        const suppliers = getFilteredSuppliers();
        const categories = [...new Set(P.getSuppliers().flatMap(s => s.categories || []))].sort();
        
        return `
            <div class="proc-register">
                <div class="proc-register-toolbar">
                    <div class="proc-filter-row">
                        <div class="proc-search-input">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input type="text" placeholder="Search vendors..." 
                                value="${esc(currentFilters.search)}"
                                oninput="ProcurementVendors.setFilter('search', this.value)">
                        </div>
                        <select class="proc-filter-chip" onchange="ProcurementVendors.setFilter('status', this.value)">
                            <option value="all" ${currentFilters.status === 'all' ? 'selected' : ''}>All Statuses</option>
                            <option value="active" ${currentFilters.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="pending" ${currentFilters.status === 'pending' ? 'selected' : ''}>Pending Review</option>
                            <option value="qualified" ${currentFilters.status === 'qualified' ? 'selected' : ''}>Qualified</option>
                            <option value="suspended" ${currentFilters.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                            <option value="rejected" ${currentFilters.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                        <select class="proc-filter-chip" onchange="ProcurementVendors.setFilter('risk', this.value)">
                            <option value="all" ${currentFilters.risk === 'all' ? 'selected' : ''}>All Risk Levels</option>
                            <option value="low" ${currentFilters.risk === 'low' ? 'selected' : ''}>Low Risk</option>
                            <option value="medium" ${currentFilters.risk === 'medium' ? 'selected' : ''}>Medium Risk</option>
                            <option value="high" ${currentFilters.risk === 'high' ? 'selected' : ''}>High Risk</option>
                            <option value="critical" ${currentFilters.risk === 'critical' ? 'selected' : ''}>Critical</option>
                        </select>
                        <select class="proc-filter-chip" onchange="ProcurementVendors.setFilter('compliance', this.value)">
                            <option value="all" ${currentFilters.compliance === 'all' ? 'selected' : ''}>All Compliance</option>
                            <option value="compliant" ${currentFilters.compliance === 'compliant' ? 'selected' : ''}>Compliant</option>
                            <option value="attention_required" ${currentFilters.compliance === 'attention_required' ? 'selected' : ''}>Attention Required</option>
                            <option value="expired" ${currentFilters.compliance === 'expired' ? 'selected' : ''}>Expired</option>
                        </select>
                        <select class="proc-filter-chip" onchange="ProcurementVendors.setFilter('category', this.value)">
                            <option value="all" ${currentFilters.category === 'all' ? 'selected' : ''}>All Categories</option>
                            ${categories.map(c => `<option value="${esc(c)}" ${currentFilters.category === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                ${suppliers.length === 0 ? emptyState() : `
                <div style="overflow-x: auto;">
                    <table class="proc-table">
                        <thead>
                            <tr>
                                <th style="width: 40px;"><input type="checkbox" onchange="ProcurementVendors.toggleAll(this)"></th>
                                <th onclick="ProcurementVendors.sort('tradingName')">Vendor ↕</th>
                                <th>Categories</th>
                                <th>Location</th>
                                <th onclick="ProcurementVendors.sort('onboardingStatus')">Status ↕</th>
                                <th>Compliance</th>
                                <th onclick="ProcurementVendors.sort('performanceScore')">Performance ↕</th>
                                <th>Risk</th>
                                <th style="text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${suppliers.map(s => renderVendorRow(s)).join('')}
                        </tbody>
                    </table>
                </div>
                `}
            </div>
        `;
    }
    
    function renderVendorRow(supplier) {
        const perf = P.calculatePerformanceScore(supplier.id);
        const riskSummary = P.getVendorRiskSummary(supplier.id);
        
        const statusBadge = getOnboardingBadge(supplier.onboardingStatus);
        const complianceBadge = getComplianceBadge(supplier.complianceStatus);
        const riskBadge = getRiskBadge(riskSummary.level);
        
        const perfDisplay = perf.insufficient 
            ? '<span style="color: var(--proc-text-muted); font-size: 12px;">Insufficient data</span>'
            : `<div style="display: flex; align-items: center; gap: 8px;">
                <div style="flex: 1; height: 4px; background: #F3F4F6; border-radius: 2px; min-width: 40px;">
                    <div style="width: ${perf.score}%; height: 100%; background: ${perf.score >= 85 ? 'var(--proc-success)' : perf.score >= 70 ? 'var(--proc-warning)' : 'var(--proc-danger)'}; border-radius: 2px;"></div>
                </div>
                <span style="font-weight: 700; font-size: 12px;">${perf.score}</span>
            </div>`;
        
        return `
            <tr onclick="ProcurementVendors.openSupplier('${supplier.id}')">
                <td onclick="event.stopPropagation()">
                    <input type="checkbox" ${selectedVendors.has(supplier.id) ? 'checked' : ''} 
                        onchange="ProcurementVendors.toggleSelect('${supplier.id}', this.checked)">
                </td>
                <td>
                    <div class="vendor-cell">
                        <div class="vendor-avatar" style="background: ${getAvatarColor(supplier.tradingName)};">${getInitials(supplier.tradingName)}</div>
                        <div>
                            <div class="vendor-name">${esc(supplier.tradingName)}</div>
                            <div class="vendor-ref">${esc(supplier.id)} · ${esc(supplier.registrationNumber || 'No reg #')}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        ${(supplier.categories || []).slice(0, 2).map(c => `
                            <span style="font-size: 10px; padding: 2px 6px; background: #F3F4F6; border-radius: 4px; color: #4B5563;">${esc(c)}</span>
                        `).join('')}
                        ${(supplier.categories || []).length > 2 ? `<span style="font-size: 10px; padding: 2px 6px; color: var(--proc-text-muted);">+${supplier.categories.length - 2}</span>` : ''}
                    </div>
                </td>
                <td><span style="font-size: 12px; color: var(--proc-text-muted);">${esc(supplier.province || '—')}</span></td>
                <td>${statusBadge}</td>
                <td>${complianceBadge}</td>
                <td>${perfDisplay}</td>
                <td>${riskBadge}</td>
                <td style="text-align: right;" onclick="event.stopPropagation()">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementVendors.openSupplier('${supplier.id}')">View →</button>
                </td>
            </tr>
        `;
    }
    
    // ============================================================
    // SUPPLIER 360° PROFILE
    // ============================================================
    
    let activeTab = 'overview';
    
    function renderSupplierDetail(vendorId) {
        const supplier = P.getSupplier(vendorId);
        if (!supplier) return '<div class="proc-empty"><h3>Vendor not found</h3></div>';
        
        const tabs = [
            { id: 'overview', label: 'Overview' },
            { id: 'company', label: 'Company' },
            { id: 'contacts', label: 'Contacts' },
            { id: 'categories', label: 'Categories' },
            { id: 'onboarding', label: 'Onboarding' },
            { id: 'compliance', label: 'Compliance' },
            { id: 'risk', label: 'Risk' },
            { id: 'performance', label: 'Performance' },
            { id: 'contracts', label: 'Contracts' },
            { id: 'activity', label: 'Activity' }
        ];
        
        return `
            <div class="proc-detail-page">
                <div style="margin-bottom: 16px;">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementVendors.backToRegister()">
                        ← Back to Register
                    </button>
                </div>
                
                <div class="proc-detail-header">
                    <div class="proc-detail-header-inner">
                        <div class="proc-vendor-hero">
                            <div class="vendor-avatar" style="background: ${getAvatarColor(supplier.tradingName)};">${getInitials(supplier.tradingName)}</div>
                            <div>
                                <h1>${esc(supplier.tradingName)}</h1>
                                <p>${esc(supplier.legalName)} · ${esc(supplier.registrationNumber || 'No reg #')}</p>
                                <div class="proc-hero-badges">
                                    ${getOnboardingBadge(supplier.onboardingStatus)}
                                    ${getComplianceBadge(supplier.complianceStatus)}
                                    ${getRiskBadge(P.getVendorRiskSummary(vendorId).level)}
                                    ${supplier.bbbeeLevel ? `<span class="proc-badge">B-BBEE L${supplier.bbbeeLevel}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="proc-hero-actions">
                            ${renderHeroActions(supplier)}
                        </div>
                    </div>
                </div>
                
                <div class="proc-tabs">
                    ${tabs.map(t => `
                        <button class="proc-tab ${activeTab === t.id ? 'active' : ''}" 
                            onclick="ProcurementVendors.switchTab('${t.id}')">${t.label}</button>
                    `).join('')}
                </div>
                
                <div class="proc-tab-content">
                    ${renderTabContent(activeTab, supplier)}
                </div>
            </div>
        `;
    }
    
    function renderHeroActions(supplier) {
        const actions = [];
        
        if (supplier.onboardingStatus === 'submitted') {
            actions.push(`<button class="primary" onclick="ProcurementVendors.transition('${supplier.id}', 'under_review')">Start Review</button>`);
        }
        if (supplier.onboardingStatus === 'under_review') {
            actions.push(`<button class="primary" onclick="ProcurementVendors.transition('${supplier.id}', 'qualified')">Qualify Vendor</button>`);
            actions.push(`<button onclick="ProcurementVendors.transition('${supplier.id}', 'rejected')">Reject</button>`);
        }
        if (supplier.onboardingStatus === 'draft') {
            actions.push(`<button class="primary" onclick="ProcurementVendors.transition('${supplier.id}', 'submitted')">Submit</button>`);
        }
        if (supplier.operationalStatus === 'suspended') {
            actions.push(`<button class="primary" onclick="ProcurementVendors.transition('${supplier.id}', 'qualified')">Reactivate</button>`);
        }
        if (supplier.operationalStatus === 'active' && supplier.onboardingStatus === 'qualified') {
            actions.push(`<button onclick="ProcurementVendors.suspend('${supplier.id}')">Suspend</button>`);
        }
        
        actions.push(`<button onclick="ProcurementVendors.openEditModal('${supplier.id}')">Edit</button>`);
        
        return actions.join('');
    }
    
    function renderTabContent(tabId, supplier) {
        switch (tabId) {
            case 'overview': return renderOverviewTab(supplier);
            case 'company': return renderCompanyTab(supplier);
            case 'contacts': return renderContactsTab(supplier);
            case 'categories': return renderCategoriesTab(supplier);
            case 'onboarding': return renderOnboardingTab(supplier);
            case 'compliance': return renderComplianceTab(supplier);
            case 'risk': return renderRiskTab(supplier);
            case 'performance': return renderPerformanceTab(supplier);
            case 'contracts': return renderContractsTab(supplier);
            case 'activity': return renderActivityTab(supplier);
            default: return renderOverviewTab(supplier);
        }
    }
    
    // ----- OVERVIEW TAB -----
    function renderOverviewTab(s) {
        const readiness = P.getReadiness(s.id);
        const risks = P.getVendorRiskSummary(s.id);
        const perf = P.calculatePerformanceScore(s.id);
        const compliance = P.getCompliance(s.id);
        const expiring = compliance.filter(c => {
            const state = P.getComplianceItemState(c);
            return state.state === 'expiring' || state.state === 'expiring_soon';
        });
        const duplicates = P.detectDuplicates(s.id);
        
        return `
            ${duplicates.length > 0 ? `
                <div style="background: var(--proc-danger-bg); border: 1px solid #FECACA; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--proc-danger); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;">!</div>
                        <div>
                            <div style="font-weight: 700; color: var(--proc-danger); margin-bottom: 4px;">Potential Duplicate Detected</div>
                            <div style="font-size: 13px; color: #7F1D1D;">
                                ${duplicates.map(d => `Matches ${esc(d.vendor.tradingName)} (${d.reasons.join(', ')})`).join('<br>')}
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${readiness.blockers.length > 0 && s.onboardingStatus !== 'qualified' ? `
                <div style="background: var(--proc-warning-bg); border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                    <div style="font-weight: 700; color: var(--proc-warning); margin-bottom: 8px;">${readiness.blockers.length} Blocker${readiness.blockers.length > 1 ? 's' : ''} for Qualification</div>
                    <ul style="font-size: 13px; color: #92400E; margin: 0; padding-left: 20px;">
                        ${readiness.blockers.map(b => `<li>${esc(b)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="proc-grid-2">
                <div class="proc-card">
                    <div class="proc-card-title">Quick Stats</div>
                    <div class="proc-field"><span class="proc-field-label">Spend to Date</span><span class="proc-field-value">${P.formatZAR(s.spendToDate)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Performance Score</span><span class="proc-field-value">${perf.insufficient ? 'Insufficient data' : perf.score + '/100'}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Open Risks</span><span class="proc-field-value">${risks.openRisks || 0}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Compliance Progress</span><span class="proc-field-value">${readiness.complianceProgress}% (${readiness.reviewed}/${readiness.total})</span></div>
                    <div class="proc-field"><span class="proc-field-label">B-BBEE Level</span><span class="proc-field-value">${s.bbbeeLevel ? 'Level ' + s.bbbeeLevel : '—'}</span></div>
                </div>
                
                <div class="proc-card">
                    <div class="proc-card-title">Primary Contact</div>
                    <div class="proc-field"><span class="proc-field-label">Name</span><span class="proc-field-value">${esc(s.primaryContact?.name || '—')}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Role</span><span class="proc-field-value">${esc(s.primaryContact?.role || '—')}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Email</span><span class="proc-field-value">${esc(s.primaryContact?.email || '—')}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Phone</span><span class="proc-field-value">${esc(s.primaryContact?.phone || '—')}</span></div>
                </div>
            </div>
            
            ${expiring.length > 0 ? `
                <div class="proc-card" style="margin-top: 20px;">
                    <div class="proc-card-title">Compliance Expiring Soon</div>
                    ${expiring.map(c => {
                        const state = P.getComplianceItemState(c);
                        return `<div class="proc-compliance-item expiring">
                            <div class="compliance-icon warn">⚠</div>
                            <div class="compliance-body">
                                <div class="compliance-title">${esc(c.documentType)}</div>
                                <div class="compliance-meta">${state.label} · Expires ${P.formatDate(c.expiryDate)}</div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            ` : ''}
        `;
    }
    
    // ----- COMPANY TAB -----
    function renderCompanyTab(s) {
        return `
            <div class="proc-card">
                <div class="proc-card-title">Company Information</div>
                <div class="proc-grid-2">
                    <div>
                        <div class="proc-field"><span class="proc-field-label">Legal Name</span><span class="proc-field-value">${esc(s.legalName)}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Trading Name</span><span class="proc-field-value">${esc(s.tradingName)}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Registration #</span><span class="proc-field-value">${esc(s.registrationNumber || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">CSD Number</span><span class="proc-field-value">${esc(s.csdNumber || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Tax Ref</span><span class="proc-field-value">${esc(s.taxRef || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">VAT Number</span><span class="proc-field-value">${esc(s.vatNumber || 'Not registered')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Business Type</span><span class="proc-field-value">${esc(s.businessType || '—')}</span></div>
                    </div>
                    <div>
                        <div class="proc-field"><span class="proc-field-label">Province</span><span class="proc-field-value">${esc(s.province || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Municipality</span><span class="proc-field-value">${esc(s.municipality || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Business Address</span><span class="proc-field-value">${esc(s.businessAddress || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Postal Address</span><span class="proc-field-value">${esc(s.postalAddress || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Website</span><span class="proc-field-value">${esc(s.website || '—')}</span></div>
                        <div class="proc-field"><span class="proc-field-label">Years in Business</span><span class="proc-field-value">${s.yearsInBusiness || '—'}</span></div>
                        <div class="proc-field"><span class="proc-field-label">B-BBEE Level</span><span class="proc-field-value">${s.bbbeeLevel ? 'Level ' + s.bbbeeLevel : 'Not declared'}</span></div>
                    </div>
                </div>
                ${s.description ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--proc-border); font-size: 13px; color: var(--proc-text-muted);">${esc(s.description)}</div>` : ''}
            </div>
        `;
    }
    
    // ----- CONTACTS TAB -----
    function renderContactsTab(s) {
        const contacts = s.contacts || [];
        return `
            <div class="proc-card">
                <div class="proc-card-title">Contacts (${contacts.length})</div>
                ${contacts.length === 0 ? '<p style="color: var(--proc-text-muted); font-size: 13px;">No contacts recorded</p>' : contacts.map(c => `
                    <div class="proc-compliance-item">
                        <div class="compliance-icon ok">${getInitials(c.name)}</div>
                        <div class="compliance-body">
                            <div class="compliance-title">${esc(c.name)} ${c.primary ? '<span style="color: var(--proc-primary); font-size: 10px;">(Primary)</span>' : ''}</div>
                            <div class="compliance-meta">${esc(c.role || '')} · ${esc(c.email || '')} · ${esc(c.phone || '')}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // ----- CATEGORIES TAB -----
    function renderCategoriesTab(s) {
        return `
            <div class="proc-grid-2">
                <div class="proc-card">
                    <div class="proc-card-title">Supplier Categories</div>
                    ${(s.categories || []).map(c => `<span style="display: inline-block; padding: 6px 12px; background: var(--proc-bg); border-radius: 6px; margin: 0 6px 6px 0; font-size: 12px; font-weight: 600;">${esc(c)}</span>`).join('') || '<p style="color: var(--proc-text-muted); font-size: 13px;">No categories</p>'}
                </div>
                <div class="proc-card">
                    <div class="proc-card-title">Capabilities</div>
                    ${(s.capabilities || []).map(c => `<span style="display: inline-block; padding: 6px 12px; background: var(--proc-bg); border-radius: 6px; margin: 0 6px 6px 0; font-size: 12px; font-weight: 600;">${esc(c)}</span>`).join('') || '<p style="color: var(--proc-text-muted); font-size: 13px;">No capabilities</p>'}
                </div>
                <div class="proc-card">
                    <div class="proc-card-title">Operating Regions</div>
                    ${(s.operatingRegions || []).map(r => `<span style="display: inline-block; padding: 6px 12px; background: var(--proc-bg); border-radius: 6px; margin: 0 6px 6px 0; font-size: 12px; font-weight: 600;">${esc(r)}</span>`).join('') || '<p style="color: var(--proc-text-muted); font-size: 13px;">No regions</p>'}
                </div>
            </div>
        `;
    }
    
    // ----- ONBOARDING TAB -----
    function renderOnboardingTab(s) {
        const state = P.ONBOARDING_STATES[s.onboardingStatus] || P.ONBOARDING_STATES.draft;
        const blockers = P.getQualificationBlockers(s.id);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Onboarding Workflow</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: var(--proc-bg); border-radius: 12px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: var(--proc-text-muted); text-transform: uppercase; margin-bottom: 4px;">Current Status</div>
                        <div style="font-size: 20px; font-weight: 800;">${state.label}</div>
                    </div>
                    <div>
                        ${state.next.length > 0 ? `
                            <div style="font-size: 11px; font-weight: 700; color: var(--proc-text-muted); text-transform: uppercase; margin-bottom: 8px;">Available Actions</div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                ${state.next.map(n => `<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementVendors.transition('${s.id}', '${n}')">Move to ${P.ONBOARDING_STATES[n].label}</button>`).join('')}
                            </div>
                        ` : '<div style="color: var(--proc-text-muted); font-size: 13px;">No actions available</div>'}
                    </div>
                </div>
                
                ${blockers.length > 0 ? `
                    <div style="background: var(--proc-warning-bg); padding: 16px; border-radius: 10px;">
                        <div style="font-weight: 700; color: var(--proc-warning); margin-bottom: 8px;">Qualification Blockers (${blockers.length})</div>
                        <ul style="font-size: 13px; color: #92400E; margin: 0; padding-left: 20px;">
                            ${blockers.map(b => `<li>${esc(b)}</li>`).join('')}
                        </ul>
                    </div>
                ` : `
                    <div style="background: var(--proc-success-bg); padding: 16px; border-radius: 10px;">
                        <div style="font-weight: 700; color: var(--proc-success);">✓ Ready for qualification</div>
                        <div style="font-size: 13px; color: #065F46; margin-top: 4px;">All required documents reviewed and approved.</div>
                    </div>
                `}
            </div>
        `;
    }
    
    // ----- COMPLIANCE TAB -----
    function renderComplianceTab(s) {
        const compliance = P.getCompliance(s.id);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">
                    <span>Compliance Documents (${compliance.length})</span>
                    <button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementVendors.openAddDocumentModal('${s.id}')">+ Add Document</button>
                </div>
                ${compliance.length === 0 ? '<p style="color: var(--proc-text-muted); font-size: 13px;">No compliance records</p>' : compliance.map(c => {
                    const state = P.getComplianceItemState(c);
                    const iconClass = state.state === 'expired' || state.state === 'rejected' || state.state === 'missing' ? 'err' : state.state === 'expiring' || state.state === 'expiring_soon' || state.state === 'pending' ? 'warn' : 'ok';
                    const itemClass = state.state === 'expired' ? 'expired' : state.state === 'expiring' ? 'expiring' : '';
                    return `
                        <div class="proc-compliance-item ${itemClass}">
                            <div class="compliance-icon ${iconClass}">${iconClass === 'ok' ? '✓' : iconClass === 'warn' ? '⚠' : '✕'}</div>
                            <div class="compliance-body">
                                <div class="compliance-title">${esc(c.documentType)}</div>
                                <div class="compliance-meta">
                                    ${c.referenceNumber ? `Ref: ${esc(c.referenceNumber)} · ` : ''}
                                    ${c.expiryDate ? `Expires ${P.formatDate(c.expiryDate)} · ` : ''}
                                    <span style="font-weight: 700; color: var(--proc-${iconClass === 'ok' ? 'success' : iconClass === 'warn' ? 'warning' : 'danger'});">${state.label}</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 6px;">
                                ${c.reviewStatus === 'submitted' ? `<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementVendors.reviewDocument('${c.id}', 'approved')">Approve</button>
                                <button class="proc-btn proc-btn-danger proc-btn-sm" onclick="ProcurementVendors.reviewDocument('${c.id}', 'rejected')">Reject</button>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // ----- RISK TAB -----
    function renderRiskTab(s) {
        const risks = P.getRisks(s.id);
        const summary = P.getVendorRiskSummary(s.id);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">
                    <span>Risk Register (${risks.length})</span>
                    <div>${getRiskBadge(summary.level)}</div>
                </div>
                ${risks.length === 0 ? '<p style="color: var(--proc-text-muted); font-size: 13px;">No risks recorded</p>' : risks.map(r => {
                    const severity = P.calculateRiskSeverity(r.score);
                    return `
                        <div class="proc-risk-item">
                            <div class="risk-header">
                                <div>
                                    <div style="font-weight: 700; font-size: 14px;">${esc(r.category)}</div>
                                    <div style="font-size: 12px; color: var(--proc-text-muted); margin-top: 2px;">${esc(r.description)}</div>
                                </div>
                                <span class="risk-score ${severity.level}">${severity.label} · ${r.score}/25</span>
                            </div>
                            <div style="font-size: 12px; color: var(--proc-text-muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--proc-border);">
                                <strong>Mitigation:</strong> ${esc(r.mitigation)}<br>
                                <strong>Owner:</strong> ${esc(r.owner)} · <strong>Review:</strong> ${P.formatDate(r.reviewDate)} · <strong>Status:</strong> ${esc(r.status)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // ----- PERFORMANCE TAB -----
    function renderPerformanceTab(s) {
        const reviews = P.getPerformance(s.id);
        const calc = P.calculatePerformanceScore(s.id);
        const weights = P.data.config.performanceWeights;
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Performance Scorecard</div>
                
                ${calc.insufficient ? `
                    <p style="color: var(--proc-text-muted); font-size: 13px; padding: 20px 0;">Insufficient transaction history to calculate a reliable performance score.</p>
                ` : `
                    <div style="padding: 20px; background: var(--proc-bg); border-radius: 12px; margin-bottom: 20px; text-align: center;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--proc-text-muted); text-transform: uppercase;">Overall Score</div>
                        <div style="font-size: 42px; font-weight: 800; color: ${calc.score >= 85 ? 'var(--proc-success)' : calc.score >= 70 ? 'var(--proc-warning)' : 'var(--proc-danger)'};">${calc.score}</div>
                        <div style="font-size: 12px; color: var(--proc-text-muted);">out of 100 · Based on ${calc.reviews} review(s)</div>
                    </div>
                    
                    <div class="proc-scorecard">
                        ${renderScoreMetric('On-Time Delivery', calc.latest.onTimeDelivery, weights.onTimeDelivery)}
                        ${renderScoreMetric('Quality Acceptance', calc.latest.qualityAcceptance, weights.qualityAcceptance)}
                        ${renderScoreMetric('Price Competitiveness', calc.latest.priceCompetitiveness, weights.priceCompetitiveness)}
                        ${renderScoreMetric('Responsiveness', calc.latest.responsiveness, weights.responsiveness)}
                        ${renderScoreMetric('Documentation', calc.latest.documentation, weights.documentation)}
                    </div>
                    
                    <div style="font-size: 12px; color: var(--proc-text-muted); text-align: center; margin-top: 12px;">
                        Weighted: ${weights.onTimeDelivery}% delivery · ${weights.qualityAcceptance}% quality · ${weights.priceCompetitiveness}% price · ${weights.responsiveness}% responsiveness · ${weights.documentation}% documentation
                    </div>
                `}
            </div>
            
            ${reviews.length > 0 ? `
                <div class="proc-card" style="margin-top: 20px;">
                    <div class="proc-card-title">Review History</div>
                    ${reviews.map(r => `
                        <div style="padding: 12px; border-bottom: 1px solid var(--proc-border);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <strong>${esc(r.period)}</strong>
                                <span>${r.overallScore}/100</span>
                            </div>
                            <div style="font-size: 12px; color: var(--proc-text-muted);">${esc(r.reviewNotes)} · Reviewed by ${esc(r.reviewer)} on ${P.formatDate(r.reviewedAt)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }
    
    function renderScoreMetric(label, value, weight) {
        const color = value >= 85 ? 'good' : value >= 70 ? 'medium' : 'poor';
        return `
            <div class="score-metric">
                <div class="score-metric-label">${label} (${weight}%)</div>
                <div class="score-metric-value">${value}</div>
                <div class="score-bar"><div class="score-bar-fill ${color}" style="width: ${value}%;"></div></div>
            </div>
        `;
    }
    
    // ----- CONTRACTS TAB -----
    function renderContractsTab(s) {
        const contracts = P.getContracts(s.id);
        return `
            <div class="proc-card">
                <div class="proc-card-title">Contracts (${contracts.length})</div>
                ${contracts.length === 0 ? '<p style="color: var(--proc-text-muted); font-size: 13px;">No contracts on record</p>' : contracts.map(c => `
                    <div class="proc-compliance-item">
                        <div class="compliance-icon ${c.status === 'expiring_soon' ? 'warn' : 'ok'}">📄</div>
                        <div class="compliance-body">
                            <div class="compliance-title">${esc(c.title)}</div>
                            <div class="compliance-meta">${esc(c.contractType)} · ${P.formatZAR(c.value)} · ${P.formatDate(c.effectiveDate)} → ${P.formatDate(c.expiryDate)}</div>
                            <div class="compliance-meta" style="margin-top: 4px;">Owner: ${esc(c.contractOwner)} · Status: <span style="color: var(--proc-${c.status === 'expiring_soon' ? 'warning' : 'success'}); font-weight: 700;">${esc(c.status)}</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // ----- ACTIVITY TAB -----
    function renderActivityTab(s) {
        const log = P.getAuditLog('vendor', s.id);
        const complianceLog = P.getCompliance(s.id).flatMap(c => P.getAuditLog('compliance', c.id));
        const allLog = [...log, ...complianceLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Activity Timeline</div>
                ${allLog.length === 0 ? '<p style="color: var(--proc-text-muted); font-size: 13px;">No activity recorded</p>' : `
                    <div class="proc-timeline">
                        ${allLog.map(a => `
                            <div class="proc-timeline-item">
                                <div class="proc-timeline-time">${P.formatDateTime(a.timestamp)} · ${esc(a.user)}</div>
                                <div class="proc-timeline-title">${esc(a.action)}</div>
                                <div class="proc-timeline-desc">${esc(a.summary)}</div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }
    
    // ============================================================
    // HELPERS
    // ============================================================
    
    function getOnboardingBadge(status) {
        const map = {
            draft: { class: 'neutral', label: 'Draft' },
            submitted: { class: 'info', label: 'Submitted' },
            under_review: { class: 'warning', label: 'Under Review' },
            info_required: { class: 'warning', label: 'Info Required' },
            qualified: { class: 'success', label: 'Qualified' },
            rejected: { class: 'danger', label: 'Rejected' },
            suspended: { class: 'danger', label: 'Suspended' }
        };
        const m = map[status] || map.draft;
        return `<span class="proc-badge proc-badge-${m.class}">${m.label}</span>`;
    }
    
    function getComplianceBadge(status) {
        const map = {
            compliant: { class: 'success', label: 'Compliant' },
            attention_required: { class: 'warning', label: 'Attention' },
            expired: { class: 'danger', label: 'Expired' },
            missing: { class: 'danger', label: 'Missing' }
        };
        const m = map[status] || map.missing;
        return `<span class="proc-badge proc-badge-${m.class}">${m.label}</span>`;
    }
    
    function getRiskBadge(level) {
        const map = {
            low: { class: 'success', label: 'Low Risk' },
            medium: { class: 'warning', label: 'Medium Risk' },
            high: { class: 'danger', label: 'High Risk' },
            critical: { class: 'danger', label: 'Critical' }
        };
        const m = map[level] || map.medium;
        return `<span class="proc-badge proc-badge-${m.class}">${m.label}</span>`;
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
    
    function getFilteredSuppliers() {
        let list = P.getSuppliers();
        
        if (currentFilters.search) {
            const q = currentFilters.search.toLowerCase();
            list = list.filter(s => 
                (s.tradingName || '').toLowerCase().includes(q) ||
                (s.legalName || '').toLowerCase().includes(q) ||
                (s.id || '').toLowerCase().includes(q) ||
                (s.registrationNumber || '').toLowerCase().includes(q) ||
                (s.primaryContact?.name || '').toLowerCase().includes(q)
            );
        }
        
        if (currentFilters.status !== 'all') {
            list = list.filter(s => {
                if (currentFilters.status === 'active') return s.operationalStatus === 'active';
                if (currentFilters.status === 'pending') return ['submitted', 'under_review', 'info_required', 'draft'].includes(s.onboardingStatus);
                if (currentFilters.status === 'qualified') return s.onboardingStatus === 'qualified';
                if (currentFilters.status === 'suspended') return s.operationalStatus === 'suspended';
                if (currentFilters.status === 'rejected') return s.onboardingStatus === 'rejected';
                return true;
            });
        }
        
        if (currentFilters.risk !== 'all') {
            list = list.filter(s => s.riskRating === currentFilters.risk);
        }
        
        if (currentFilters.compliance !== 'all') {
            list = list.filter(s => s.complianceStatus === currentFilters.compliance);
        }
        
        if (currentFilters.category !== 'all') {
            list = list.filter(s => (s.categories || []).includes(currentFilters.category));
        }
        
        list.sort((a, b) => {
            const col = currentSort.column;
            const dir = currentSort.direction === 'asc' ? 1 : -1;
            let va = a[col], vb = b[col];
            if (va == null) va = '';
            if (vb == null) vb = '';
            if (typeof va === 'string') return va.localeCompare(vb) * dir;
            return (va - vb) * dir;
        });
        
        return list;
    }
    
    function emptyState() {
        return `
            <div class="proc-empty">
                <div class="proc-empty-icon">🔍</div>
                <h3>No vendors match your filters</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
    }
    
    // ============================================================
    // PUBLIC API
    // ============================================================
    
    window.ProcurementVendors = {
        setFilter(key, value) {
            currentFilters[key] = value;
            refreshContent();
        },
        
        sort(column) {
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }
            refreshContent();
        },
        
        filterByKpi(variant) {
            currentFilters = { search: '', status: 'all', risk: 'all', compliance: 'all', category: 'all' };
            if (variant === 'success') currentFilters.status = 'active';
            if (variant === 'warning') currentFilters.status = 'pending';
            if (variant === 'danger') currentFilters.compliance = 'expired';
            refreshContent();
        },
        
        toggleSelect(id, checked) {
            if (checked) selectedVendors.add(id);
            else selectedVendors.delete(id);
        },
        
        toggleAll(checkbox) {
            const suppliers = getFilteredSuppliers();
            if (checkbox.checked) suppliers.forEach(s => selectedVendors.add(s.id));
            else selectedVendors.clear();
            refreshContent();
        },
        
        openSupplier(id) {
            activeTab = 'overview';
            document.body.dataset.currentVendorId = id;
            document.getElementById('contentArea').innerHTML = renderSupplierDetail(id);
            // Scroll content area to top
            document.getElementById('contentArea').scrollTop = 0;
        },
        
        backToRegister() {
            document.body.dataset.currentVendorId = '';
            refreshContent();
        },
        
        switchTab(tab) {
            activeTab = tab;
            const supplierId = document.body.dataset.currentVendorId;
            if (supplierId) document.getElementById('contentArea').innerHTML = renderSupplierDetail(supplierId);
        },
        
        transition(vendorId, newStatus) {
            const result = P.transitionOnboarding(vendorId, newStatus);
            if (result.error) {
                alert('Cannot transition: ' + result.error + (result.blockers ? '\n\nBlockers:\n- ' + result.blockers.join('\n- ') : ''));
                return;
            }
            document.getElementById('contentArea').innerHTML = renderSupplierDetail(vendorId);
            if (window.App && window.App.toast) window.App.toast(`Status changed to ${newStatus}`, 'success');
        },
        
        suspend(vendorId) {
            if (!confirm('Suspend this vendor? They will be ineligible for new POs.')) return;
            P.updateSupplier(vendorId, { operationalStatus: 'suspended', qualificationStatus: 'suspended' });
            document.getElementById('contentArea').innerHTML = renderSupplierDetail(vendorId);
        },
        
        reviewDocument(recordId, status) {
            P.updateComplianceRecord(recordId, { reviewStatus: status, reviewedAt: new Date().toISOString() });
            const supplierId = document.body.dataset.currentVendorId;
            if (supplierId) document.getElementById('contentArea').innerHTML = renderSupplierDetail(supplierId);
        },
        
        openCreateModal() {
            openFormModal('Create New Supplier', {}, function(data) {
                P.createSupplier(data);
                refreshContent();
                if (window.App && window.App.toast) window.App.toast('Supplier created', 'success');
            });
        },
        
        openEditModal(id) {
            const supplier = P.getSupplier(id);
            openFormModal('Edit Supplier', supplier, function(data) {
                P.updateSupplier(id, data);
                document.getElementById('contentArea').innerHTML = renderSupplierDetail(id);
                if (window.App && window.App.toast) window.App.toast('Supplier updated', 'success');
            });
        },
        
        openAddDocumentModal(vendorId) {
            openDocumentModal(vendorId);
        },
        
        exportCSV() {
            const suppliers = getFilteredSuppliers();
            const headers = ['ID', 'Trading Name', 'Legal Name', 'Registration', 'Province', 'Status', 'Compliance', 'Risk', 'Performance'];
            const rows = suppliers.map(s => [
                s.id, s.tradingName, s.legalName, s.registrationNumber, s.province,
                s.onboardingStatus, s.complianceStatus, s.riskRating,
                P.calculatePerformanceScore(s.id).score || 'N/A'
            ]);
            const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vendors-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    
    function refreshContent() {
        document.body.dataset.currentVendorId = '';
        document.getElementById('contentArea').innerHTML = renderVendorDashboard();
    }
    
    // ============================================================
    // MODALS
    // ============================================================
    
    function openFormModal(title, initial, onSave) {
        const supplier = initial || {};
        const modal = document.createElement('div');
        modal.className = 'proc-modal-overlay';
        modal.innerHTML = `
            <div class="proc-modal" style="max-width: 720px;">
                <div class="proc-modal-header">
                    <h3 class="proc-modal-title">${title}</h3>
                    <button onclick="this.closest('.proc-modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--proc-text-muted);">×</button>
                </div>
                <div class="proc-modal-body">
                    <form id="supplierForm">
                        <div class="proc-form-row">
                            <div class="proc-form-group">
                                <label class="proc-form-label">Trading Name *</label>
                                <input class="proc-form-input" name="tradingName" required value="${esc(supplier.tradingName || '')}">
                            </div>
                            <div class="proc-form-group">
                                <label class="proc-form-label">Legal Name *</label>
                                <input class="proc-form-input" name="legalName" required value="${esc(supplier.legalName || '')}">
                            </div>
                        </div>
                        <div class="proc-form-row">
                            <div class="proc-form-group">
                                <label class="proc-form-label">Registration Number</label>
                                <input class="proc-form-input" name="registrationNumber" value="${esc(supplier.registrationNumber || '')}">
                            </div>
                            <div class="proc-form-group">
                                <label class="proc-form-label">Tax Reference</label>
                                <input class="proc-form-input" name="taxRef" value="${esc(supplier.taxRef || '')}">
                            </div>
                        </div>
                        <div class="proc-form-row">
                            <div class="proc-form-group">
                                <label class="proc-form-label">VAT Number</label>
                                <input class="proc-form-input" name="vatNumber" value="${esc(supplier.vatNumber || '')}">
                            </div>
                            <div class="proc-form-group">
                                <label class="proc-form-label">Province</label>
                                <select class="proc-form-select" name="province">
                                    ${['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'].map(p => 
                                        `<option ${supplier.province === p ? 'selected' : ''}>${p}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Business Address</label>
                            <textarea class="proc-form-textarea" name="businessAddress" rows="2">${esc(supplier.businessAddress || '')}</textarea>
                        </div>
                        <div class="proc-form-row">
                            <div class="proc-form-group">
                                <label class="proc-form-label">Primary Contact Name</label>
                                <input class="proc-form-input" name="contactName" value="${esc(supplier.primaryContact?.name || '')}">
                            </div>
                            <div class="proc-form-group">
                                <label class="proc-form-label">Primary Contact Email</label>
                                <input class="proc-form-input" type="email" name="contactEmail" value="${esc(supplier.primaryContact?.email || '')}">
                            </div>
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Categories (comma-separated)</label>
                            <input class="proc-form-input" name="categories" value="${esc((supplier.categories || []).join(', '))}">
                        </div>
                    </form>
                </div>
                <div class="proc-modal-footer">
                    <button class="proc-btn proc-btn-secondary" onclick="this.closest('.proc-modal-overlay').remove()">Cancel</button>
                    <button class="proc-btn proc-btn-primary" onclick="ProcurementVendors._submitForm()">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        window.ProcurementVendors._submitForm = function() {
            const form = document.getElementById('supplierForm');
            if (!form.checkValidity()) { form.reportValidity(); return; }
            
            const fd = new FormData(form);
            const data = {
                tradingName: fd.get('tradingName'),
                legalName: fd.get('legalName'),
                registrationNumber: fd.get('registrationNumber'),
                taxRef: fd.get('taxRef'),
                vatNumber: fd.get('vatNumber'),
                province: fd.get('province'),
                businessAddress: fd.get('businessAddress'),
                categories: fd.get('categories').split(',').map(c => c.trim()).filter(Boolean),
                primaryContact: {
                    name: fd.get('contactName'),
                    email: fd.get('contactEmail'),
                    role: 'Primary Contact',
                    phone: '',
                    preferred: 'email'
                },
                contacts: [{
                    name: fd.get('contactName'),
                    email: fd.get('contactEmail'),
                    role: 'Primary Contact',
                    phone: '',
                    primary: true
                }],
                country: 'South Africa',
                businessType: supplier.businessType || 'Private Company'
            };
            
            onSave(data);
            modal.remove();
        };
    }
    
    function openDocumentModal(vendorId) {
        const modal = document.createElement('div');
        modal.className = 'proc-modal-overlay';
        modal.innerHTML = `
            <div class="proc-modal">
                <div class="proc-modal-header">
                    <h3 class="proc-modal-title">Add Compliance Document</h3>
                    <button onclick="this.closest('.proc-modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--proc-text-muted);">×</button>
                </div>
                <div class="proc-modal-body">
                    <form id="docForm">
                        <div class="proc-form-group">
                            <label class="proc-form-label">Document Type *</label>
                            <select class="proc-form-select" name="documentType" required>
                                <option>CIPC Registration</option>
                                <option>Tax Clearance</option>
                                <option>B-BBEE Certificate</option>
                                <option>Public Liability Insurance</option>
                                <option>Goods-in-Transit Insurance</option>
                                <option>Construction Insurance</option>
                                <option>Accreditation Certificate</option>
                                <option>Health Certificate</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div class="proc-form-row">
                            <div class="proc-form-group">
                                <label class="proc-form-label">Reference Number</label>
                                <input class="proc-form-input" name="referenceNumber">
                            </div>
                            <div class="proc-form-group">
                                <label class="proc-form-label">Issue Date</label>
                                <input class="proc-form-input" type="date" name="issueDate">
                            </div>
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Expiry Date</label>
                            <input class="proc-form-input" type="date" name="expiryDate">
                        </div>
                        <div class="proc-form-group">
                            <label class="proc-form-label">Notes</label>
                            <textarea class="proc-form-textarea" name="notes" rows="2"></textarea>
                        </div>
                    </form>
                </div>
                <div class="proc-modal-footer">
                    <button class="proc-btn proc-btn-secondary" onclick="this.closest('.proc-modal-overlay').remove()">Cancel</button>
                    <button class="proc-btn proc-btn-primary" onclick="document.getElementById('docForm').requestSubmit()">Add Document</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('docForm').onsubmit = function(e) {
            e.preventDefault();
            const fd = new FormData(this);
            P.addComplianceRecord(vendorId, {
                documentType: fd.get('documentType'),
                referenceNumber: fd.get('referenceNumber'),
                issueDate: fd.get('issueDate'),
                expiryDate: fd.get('expiryDate'),
                notes: fd.get('notes')
            });
            modal.remove();
            document.getElementById('contentArea').innerHTML = renderSupplierDetail(vendorId);
            if (window.App && window.App.toast) window.App.toast('Document added', 'success');
        };
    }
    
    console.log('[Procurement] Vendor Management module loaded');
    
})();