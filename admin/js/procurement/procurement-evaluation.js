// ============================================================
// PROCUREMENT - EVALUATION & AWARD
// ============================================================

(function() {
    'use strict';
    
    if (!window.Procurement) {
        console.error('[Eval] Procurement not loaded');
        return;
    }
    if (typeof window.Views === 'undefined') {
        console.error('[Eval] Views not defined');
        return;
    }
    
    const P = window.Procurement;
    const esc = P.escapeHtml;
    
    // ============================================================
    // INIT - runs after Procurement + RFQ modules ready
    // ============================================================
    function initEvalModule() {
        if (!P.data) { P.init(); }
        if (!P.data) { setTimeout(initEvalModule, 100); return; }
        
        // Seed evaluations & awards
        if (!P.data.evaluations) P.data.evaluations = [];
        if (!P.data.awards) P.data.awards = [];
        
        seedEvaluations();
        
        // Register views
        window.Views.procurementEvaluation = function() {
            return renderEvaluationDashboard();
        };
        
        console.log('[Eval] Module ready');
    }
    
    if (P.initialized && P.data) {
        initEvalModule();
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initEvalModule, 50));
    }
    
    // ============================================================
    // SEED DATA
    // ============================================================
    function seedEvaluations() {
        if (P.data.evaluations.length > 0) return;
        
        // Evaluations exist for RFQs that are 'closed', 'under_evaluation' or 'awarded'
        // Only seed one rich evaluation for RFQ-2026-0003 (National Road Freight)
        // In reality, this requires quotations - let's seed those too
        
        if (!P.data.quotations) P.data.quotations = [];
        
        // Add 2 quotations for RFQ-2026-0003 from VEN-0003 and VEN-0004 (demo - normally only 0003 is invited, but let's make it interesting)
        if (P.data.quotations.length === 0) {
            P.data.quotations.push(
                {
                    id: 'QUO-2026-0001',
                    rfqId: 'RFQ-2026-0003',
                    vendorId: 'VEN-0003',
                    supplierReference: 'UBUNTU-FREIGHT-001',
                    revision: 1,
                    status: 'submitted',
                    currency: 'ZAR',
                    lineItems: [
                        { line: 1, description: 'Road freight - JHB to CPT', qty: 24, uom: 'trips', unitPrice: 17500, deliveryDays: 21 },
                        { line: 2, description: 'Road freight - JHB to DBN', qty: 18, uom: 'trips', unitPrice: 11500, deliveryDays: 21 }
                    ],
                    subtotal: 627000,
                    tax: 94050,
                    total: 721050,
                    deliveryLeadDays: 21,
                    validUntil: '2026-11-15',
                    notes: 'Price includes goods-in-transit insurance up to R10m.',
                    submittedAt: '2026-10-14T14:30:00+02:00',
                    createdAt: '2026-10-13T09:00:00+02:00'
                },
                {
                    id: 'QUO-2026-0002',
                    rfqId: 'RFQ-2026-0003',
                    vendorId: 'VEN-0004',
                    supplierReference: 'HIGHVELD-FRT-001',
                    revision: 1,
                    status: 'submitted',
                    currency: 'ZAR',
                    lineItems: [
                        { line: 1, description: 'Road freight - JHB to CPT', qty: 24, uom: 'trips', unitPrice: 19200, deliveryDays: 28 },
                        { line: 2, description: 'Road freight - JHB to DBN', qty: 18, uom: 'trips', unitPrice: 12500, deliveryDays: 28 }
                    ],
                    subtotal: 685800,
                    tax: 102870,
                    total: 788670,
                    deliveryLeadDays: 28,
                    validUntil: '2026-11-15',
                    notes: '',
                    submittedAt: '2026-10-15T10:15:00+02:00',
                    createdAt: '2026-10-14T09:00:00+02:00'
                }
            );
        }
        
        // Seed evaluation for RFQ-2026-0003
        P.data.evaluations.push({
            id: 'EVA-2026-0001',
            rfqId: 'RFQ-2026-0003',
            status: 'in_progress',
            evaluator: 'Elena Rodriguez',
            conflictDeclared: false,
            mandatoryChecks: [
                { quotationId: 'QUO-2026-0001', criterion: 'Valid Tax Clearance', result: 'pass', notes: '' },
                { quotationId: 'QUO-2026-0001', criterion: 'Goods-in-Transit Insurance ≥ R10m', result: 'pass', notes: '' },
                { quotationId: 'QUO-2026-0001', criterion: '≥ 5 years experience', result: 'pass', notes: '' },
                { quotationId: 'QUO-2026-0002', criterion: 'Valid Tax Clearance', result: 'pass', notes: '' },
                { quotationId: 'QUO-2026-0002', criterion: 'Goods-in-Transit Insurance ≥ R10m', result: 'clarification', notes: 'Awaiting updated certificate' },
                { quotationId: 'QUO-2026-0002', criterion: '≥ 5 years experience', result: 'pass', notes: '' }
            ],
            scores: [
                { quotationId: 'QUO-2026-0001', criterion: 'Price', score: 95, comment: 'Best price' },
                { quotationId: 'QUO-2026-0001', criterion: 'Delivery Capability', score: 90, comment: 'Proven track record' },
                { quotationId: 'QUO-2026-0001', criterion: 'Supplier Track Record', score: 95, comment: 'Excellent past performance' },
                { quotationId: 'QUO-2026-0001', criterion: 'Insurance & Compliance', score: 100, comment: 'Fully compliant' },
                { quotationId: 'QUO-2026-0002', criterion: 'Price', score: 82, comment: '' },
                { quotationId: 'QUO-2026-0002', criterion: 'Delivery Capability', score: 70, comment: 'Slower delivery' },
                { quotationId: 'QUO-2026-0002', criterion: 'Supplier Track Record', score: 85, comment: '' },
                { quotationId: 'QUO-2026-0002', criterion: 'Insurance & Compliance', score: 60, comment: 'Clarification outstanding' }
            ],
            recommendation: null,
            createdAt: '2026-10-16T09:00:00+02:00'
        });
        
        P.save();
    }
    
    // ============================================================
    // DASHBOARD
    // ============================================================
    function renderEvaluationDashboard() {
        const rfqs = (P.data.rfqs || []).filter(r => 
            ['closed', 'under_evaluation', 'awarded'].includes(r.status)
        );
        
        const stats = {
            pending: rfqs.filter(r => r.status === 'closed' || r.status === 'under_evaluation').length,
            awarded: (P.data.awards || []).filter(a => a.status === 'issued').length,
            awaitingApproval: (P.data.evaluations || []).filter(e => e.status === 'pending_approval').length,
            totalValue: (P.data.awards || []).filter(a => a.status === 'issued').reduce((s, a) => s + (a.awardedValue || 0), 0)
        };
        
        return `
            <div class="proc-dashboard-page">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 800; color: var(--proc-text); margin-bottom: 4px;">Evaluation & Award</h2>
                        <p style="font-size: 14px; color: var(--proc-text-muted);">Score quotations, compare submissions, and issue awards</p>
                    </div>
                </div>
                
                <div class="proc-dashboard">
                    ${kpi('Ready for Evaluation', stats.pending, 'Closed or in evaluation', 'primary')}
                    ${kpi('Awaiting Approval', stats.awaitingApproval, 'Recommendation submitted', 'warning')}
                    ${kpi('Awarded', stats.awarded, 'Total awards issued', 'success')}
                    ${kpi('Total Awarded Value', P.formatZAR(stats.totalValue), 'All time', 'info')}
                </div>
                
                <div class="proc-register">
                    <div class="proc-register-toolbar">
                        <h3 style="font-weight: 700; font-size: 15px;">Closed & Awarded RFQs</h3>
                    </div>
                    ${rfqs.length === 0 ? `
                        <div class="proc-empty">
                            <div class="proc-empty-icon">📊</div>
                            <h3>No RFQs ready for evaluation</h3>
                            <p>Close an RFQ with submissions to begin evaluation.</p>
                        </div>
                    ` : `
                        <div style="overflow-x: auto;">
                            <table class="proc-table">
                                <thead>
                                    <tr>
                                        <th>RFQ #</th>
                                        <th>Title</th>
                                        <th>Submissions</th>
                                        <th>Status</th>
                                        <th>Evaluation</th>
                                        <th>Award</th>
                                        <th style="text-align: right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rfqs.map(r => {
                                        const quotations = getQuotationsFor(r.id);
                                        const evaluation = (P.data.evaluations || []).find(e => e.rfqId === r.id);
                                        const award = (P.data.awards || []).find(a => a.rfqId === r.id);
                                        return `
                                            <tr>
                                                <td><span style="font-family: monospace; font-weight: 700; color: var(--proc-primary); font-size: 12px;">${esc(r.id)}</span></td>
                                                <td>
                                                    <div style="font-weight: 700; font-size: 13px;">${esc(r.title)}</div>
                                                    <div style="font-size: 11px; color: var(--proc-text-muted);">${esc(r.department)}</div>
                                                </td>
                                                <td><span style="font-weight: 600;">${quotations.length}</span></td>
                                                <td>${rfqStatusBadge(r.status)}</td>
                                                <td>${evaluation ? evalStatusBadge(evaluation.status) : '<span style="font-size: 11px; color: var(--proc-text-muted);">Not started</span>'}</td>
                                                <td>${award ? awardStatusBadge(award.status) : '<span style="font-size: 11px; color: var(--proc-text-muted);">—</span>'}</td>
                                                <td style="text-align: right;">
                                                    <button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementEvaluation.open('${r.id}')">
                                                        ${award ? 'View →' : evaluation ? 'Continue →' : 'Evaluate →'}
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
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
    
    function rfqStatusBadge(s) {
        const map = {
            closed: { c: 'info', l: 'Closed' },
            under_evaluation: { c: 'warning', l: 'In Evaluation' },
            awarded: { c: 'success', l: 'Awarded' }
        };
        const m = map[s] || { c: 'neutral', l: s };
        return `<span class="proc-badge proc-badge-${m.c}">${m.l}</span>`;
    }
    
    function evalStatusBadge(s) {
        const map = {
            in_progress: { c: 'warning', l: 'In Progress' },
            pending_approval: { c: 'info', l: 'Pending Approval' },
            approved: { c: 'success', l: 'Approved' },
            rejected: { c: 'danger', l: 'Rejected' }
        };
        const m = map[s] || { c: 'neutral', l: s };
        return `<span class="proc-badge proc-badge-${m.c}">${m.l}</span>`;
    }
    
    function awardStatusBadge(s) {
        const map = {
            pending_approval: { c: 'warning', l: 'Pending' },
            issued: { c: 'success', l: 'Issued' },
            rejected: { c: 'danger', l: 'Rejected' }
        };
        const m = map[s] || { c: 'neutral', l: s };
        return `<span class="proc-badge proc-badge-${m.c}">${m.l}</span>`;
    }
    
    // ============================================================
    // EVALUATION WORKSPACE
    // ============================================================
    let activeEvalTab = 'overview';
    
    function renderEvaluationWorkspace(rfqId) {
        const rfq = (P.data.rfqs || []).find(r => r.id === rfqId);
        if (!rfq) return '<div class="proc-empty"><h3>RFQ not found</h3></div>';
        
        let evaluation = (P.data.evaluations || []).find(e => e.rfqId === rfqId);
        if (!evaluation) {
            // Create on the fly
            evaluation = createBlankEvaluation(rfqId);
            P.data.evaluations.push(evaluation);
            P.save();
        }
        
        const award = (P.data.awards || []).find(a => a.rfqId === rfqId);
        const quotations = getQuotationsFor(rfqId);
        
        const tabs = [
            { id: 'overview', label: 'Overview' },
            { id: 'mandatory', label: 'Mandatory Checks' },
            { id: 'scoring', label: 'Scoring' },
            { id: 'comparison', label: 'Comparison' },
            { id: 'approval', label: 'Approval & Award' }
        ];
        
        return `
            <div class="proc-detail-page">
                <div style="margin-bottom: 16px;">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementEvaluation.backToDashboard()">
                        ← Back to Evaluations
                    </button>
                </div>
                
                <div class="proc-detail-header">
                    <div class="proc-detail-header-inner">
                        <div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                                <span style="font-family: monospace; font-size: 11px; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px;">${esc(rfq.id)}</span>
                                ${rfqStatusBadge(rfq.status)}
                            </div>
                            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${esc(rfq.title)}</h1>
                            <p style="color: rgba(255,255,255,0.7); font-size: 13px;">
                                ${quotations.length} submission${quotations.length !== 1 ? 's' : ''} · ${esc(rfq.department)}
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Evaluation Status</div>
                            <div style="font-size: 14px; font-weight: 800;">${evalStatusBadge(evaluation.status)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="proc-tabs">
                    ${tabs.map(t => `
                        <button class="proc-tab ${activeEvalTab === t.id ? 'active' : ''}" 
                            onclick="ProcurementEvaluation.switchTab('${t.id}')">${t.label}</button>
                    `).join('')}
                </div>
                
                <div class="proc-tab-content">
                    ${renderEvalTab(activeEvalTab, rfq, evaluation, quotations, award)}
                </div>
            </div>
        `;
    }
    
    function renderEvalTab(tab, rfq, evaluation, quotations, award) {
        switch (tab) {
            case 'overview': return renderOverviewTab(rfq, evaluation, quotations, award);
            case 'mandatory': return renderMandatoryTab(rfq, evaluation, quotations);
            case 'scoring': return renderScoringTab(rfq, evaluation, quotations);
            case 'comparison': return renderComparisonTab(rfq, evaluation, quotations);
            case 'approval': return renderApprovalTab(rfq, evaluation, quotations, award);
            default: return '';
        }
    }
    
    function renderOverviewTab(rfq, evaluation, quotations, award) {
        const totalWeight = (rfq.evaluationCriteria || []).reduce((s, c) => s + c.weight, 0);
        const mandatoryTotal = (evaluation.mandatoryChecks || []).length;
        const mandatoryDone = (evaluation.mandatoryChecks || []).filter(m => m.result !== 'pending').length;
        const scoringProgress = calculateScoringProgress(rfq, evaluation, quotations);
        
        return `
            <div class="proc-grid-2">
                <div class="proc-card">
                    <div class="proc-card-title">Evaluation Summary</div>
                    <div class="proc-field"><span class="proc-field-label">RFQ</span><span class="proc-field-value">${esc(rfq.id)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Evaluator</span><span class="proc-field-value">${esc(evaluation.evaluator)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Status</span><span class="proc-field-value">${evalStatusBadge(evaluation.status)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Conflict Declared</span><span class="proc-field-value">${evaluation.conflictDeclared ? '✓ Yes' : '⚠ Not yet'}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Started</span><span class="proc-field-value">${P.formatDate(evaluation.createdAt)}</span></div>
                </div>
                
                <div class="proc-card">
                    <div class="proc-card-title">Progress</div>
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="font-size: 12px; font-weight: 700;">Mandatory Checks</span>
                            <span style="font-size: 12px; color: var(--proc-text-muted);">${mandatoryDone}/${mandatoryTotal}</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill ${mandatoryDone === mandatoryTotal ? 'bg-green-500' : 'bg-amber-500'}" style="width: ${mandatoryTotal > 0 ? (mandatoryDone / mandatoryTotal * 100) : 0}%;"></div></div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="font-size: 12px; font-weight: 700;">Scoring</span>
                            <span style="font-size: 12px; color: var(--proc-text-muted);">${scoringProgress.scored}/${scoringProgress.total}</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill ${scoringProgress.scored === scoringProgress.total ? 'bg-green-500' : 'bg-brand-brown'}" style="width: ${scoringProgress.total > 0 ? (scoringProgress.scored / scoringProgress.total * 100) : 0}%;"></div></div>
                    </div>
                </div>
            </div>
            
            <div class="proc-card" style="margin-top: 20px;">
                <div class="proc-card-title">Evaluation Criteria</div>
                <p style="font-size: 12px; color: var(--proc-text-muted); margin-bottom: 12px;">Total weight: ${totalWeight}% ${totalWeight === 100 ? '✓' : '⚠ (should be 100%)'}</p>
                ${(rfq.evaluationCriteria || []).map(c => `
                    <div class="criteria-weight">
                        <span class="criteria-weight-label">${esc(c.criterion)}</span>
                        <div class="criteria-weight-bar">
                            <div class="criteria-weight-fill" style="width: ${c.weight}%;"></div>
                        </div>
                        <span class="criteria-weight-value">${c.weight}%</span>
                    </div>
                `).join('')}
            </div>
            
            ${award ? `
                <div class="proc-card" style="margin-top: 20px;">
                    <div class="proc-card-title">Award</div>
                    <div class="proc-field"><span class="proc-field-label">Awarded To</span><span class="proc-field-value">${esc(getSupplierName(award.vendorId))}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Awarded Value</span><span class="proc-field-value">${P.formatZAR(award.awardedValue)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Award Date</span><span class="proc-field-value">${P.formatDate(award.awardedAt)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Status</span><span class="proc-field-value">${awardStatusBadge(award.status)}</span></div>
                </div>
            ` : ''}
        `;
    }
    
    function renderMandatoryTab(rfq, evaluation, quotations) {
        const mandatoryCriteria = ['Valid Tax Clearance', 'Goods-in-Transit Insurance ≥ R10m', '≥ 5 years experience'];
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">
                    <span>Mandatory Compliance Checks</span>
                    ${!evaluation.conflictDeclared ? `
                        <button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementEvaluation.declareConflict('${evaluation.id}')">
                            Declare No Conflict
                        </button>
                    ` : '<span class="proc-badge proc-badge-success">✓ Conflict Declared</span>'}
                </div>
                
                <p style="font-size: 13px; color: var(--proc-text-muted); margin-bottom: 20px;">
                    Each quotation must pass ALL mandatory checks before it can be scored. Failed checks eliminate a quotation from consideration.
                </p>
                
                ${mandatoryCriteria.map(criterion => `
                    <div style="margin-bottom: 24px;">
                        <div style="font-weight: 700; font-size: 13px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--proc-border);">${esc(criterion)}</div>
                        ${quotations.map(q => {
                            const supplier = getSupplier(q.vendorId);
                            const check = (evaluation.mandatoryChecks || []).find(m => 
                                m.quotationId === q.id && m.criterion === criterion
                            );
                            const result = check?.result || 'pending';
                            
                            return `
                                <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: #F9FAFB; border-radius: 8px; margin-bottom: 8px;">
                                    <div class="vendor-avatar" style="background: ${getAvatarColor(supplier?.tradingName || '?')}; width: 32px; height: 32px; font-size: 11px;">${getInitials(supplier?.tradingName || '?')}</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; font-size: 13px;">${esc(supplier?.tradingName || q.vendorId)}</div>
                                        <div style="font-size: 11px; color: var(--proc-text-muted);">${esc(q.id)}</div>
                                    </div>
                                    <div style="display: flex; gap: 6px;">
                                        <button class="proc-btn proc-btn-sm ${result === 'pass' ? 'proc-btn-success' : 'proc-btn-secondary'}" 
                                            onclick="ProcurementEvaluation.setCheck('${evaluation.id}', '${q.id}', '${criterion}', 'pass')">✓ Pass</button>
                                        <button class="proc-btn proc-btn-sm ${result === 'clarification' ? 'proc-btn-primary' : 'proc-btn-secondary'}" 
                                            onclick="ProcurementEvaluation.setCheck('${evaluation.id}', '${q.id}', '${criterion}', 'clarification')">⚠ Clarify</button>
                                        <button class="proc-btn proc-btn-sm ${result === 'fail' ? 'proc-btn-danger' : 'proc-btn-secondary'}" 
                                            onclick="ProcurementEvaluation.setCheck('${evaluation.id}', '${q.id}', '${criterion}', 'fail')">✕ Fail</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function renderScoringTab(rfq, evaluation, quotations) {
        const criteria = rfq.evaluationCriteria || [];
        const eligibleQuotes = quotations.filter(q => isEligible(q.id, evaluation));
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">
                    <span>Scoring Matrix</span>
                    <span class="proc-badge proc-badge-info">${eligibleQuotes.length} eligible / ${quotations.length} total</span>
                </div>
                
                <p style="font-size: 13px; color: var(--proc-text-muted); margin-bottom: 16px;">
                    Score each eligible quotation on a 0-100 scale per criterion. Weighted scores are calculated automatically.
                </p>
                
                ${eligibleQuotes.length === 0 ? `
                    <div class="proc-empty" style="padding: 40px;">
                        <h3>No eligible quotations</h3>
                        <p>Complete mandatory checks to unlock scoring.</p>
                    </div>
                ` : `
                    <div class="eval-matrix">
                        <table>
                            <thead>
                                <tr>
                                    <th class="supplier-col">Supplier</th>
                                    ${criteria.map(c => `<th style="text-align: center;">${esc(c.criterion)}<br><span style="color: var(--proc-primary);">${c.weight}%</span></th>`).join('')}
                                    <th style="text-align: center; background: var(--proc-primary); color: white;">Weighted</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${eligibleQuotes.map(q => {
                                    const supplier = getSupplier(q.vendorId);
                                    const weighted = calculateWeightedScore(q.id, rfq, evaluation);
                                    return `
                                        <tr>
                                            <td class="supplier-col">
                                                <div style="display: flex; align-items: center; gap: 8px;">
                                                    <div class="vendor-avatar" style="background: ${getAvatarColor(supplier?.tradingName || '?')}; width: 28px; height: 28px; font-size: 10px;">${getInitials(supplier?.tradingName || '?')}</div>
                                                    <div>
                                                        <div style="font-weight: 700;">${esc(supplier?.tradingName || q.vendorId)}</div>
                                                        <div style="font-size: 11px; color: var(--proc-text-muted); font-weight: 400;">${esc(q.id)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            ${criteria.map(c => {
                                                const score = getScore(evaluation, q.id, c.criterion);
                                                return `
                                                    <td style="text-align: center;">
                                                        <input type="number" class="score-input" min="0" max="100" 
                                                            value="${score || ''}"
                                                            placeholder="—"
                                                            onchange="ProcurementEvaluation.setScore('${evaluation.id}', '${q.id}', '${c.criterion}', this.value)">
                                                    </td>
                                                `;
                                            }).join('')}
                                            <td style="text-align: center; background: #FEF9F0; font-weight: 800; font-size: 16px; color: ${weighted >= 80 ? 'var(--proc-success)' : weighted >= 60 ? 'var(--proc-warning)' : 'var(--proc-text-muted)'};">
                                                ${weighted > 0 ? weighted.toFixed(1) : '—'}
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    }
    
    function renderComparisonTab(rfq, evaluation, quotations) {
        const eligibleQuotes = quotations.filter(q => isEligible(q.id, evaluation));
        
        if (eligibleQuotes.length === 0) {
            return `
                <div class="proc-card">
                    <div class="proc-empty">
                        <h3>No eligible quotations to compare</h3>
                    </div>
                </div>
            `;
        }
        
        // Find best values
        const prices = eligibleQuotes.map(q => calculateQuotationTotal(q));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        const scores = eligibleQuotes.map(q => calculateWeightedScore(q.id, rfq, evaluation));
        const maxScore = Math.max(...scores);
        
        return `
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            ${eligibleQuotes.map(q => {
                                const supplier = getSupplier(q.vendorId);
                                return `<th>${esc(supplier?.tradingName || q.vendorId)}</th>`;
                            }).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="font-weight: 600;">Total Price</td>
                            ${eligibleQuotes.map(q => {
                                const total = calculateQuotationTotal(q);
                                const isBest = total === minPrice && prices.filter(p => p === minPrice).length === 1;
                                return `<td class="${isBest ? 'best-value' : ''}">${P.formatZAR(total)}${isBest ? ' 🏆' : ''}</td>`;
                            }).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">Delivery Lead</td>
                            ${eligibleQuotes.map(q => {
                                const days = q.deliveryLeadDays || 0;
                                const minDays = Math.min(...eligibleQuotes.map(x => x.deliveryLeadDays || 0));
                                const isBest = days === minDays && eligibleQuotes.filter(x => x.deliveryLeadDays === minDays).length === 1;
                                return `<td class="${isBest ? 'best-value' : ''}">${days} days${isBest ? ' ⚡' : ''}</td>`;
                            }).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">Line Items</td>
                            ${eligibleQuotes.map(q => `<td>${(q.lineItems || []).length}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">Mandatory Checks</td>
                            ${eligibleQuotes.map(q => {
                                const passed = (evaluation.mandatoryChecks || []).filter(m => m.quotationId === q.id && m.result === 'pass').length;
                                const total = (evaluation.mandatoryChecks || []).filter(m => m.quotationId === q.id).length;
                                return `<td>${passed}/${total} passed</td>`;
                            }).join('')}
                        </tr>
                        <tr style="background: var(--proc-bg);">
                            <td style="font-weight: 800; color: var(--proc-primary);">Weighted Score</td>
                            ${eligibleQuotes.map(q => {
                                const score = calculateWeightedScore(q.id, rfq, evaluation);
                                const isBest = score === maxScore && score > 0 && scores.filter(s => s === maxScore).length === 1;
                                return `<td style="font-weight: 800; font-size: 16px; color: ${isBest ? 'var(--proc-success)' : 'var(--proc-text)'};">${score.toFixed(1)}${isBest ? ' 🏆' : ''}</td>`;
                            }).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            ${scores.every(s => s > 0) && maxScore > 0 ? `
                <div class="recommendation-box" style="margin-top: 20px;">
                    <div class="recommendation-title">Highest Scoring Supplier</div>
                    ${(() => {
                        const winnerIdx = scores.indexOf(maxScore);
                        const winner = eligibleQuotes[winnerIdx];
                        const supplier = getSupplier(winner.vendorId);
                        return `
                            <div class="recommendation-winner">${esc(supplier?.tradingName || winner.vendorId)}</div>
                            <div class="recommendation-meta">
                                Score: ${maxScore.toFixed(1)} · Price: ${P.formatZAR(calculateQuotationTotal(winner))}
                            </div>
                        `;
                    })()}
                </div>
            ` : ''}
        `;
    }
    
    function renderApprovalTab(rfq, evaluation, quotations, award) {
        const eligibleQuotes = quotations.filter(q => isEligible(q.id, evaluation));
        const scores = eligibleQuotes.map(q => ({ quote: q, score: calculateWeightedScore(q.id, rfq, evaluation) }));
        const sorted = scores.sort((a, b) => b.score - a.score);
        const winner = sorted[0];
        
        const canSubmit = evaluation.conflictDeclared && 
                          (evaluation.mandatoryChecks || []).every(m => m.result !== 'pending') &&
                          scores.every(s => s.score > 0);
        
        if (award && award.status === 'issued') {
            return `
                <div class="award-hero">
                    <div class="award-hero-label">Award Issued</div>
                    <div class="award-hero-supplier">${esc(getSupplierName(award.vendorId))}</div>
                    <div class="award-hero-value">${P.formatZAR(award.awardedValue)}</div>
                    <div style="margin-top: 8px; font-size: 12px; opacity: 0.7;">Awarded on ${P.formatDate(award.awardedAt)}</div>
                </div>
                
                <div class="proc-card">
                    <div class="proc-card-title">Award Details</div>
                    <div class="proc-field"><span class="proc-field-label">Award ID</span><span class="proc-field-value">${esc(award.id)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Supplier</span><span class="proc-field-value">${esc(getSupplierName(award.vendorId))}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Quotation</span><span class="proc-field-value">${esc(award.quotationId)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Value</span><span class="proc-field-value">${P.formatZAR(award.awardedValue)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Rationale</span><span class="proc-field-value">${esc(award.rationale || '—')}</span></div>
                </div>
            `;
        }
        
        if (evaluation.status === 'pending_approval') {
            return `
                <div class="proc-card">
                    <div class="proc-card-title">Recommendation Submitted — Awaiting Approval</div>
                    ${winner ? `
                        <div class="recommendation-box">
                            <div class="recommendation-title">Recommended Supplier</div>
                            <div class="recommendation-winner">${esc(getSupplierName(winner.quote.vendorId))}</div>
                            <div class="recommendation-meta">
                                Score: ${winner.score.toFixed(1)} · Value: ${P.formatZAR(calculateQuotationTotal(winner.quote))}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 8px; margin-top: 20px;">
                        <button class="proc-btn proc-btn-success" onclick="ProcurementEvaluation.approveRecommendation('${evaluation.id}')">
                            ✓ Approve & Issue Award
                        </button>
                        <button class="proc-btn proc-btn-danger" onclick="ProcurementEvaluation.rejectRecommendation('${evaluation.id}')">
                            ✕ Reject & Return for Review
                        </button>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Submit Recommendation</div>
                
                ${!canSubmit ? `
                    <div style="background: var(--proc-warning-bg); border: 1px solid #FDE68A; border-radius: 10px; padding: 14px; margin-bottom: 16px; font-size: 13px; color: #92400E;">
                        <strong>Before submitting, complete:</strong>
                        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                            ${!evaluation.conflictDeclared ? '<li>Declare no conflict of interest</li>' : ''}
                            ${(evaluation.mandatoryChecks || []).some(m => m.result === 'pending') ? '<li>Complete all mandatory checks</li>' : ''}
                            ${scores.some(s => s.score === 0) ? '<li>Score all eligible quotations</li>' : ''}
                        </ul>
                    </div>
                ` : `
                    ${winner ? `
                        <div class="recommendation-box">
                            <div class="recommendation-title">Recommended Supplier (Highest Score)</div>
                            <div class="recommendation-winner">${esc(getSupplierName(winner.quote.vendorId))}</div>
                            <div class="recommendation-meta">
                                Score: ${winner.score.toFixed(1)} · Value: ${P.formatZAR(calculateQuotationTotal(winner.quote))}
                            </div>
                        </div>
                        
                        <div class="proc-form-group">
                            <label class="proc-form-label">Award Rationale (required)</label>
                            <textarea class="proc-form-textarea" id="awardRationale" rows="3" placeholder="Explain why this supplier was selected..."></textarea>
                        </div>
                        
                        <button class="proc-btn proc-btn-primary" onclick="ProcurementEvaluation.submitRecommendation('${evaluation.id}')">
                            Submit Recommendation for Approval
                        </button>
                    ` : '<p style="color: var(--proc-text-muted);">No eligible quotations to recommend.</p>'}
                `}
            </div>
        `;
    }
    
    // ============================================================
    // CALCULATIONS
    // ============================================================
    function getQuotationsFor(rfqId) {
        return (P.data.quotations || []).filter(q => q.rfqId === rfqId && q.status === 'submitted');
    }
    
    function isEligible(quotationId, evaluation) {
        const checks = (evaluation.mandatoryChecks || []).filter(m => m.quotationId === quotationId);
        if (checks.length === 0) return false;
        return !checks.some(m => m.result === 'fail');
    }
    
    function getScore(evaluation, quotationId, criterion) {
        const s = (evaluation.scores || []).find(x => x.quotationId === quotationId && x.criterion === criterion);
        return s ? s.score : 0;
    }
    
    function calculateWeightedScore(quotationId, rfq, evaluation) {
        const criteria = rfq.evaluationCriteria || [];
        let total = 0;
        let totalWeight = 0;
        
        criteria.forEach(c => {
            const score = getScore(evaluation, quotationId, c.criterion);
            if (score > 0) {
                total += (score / 100) * c.weight;
                totalWeight += c.weight;
            }
        });
        
        // If not all criteria scored, scale by completed weight
        if (totalWeight > 0 && totalWeight < 100) {
            return (total / totalWeight) * 100;
        }
        return total;
    }
    
    function calculateQuotationTotal(quote) {
        if (quote.total) return quote.total;
        return (quote.lineItems || []).reduce((s, li) => s + (li.qty * li.unitPrice), 0);
    }
    
    function calculateScoringProgress(rfq, evaluation, quotations) {
        const eligibleQuotes = quotations.filter(q => isEligible(q.id, evaluation));
        const criteria = rfq.evaluationCriteria || [];
        const total = eligibleQuotes.length * criteria.length;
        let scored = 0;
        
        eligibleQuotes.forEach(q => {
            criteria.forEach(c => {
                if (getScore(evaluation, q.id, c.criterion) > 0) scored++;
            });
        });
        
        return { scored, total };
    }
    
    function createBlankEvaluation(rfqId) {
        const rfq = (P.data.rfqs || []).find(r => r.id === rfqId);
        const quotes = getQuotationsFor(rfqId);
        const mandatoryCriteria = ['Valid Tax Clearance', 'Goods-in-Transit Insurance ≥ R10m', '≥ 5 years experience'];
        
        const mandatoryChecks = [];
        quotes.forEach(q => {
            mandatoryCriteria.forEach(c => {
                mandatoryChecks.push({ quotationId: q.id, criterion: c, result: 'pending', notes: '' });
            });
        });
        
        return {
            id: 'EVA-' + Date.now(),
            rfqId,
            status: 'in_progress',
            evaluator: (window.ERP?.currentUser?.name || 'Sarah Chen'),
            conflictDeclared: false,
            mandatoryChecks,
            scores: [],
            recommendation: null,
            createdAt: new Date().toISOString()
        };
    }
    
    // ============================================================
    // HELPERS
    // ============================================================
    function getSupplier(id) {
        return (P.data.suppliers || []).find(s => s.id === id);
    }
    
    function getSupplierName(id) {
        const s = getSupplier(id);
        return s ? s.tradingName : id;
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
    window.ProcurementEvaluation = {
        open: function(rfqId) {
            activeEvalTab = 'overview';
            document.body.dataset.currentEvalRfqId = rfqId;
            document.getElementById('contentArea').innerHTML = renderEvaluationWorkspace(rfqId);
            document.getElementById('contentArea').scrollTop = 0;
        },
        
        backToDashboard: function() {
            document.body.dataset.currentEvalRfqId = '';
            document.getElementById('contentArea').innerHTML = renderEvaluationDashboard();
        },
        
        switchTab: function(tab) {
            activeEvalTab = tab;
            const rfqId = document.body.dataset.currentEvalRfqId;
            if (rfqId) document.getElementById('contentArea').innerHTML = renderEvaluationWorkspace(rfqId);
        },
        
        declareConflict: function(evalId) {
            const evalRec = (P.data.evaluations || []).find(e => e.id === evalId);
            if (!evalRec) return;
            evalRec.conflictDeclared = true;
            P.save();
            this.refresh();
            if (window.App) window.App.toast('Conflict declaration recorded', 'success');
        },
        
        setCheck: function(evalId, quotationId, criterion, result) {
            const evalRec = (P.data.evaluations || []).find(e => e.id === evalId);
            if (!evalRec) return;
            
            let check = (evalRec.mandatoryChecks || []).find(m => m.quotationId === quotationId && m.criterion === criterion);
            if (check) {
                check.result = result;
            } else {
                evalRec.mandatoryChecks.push({ quotationId, criterion, result, notes: '' });
            }
            P.save();
            this.refresh();
        },
        
        setScore: function(evalId, quotationId, criterion, value) {
            const evalRec = (P.data.evaluations || []).find(e => e.id === evalId);
            if (!evalRec) return;
            
            const score = parseFloat(value);
            if (isNaN(score) || score < 0 || score > 100) {
                alert('Score must be between 0 and 100');
                this.refresh();
                return;
            }
            
            let existing = (evalRec.scores || []).find(s => s.quotationId === quotationId && s.criterion === criterion);
            if (existing) {
                existing.score = score;
            } else {
                evalRec.scores.push({ quotationId, criterion, score, comment: '' });
            }
            P.save();
            this.refresh();
        },
        
        submitRecommendation: function(evalId) {
            const evalRec = (P.data.evaluations || []).find(e => e.id === evalId);
            if (!evalRec) return;
            
            const rationale = document.getElementById('awardRationale')?.value?.trim();
            if (!rationale) {
                alert('Please provide an award rationale');
                return;
            }
            
            evalRec.status = 'pending_approval';
            evalRec.recommendation = { rationale, submittedAt: new Date().toISOString(), submittedBy: (window.ERP?.currentUser?.name || 'Sarah Chen') };
            P.save();
            this.refresh();
            if (window.App) window.App.toast('Recommendation submitted for approval', 'success');
        },
        
        approveRecommendation: function(evalId) {
            if (!confirm('Approve this recommendation and issue the award?')) return;
            
            const evalRec = (P.data.evaluations || []).find(e => e.id === evalId);
            if (!evalRec) return;
            
            const rfq = (P.data.rfqs || []).find(r => r.id === evalRec.rfqId);
            if (!rfq) return;
            
            const quotes = getQuotationsFor(rfq.id);
            const eligibleQuotes = quotes.filter(q => isEligible(q.id, evalRec));
            const scores = eligibleQuotes.map(q => ({ quote: q, score: calculateWeightedScore(q.id, rfq, evalRec) }));
            const winner = scores.sort((a, b) => b.score - a.score)[0];
            
            if (!winner) { alert('No winner could be determined'); return; }
            
            // Create award
            const award = {
                id: 'AWD-' + Date.now(),
                rfqId: rfq.id,
                quotationId: winner.quote.id,
                vendorId: winner.quote.vendorId,
                awardedValue: calculateQuotationTotal(winner.quote),
                rationale: evalRec.recommendation?.rationale || '',
                status: 'issued',
                awardedAt: new Date().toISOString(),
                awardedBy: (window.ERP?.currentUser?.name || 'Sarah Chen')
            };
            
            if (!P.data.awards) P.data.awards = [];
            P.data.awards.push(award);
            
            // Update evaluation
            evalRec.status = 'approved';
            evalRec.approvedAt = new Date().toISOString();
            
            // Update RFQ
            rfq.status = 'awarded';
            rfq.awardedTo = winner.quote.vendorId;
            rfq.awardedValue = award.awardedValue;
            rfq.awardedAt = award.awardedAt;
            
            // Update quotations
            quotes.forEach(q => {
                if (q.id === winner.quote.id) {
                    q.status = 'awarded';
                    q.awardedAt = award.awardedAt;
                } else {
                    q.status = 'unsuccessful';
                    q.decidedAt = award.awardedAt;
                }
            });
            
            P.save();
            this.refresh();
            if (window.App) window.App.toast(`Award issued to ${getSupplierName(winner.quote.vendorId)}`, 'success');
        },
        
        rejectRecommendation: function(evalId) {
            if (!confirm('Reject this recommendation and return for review?')) return;
            
            const evalRec = (P.data.evaluations || []).find(e => e.id === evalId);
            if (!evalRec) return;
            
            evalRec.status = 'in_progress';
            evalRec.recommendation = null;
            P.save();
            this.refresh();
            if (window.App) window.App.toast('Recommendation rejected — returned for review', 'info');
        },
        
        refresh: function() {
            const rfqId = document.body.dataset.currentEvalRfqId;
            if (rfqId) {
                document.getElementById('contentArea').innerHTML = renderEvaluationWorkspace(rfqId);
            } else {
                document.getElementById('contentArea').innerHTML = renderEvaluationDashboard();
            }
        }
    };
    
})();