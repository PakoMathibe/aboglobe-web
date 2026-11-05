// ============================================================
// PROCUREMENT - RFQ & SOURCING MODULE (fixed init + guards)
// ============================================================

(function() {
    'use strict';
    
    // Wait for Procurement to exist
    if (!window.Procurement) {
        console.error('[RFQ] Procurement not loaded. Ensure procurement-store.js runs first.');
        return;
    }
    
    const P = window.Procurement;
    const esc = P.escapeHtml;
    
    if (typeof window.Views === 'undefined') {
        console.error('[RFQ] Views not defined. Load admin-core.js first.');
        return;
    }
    
    // ============================================================
    // INITIALIZATION - wait for Procurement.init() to finish
    // ============================================================
    
    function initRfqModule() {
        // Ensure P.data exists (Procurement.init may still be running)
        if (!P.data) {
            P.init();
        }
        
        if (!P.data) {
            console.error('[RFQ] Procurement.data still null after init');
            return;
        }
        
        // Seed RFQs if not present
        if (!P.data.rfqs || P.data.rfqs.length === 0) {
            seedRfqs();
        }
        
        // Register the view NOW that data is ready
        window.Views.procurementRfq = function() {
            return renderRfqDashboard();
        };
        
        console.log('[RFQ] Module ready -', (P.data.rfqs || []).length, 'RFQs');
    }
    
    // If Procurement was already initialized before this script ran, init immediately.
    // Otherwise wait for DOMContentLoaded + a short delay to let store finish.
    if (P.initialized && P.data) {
        initRfqModule();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            // Give procurement-store.js a tick to finish
            setTimeout(initRfqModule, 0);
        });
    }
    
    // ============================================================
    // SEED DATA
    // ============================================================
    
    function seedRfqs() {
        if (!P.data) return;
        P.data.rfqs = [
            {
                id: "RFQ-2026-0001",
                title: "Enterprise Network Equipment Supply",
                category: "ICT Hardware",
                department: "Information Technology",
                requester: "Marcus Johnson",
                owner: "Elena Rodriguez",
                status: "published",
                currency: "ZAR",
                procurementMethod: "Open Tender",
                priority: "High",
                costCentre: "IT-INFRA-2026",
                justification: "Network refresh for HQ and Sandton office. Current switches EOL.",
                internalReference: "IT-NET-REFRESH-2026",
                estimatedBudget: 500000,
                deliveryLocation: "Sandton, Johannesburg",
                requiredDeliveryDate: "2026-12-15",
                submissionDeadline: "2026-11-15T16:00:00+02:00",
                questionsDeadline: "2026-11-08T16:00:00+02:00",
                validityPeriod: 60,
                paymentTerms: "Net 30",
                warrantyMonths: 36,
                lineItems: [
                    { line: 1, description: "48-port managed switches (L3)", category: "Networking", qty: 12, uom: "units", estUnitPrice: 35000, deliveryDate: "2026-12-15" },
                    { line: 2, description: "SFP+ transceivers 10G", category: "Networking", qty: 24, uom: "units", estUnitPrice: 2500, deliveryDate: "2026-12-15" },
                    { line: 3, description: "Rack mounting kits", category: "Networking", qty: 12, uom: "units", estUnitPrice: 800, deliveryDate: "2026-12-15" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 40 },
                    { criterion: "Technical Compliance", weight: 25 },
                    { criterion: "Delivery Capability", weight: 15 },
                    { criterion: "Supplier Track Record", weight: 10 },
                    { criterion: "Warranty & Support", weight: 10 }
                ],
                invitedVendors: ["VEN-0001", "VEN-0002"],
                clarifications: [
                    { id: "CLR-0001", vendorId: "VEN-0001", question: "Are the SFP+ modules included in the switch warranty?", submittedAt: "2026-10-25T10:30:00+02:00", answer: "Yes, all accessories carry the same 36-month warranty.", answeredAt: "2026-10-26T09:00:00+02:00", answeredBy: "Elena Rodriguez", visibility: "shared", status: "answered" }
                ],
                createdAt: "2026-10-20T09:00:00+02:00",
                publishedAt: "2026-10-22T09:00:00+02:00"
            },
            {
                id: "RFQ-2026-0002",
                title: "Cloud Software Licensing - Annual Renewal",
                category: "Software Licensing",
                department: "Information Technology",
                requester: "Marcus Johnson",
                owner: "Elena Rodriguez",
                status: "draft",
                currency: "ZAR",
                procurementMethod: "Limited Tender",
                priority: "Medium",
                costCentre: "IT-LIC-2026",
                justification: "Annual renewal of Microsoft 365 E3 licenses for 250 users.",
                internalReference: "IT-LIC-2026",
                estimatedBudget: 890000,
                deliveryLocation: "Electronic delivery",
                requiredDeliveryDate: "2026-12-01",
                submissionDeadline: "2026-11-20T16:00:00+02:00",
                questionsDeadline: "2026-11-13T16:00:00+02:00",
                validityPeriod: 30,
                paymentTerms: "Net 30",
                warrantyMonths: 12,
                lineItems: [
                    { line: 1, description: "Microsoft 365 E3 licenses", category: "Software", qty: 250, uom: "users", estUnitPrice: 3500, deliveryDate: "2026-12-01" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 60 },
                    { criterion: "Vendor Support", weight: 20 },
                    { criterion: "Delivery Capability", weight: 20 }
                ],
                invitedVendors: [],
                clarifications: [],
                createdAt: "2026-10-24T11:00:00+02:00"
            },
            {
                id: "RFQ-2026-0003",
                title: "National Road Freight Services",
                category: "Logistics",
                department: "Operations",
                requester: "David Kim",
                owner: "Sarah Chen",
                status: "closed",
                currency: "ZAR",
                procurementMethod: "Open Tender",
                priority: "High",
                costCentre: "OPS-LOG-2026",
                justification: "Continuity of national distribution network. Current SLA expires December.",
                internalReference: "OPS-FREIGHT-Q4",
                estimatedBudget: 1200000,
                deliveryLocation: "Multiple - Johannesburg, Cape Town, Durban",
                requiredDeliveryDate: "2026-12-01",
                submissionDeadline: "2026-10-15T16:00:00+02:00",
                questionsDeadline: "2026-10-08T16:00:00+02:00",
                validityPeriod: 90,
                paymentTerms: "Net 45",
                warrantyMonths: 0,
                lineItems: [
                    { line: 1, description: "Road freight - JHB to CPT", category: "Logistics", qty: 24, uom: "trips", estUnitPrice: 18000, deliveryDate: "2026-12-01" },
                    { line: 2, description: "Road freight - JHB to DBN", category: "Logistics", qty: 18, uom: "trips", estUnitPrice: 12000, deliveryDate: "2026-12-01" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 45 },
                    { criterion: "Delivery Capability", weight: 25 },
                    { criterion: "Supplier Track Record", weight: 20 },
                    { criterion: "Insurance & Compliance", weight: 10 }
                ],
                invitedVendors: ["VEN-0003"],
                clarifications: [],
                createdAt: "2026-10-01T09:00:00+02:00",
                publishedAt: "2026-10-03T09:00:00+02:00",
                closedAt: "2026-10-15T16:00:00+02:00"
            },
            {
                id: "RFQ-2026-0004",
                title: "Office Furniture - Cape Town Office",
                category: "Office Supplies",
                department: "Facilities",
                requester: "Aisha Patel",
                owner: "Elena Rodriguez",
                status: "published",
                currency: "ZAR",
                procurementMethod: "Price Comparison",
                priority: "Low",
                costCentre: "FAC-CPT-2026",
                justification: "New Cape Town office fit-out - 30 desks, 30 chairs, 5 meeting tables.",
                internalReference: "FAC-CPT-FITOUT",
                estimatedBudget: 350000,
                deliveryLocation: "Cape Town, Western Cape",
                requiredDeliveryDate: "2026-12-20",
                submissionDeadline: "2026-11-25T16:00:00+02:00",
                questionsDeadline: "2026-11-18T16:00:00+02:00",
                validityPeriod: 45,
                paymentTerms: "Net 30",
                warrantyMonths: 24,
                lineItems: [
                    { line: 1, description: "Executive desks 1800x900", category: "Furniture", qty: 30, uom: "units", estUnitPrice: 4500, deliveryDate: "2026-12-20" },
                    { line: 2, description: "Ergonomic office chairs", category: "Furniture", qty: 30, uom: "units", estUnitPrice: 3800, deliveryDate: "2026-12-20" },
                    { line: 3, description: "Boardroom tables 12-seater", category: "Furniture", qty: 5, uom: "units", estUnitPrice: 22000, deliveryDate: "2026-12-20" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 50 },
                    { criterion: "Quality & Design", weight: 25 },
                    { criterion: "Delivery Capability", weight: 15 },
                    { criterion: "Warranty", weight: 10 }
                ],
                invitedVendors: ["VEN-0004", "VEN-0010"],
                clarifications: [],
                createdAt: "2026-10-15T09:00:00+02:00",
                publishedAt: "2026-10-18T09:00:00+02:00"
            },
            {
                id: "RFQ-2026-0005",
                title: "Solar PV Installation - Kimberley DC",
                category: "Renewable Energy",
                department: "Operations",
                requester: "David Kim",
                owner: "Sarah Chen",
                status: "pending_approval",
                currency: "ZAR",
                procurementMethod: "Open Tender",
                priority: "High",
                costCentre: "OPS-ENERGY-2026",
                justification: "Reduce operating costs at Kimberley distribution centre. 200kW installation.",
                internalReference: "OPS-SOLAR-KIM",
                estimatedBudget: 1800000,
                deliveryLocation: "Kimberley, Northern Cape",
                requiredDeliveryDate: "2027-03-31",
                submissionDeadline: "2026-12-10T16:00:00+02:00",
                questionsDeadline: "2026-12-03T16:00:00+02:00",
                validityPeriod: 90,
                paymentTerms: "Milestone-based",
                warrantyMonths: 120,
                lineItems: [
                    { line: 1, description: "200kW solar PV system - turnkey", category: "Renewable Energy", qty: 1, uom: "system", estUnitPrice: 1800000, deliveryDate: "2027-03-31" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 35 },
                    { criterion: "Technical Solution", weight: 30 },
                    { criterion: "Warranty & Support", weight: 20 },
                    { criterion: "Track Record", weight: 15 }
                ],
                invitedVendors: ["VEN-0008"],
                clarifications: [],
                createdAt: "2026-10-22T09:00:00+02:00"
            },
            {
                id: "RFQ-2026-0006",
                title: "Skills Development Training - Q1 2027",
                category: "Training",
                department: "Human Resources",
                requester: "Aisha Patel",
                owner: "Elena Rodriguez",
                status: "under_evaluation",
                currency: "ZAR",
                procurementMethod: "Limited Tender",
                priority: "Medium",
                costCentre: "HR-TRN-2027",
                justification: "Mandatory skills development for 50 staff. Learnerships and soft skills.",
                internalReference: "HR-TRN-Q1-2027",
                estimatedBudget: 450000,
                deliveryLocation: "Johannesburg, Gauteng",
                requiredDeliveryDate: "2027-01-15",
                submissionDeadline: "2026-10-20T16:00:00+02:00",
                questionsDeadline: "2026-10-13T16:00:00+02:00",
                validityPeriod: 60,
                paymentTerms: "Net 30",
                warrantyMonths: 0,
                lineItems: [
                    { line: 1, description: "Learnership program - 25 learners", category: "Training", qty: 25, uom: "learners", estUnitPrice: 12000, deliveryDate: "2027-01-15" },
                    { line: 2, description: "Soft skills workshops - 25 staff", category: "Training", qty: 25, uom: "participants", estUnitPrice: 6000, deliveryDate: "2027-01-15" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 40 },
                    { criterion: "Programme Quality", weight: 30 },
                    { criterion: "Accreditation", weight: 20 },
                    { criterion: "Track Record", weight: 10 }
                ],
                invitedVendors: ["VEN-0006"],
                clarifications: [],
                createdAt: "2026-10-08T09:00:00+02:00",
                publishedAt: "2026-10-10T09:00:00+02:00",
                closedAt: "2026-10-20T16:00:00+02:00"
            },
            {
                id: "RFQ-2026-0007",
                title: "Construction Services - Warehouse Extension",
                category: "Construction",
                department: "Operations",
                requester: "David Kim",
                owner: "Sarah Chen",
                status: "cancelled",
                currency: "ZAR",
                procurementMethod: "Open Tender",
                priority: "High",
                costCentre: "OPS-CONST-2026",
                justification: "Warehouse extension - cancelled due to budget reprioritisation.",
                internalReference: "OPS-WH-EXT",
                estimatedBudget: 3500000,
                deliveryLocation: "Polokwane, Limpopo",
                requiredDeliveryDate: "2027-06-30",
                submissionDeadline: "2026-11-30T16:00:00+02:00",
                questionsDeadline: "2026-11-23T16:00:00+02:00",
                validityPeriod: 120,
                paymentTerms: "Milestone-based",
                warrantyMonths: 60,
                lineItems: [
                    { line: 1, description: "Warehouse extension 500sqm", category: "Construction", qty: 1, uom: "project", estUnitPrice: 3500000, deliveryDate: "2027-06-30" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 40 },
                    { criterion: "Technical Capability", weight: 30 },
                    { criterion: "Track Record", weight: 20 },
                    { criterion: "Safety Compliance", weight: 10 }
                ],
                invitedVendors: [],
                clarifications: [],
                cancellationReason: "Budget reprioritised to Q3 2027",
                cancelledAt: "2026-10-20T14:00:00+02:00",
                createdAt: "2026-10-12T09:00:00+02:00"
            },
            {
                id: "RFQ-2026-0008",
                title: "Catering Services - Annual Corporate Events",
                category: "Catering",
                department: "Human Resources",
                requester: "Aisha Patel",
                owner: "Elena Rodriguez",
                status: "awarded",
                currency: "ZAR",
                procurementMethod: "Price Comparison",
                priority: "Low",
                costCentre: "HR-EVT-2026",
                justification: "Annual corporate event catering - quarterly events + year-end function.",
                internalReference: "HR-CATER-2026",
                estimatedBudget: 180000,
                deliveryLocation: "Stellenbosch, Western Cape",
                requiredDeliveryDate: "2027-01-30",
                submissionDeadline: "2026-09-15T16:00:00+02:00",
                questionsDeadline: "2026-09-08T16:00:00+02:00",
                validityPeriod: 60,
                paymentTerms: "Per event",
                warrantyMonths: 0,
                lineItems: [
                    { line: 1, description: "Quarterly corporate events (4x)", category: "Catering", qty: 4, uom: "events", estUnitPrice: 25000, deliveryDate: "2027-01-30" },
                    { line: 2, description: "Year-end function - 200 guests", category: "Catering", qty: 1, uom: "event", estUnitPrice: 80000, deliveryDate: "2027-01-30" }
                ],
                evaluationCriteria: [
                    { criterion: "Price", weight: 55 },
                    { criterion: "Menu Quality", weight: 25 },
                    { criterion: "Track Record", weight: 20 }
                ],
                invitedVendors: ["VEN-0010"],
                clarifications: [],
                awardedTo: "VEN-0010",
                awardedValue: 165000,
                awardedAt: "2026-10-05T10:00:00+02:00",
                createdAt: "2026-09-01T09:00:00+02:00",
                publishedAt: "2026-09-03T09:00:00+02:00",
                closedAt: "2026-09-15T16:00:00+02:00"
            }
        ];
        
        P.save();
    }
    
    // ============================================================
    // HELPERS (guarded)
    // ============================================================
    
    function getRfqs() {
        return (P.data && P.data.rfqs) ? P.data.rfqs : [];
    }
    
    function getSuppliers() {
        return (P.data && P.data.suppliers) ? P.data.suppliers : [];
    }
    
    function getSupplier(id) {
        return getSuppliers().find(s => s.id === id);
    }
    
    // ============================================================
    // DASHBOARD
    // ============================================================
    
    function renderRfqDashboard() {
        const rfqs = getRfqs();
        
        const stats = {
            total: rfqs.length,
            draft: rfqs.filter(r => r.status === 'draft').length,
            published: rfqs.filter(r => r.status === 'published').length,
            closed: rfqs.filter(r => r.status === 'closed').length,
            evaluation: rfqs.filter(r => r.status === 'under_evaluation').length,
            awarded: rfqs.filter(r => r.status === 'awarded').length
        };
        
        return `
            <div class="proc-dashboard-page">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 800; color: var(--proc-text); margin-bottom: 4px;">RFQ & Sourcing</h2>
                        <p style="font-size: 14px; color: var(--proc-text-muted);">Create opportunities, invite suppliers, manage deadlines</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="proc-btn proc-btn-secondary" onclick="ProcurementRfq.exportCSV()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Export
                        </button>
                        <button class="proc-btn proc-btn-primary" onclick="ProcurementRfq.openWizard()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            New RFQ
                        </button>
                    </div>
                </div>
                
                <div class="proc-dashboard">
                    ${rfqKpi('Total RFQs', stats.total, 'All time', 'primary')}
                    ${rfqKpi('Draft', stats.draft, 'Not yet published', 'neutral')}
                    ${rfqKpi('Published', stats.published, 'Open for quotation', 'success')}
                    ${rfqKpi('Under Evaluation', stats.evaluation, 'Comparing quotes', 'warning')}
                    ${rfqKpi('Awarded', stats.awarded, 'Contract issued', 'info')}
                </div>
                
                ${renderRfqRegister()}
            </div>
        `;
    }
    
    function rfqKpi(label, value, sub, variant) {
        return `
            <div class="proc-kpi kpi-${variant}">
                <div class="proc-kpi-label">${label}</div>
                <div class="proc-kpi-value">${value}</div>
                <div class="proc-kpi-sub">${sub}</div>
            </div>
        `;
    }
    
    let rfqFilters = { search: '', status: 'all', category: 'all' };
    
    function renderRfqRegister() {
        const rfqs = getFilteredRfqs();
        const categories = [...new Set(getRfqs().map(r => r.category).filter(Boolean))].sort();
        
        return `
            <div class="proc-register">
                <div class="proc-register-toolbar">
                    <div class="proc-filter-row">
                        <div class="proc-search-input">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input type="text" placeholder="Search RFQs..." value="${esc(rfqFilters.search)}" oninput="ProcurementRfq.setFilter('search', this.value)">
                        </div>
                        <select class="proc-filter-chip" onchange="ProcurementRfq.setFilter('status', this.value)">
                            <option value="all" ${rfqFilters.status === 'all' ? 'selected' : ''}>All Statuses</option>
                            <option value="draft" ${rfqFilters.status === 'draft' ? 'selected' : ''}>Draft</option>
                            <option value="pending_approval" ${rfqFilters.status === 'pending_approval' ? 'selected' : ''}>Pending Approval</option>
                            <option value="published" ${rfqFilters.status === 'published' ? 'selected' : ''}>Published</option>
                            <option value="closed" ${rfqFilters.status === 'closed' ? 'selected' : ''}>Closed</option>
                            <option value="under_evaluation" ${rfqFilters.status === 'under_evaluation' ? 'selected' : ''}>Under Evaluation</option>
                            <option value="awarded" ${rfqFilters.status === 'awarded' ? 'selected' : ''}>Awarded</option>
                            <option value="cancelled" ${rfqFilters.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <select class="proc-filter-chip" onchange="ProcurementRfq.setFilter('category', this.value)">
                            <option value="all" ${rfqFilters.category === 'all' ? 'selected' : ''}>All Categories</option>
                            ${categories.map(c => `<option value="${esc(c)}" ${rfqFilters.category === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                ${rfqs.length === 0 ? emptyRfqState() : `
                <div style="overflow-x: auto;">
                    <table class="proc-table">
                        <thead>
                            <tr>
                                <th>RFQ #</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Owner</th>
                                <th>Deadline</th>
                                <th>Budget</th>
                                <th>Invited</th>
                                <th>Status</th>
                                <th style="text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rfqs.map(r => renderRfqRow(r)).join('')}
                        </tbody>
                    </table>
                </div>
                `}
            </div>
        `;
    }
    
    function renderRfqRow(rfq) {
        const countdown = getCountdown(rfq.submissionDeadline, rfq.status);
        const estValue = (rfq.lineItems || []).reduce((s, li) => s + (li.qty * li.estUnitPrice), 0);
        
        return `
            <tr onclick="ProcurementRfq.openRfq('${rfq.id}')">
                <td><span class="font-mono text-xs" style="color: var(--proc-primary); font-weight: 700;">${esc(rfq.id)}</span></td>
                <td>
                    <div style="font-weight: 700; font-size: 13px;">${esc(rfq.title)}</div>
                    <div style="font-size: 11px; color: var(--proc-text-muted);">${esc(rfq.department)}</div>
                </td>
                <td><span style="font-size: 11px; padding: 2px 8px; background: #F3F4F6; border-radius: 4px;">${esc(rfq.category)}</span></td>
                <td style="font-size: 12px;">${esc(rfq.owner)}</td>
                <td>${countdown}</td>
                <td style="font-weight: 700; font-size: 13px;">${P.formatZAR(estValue)}</td>
                <td><span style="font-size: 12px;">${(rfq.invitedVendors || []).length}</span></td>
                <td>${getRfqStatusBadge(rfq.status)}</td>
                <td style="text-align: right;" onclick="event.stopPropagation()">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementRfq.openRfq('${rfq.id}')">View →</button>
                </td>
            </tr>
        `;
    }
    
    function getFilteredRfqs() {
        let list = [...getRfqs()];
        
        if (rfqFilters.search) {
            const q = rfqFilters.search.toLowerCase();
            list = list.filter(r => 
                (r.title || '').toLowerCase().includes(q) ||
                (r.id || '').toLowerCase().includes(q) ||
                (r.department || '').toLowerCase().includes(q) ||
                (r.owner || '').toLowerCase().includes(q)
            );
        }
        
        if (rfqFilters.status !== 'all') list = list.filter(r => r.status === rfqFilters.status);
        if (rfqFilters.category !== 'all') list = list.filter(r => r.category === rfqFilters.category);
        
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    function emptyRfqState() {
        return `
            <div class="proc-empty">
                <div class="proc-empty-icon">📋</div>
                <h3>No RFQs match your filters</h3>
                <p>Try adjusting your filters or create a new RFQ.</p>
            </div>
        `;
    }
    
    // ============================================================
    // DETAIL VIEW
    // ============================================================
    
    let activeRfqTab = 'overview';
    
    function renderRfqDetail(rfqId) {
        const rfq = getRfqs().find(r => r.id === rfqId);
        if (!rfq) return '<div class="proc-empty"><h3>RFQ not found</h3></div>';
        
        const tabs = [
            { id: 'overview', label: 'Overview' },
            { id: 'items', label: 'Line Items' },
            { id: 'vendors', label: 'Invited Suppliers' },
            { id: 'criteria', label: 'Evaluation Criteria' },
            { id: 'clarifications', label: 'Clarifications' },
            { id: 'activity', label: 'Activity' }
        ];
        
        return `
            <div class="proc-detail-page">
                <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementRfq.backToRegister()">
                        ← Back to RFQ Register
                    </button>
                    <div style="display: flex; gap: 6px;">
                        ${renderRfqActions(rfq)}
                    </div>
                </div>
                
                <div class="proc-detail-header">
                    <div class="proc-detail-header-inner">
                        <div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                                <span style="font-family: monospace; font-size: 11px; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px;">${esc(rfq.id)}</span>
                                ${getRfqStatusBadge(rfq.status)}
                            </div>
                            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${esc(rfq.title)}</h1>
                            <p style="color: rgba(255,255,255,0.7); font-size: 13px;">${esc(rfq.department)} · Owner: ${esc(rfq.owner)}</p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Submission Deadline</div>
                            <div style="font-size: 15px; font-weight: 800;">${P.formatDate(rfq.submissionDeadline)}</div>
                            <div style="margin-top: 6px;">${getCountdown(rfq.submissionDeadline, rfq.status)}</div>
                        </div>
                    </div>
                </div>
                
                ${renderLifecycle(rfq)}
                
                <div class="proc-tabs">
                    ${tabs.map(t => `
                        <button class="proc-tab ${activeRfqTab === t.id ? 'active' : ''}" 
                            onclick="ProcurementRfq.switchTab('${t.id}')">${t.label}</button>
                    `).join('')}
                </div>
                
                <div class="proc-tab-content">
                    ${renderRfqTabContent(activeRfqTab, rfq)}
                </div>
            </div>
        `;
    }
    
    function renderRfqActions(rfq) {
        const actions = [];
        if (rfq.status === 'draft') {
            actions.push(`<button class="proc-btn proc-btn-secondary proc-btn-sm" onclick="ProcurementRfq.openWizard('${rfq.id}')">Edit</button>`);
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementRfq.submitForApproval('${rfq.id}')">Submit for Approval</button>`);
        }
        if (rfq.status === 'pending_approval') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementRfq.publish('${rfq.id}')">Approve & Publish</button>`);
        }
        if (rfq.status === 'published') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementRfq.closeRfq('${rfq.id}')">Close Submissions</button>`);
        }
        if (rfq.status === 'closed') {
            actions.push(`<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementRfq.startEvaluation('${rfq.id}')">Start Evaluation</button>`);
        }
        return actions.join('');
    }
    
    function renderLifecycle(rfq) {
        const stages = ['draft', 'pending_approval', 'published', 'closed', 'under_evaluation', 'awarded'];
        const labels = ['Draft', 'Approval', 'Published', 'Closed', 'Evaluation', 'Awarded'];
        const currentIdx = stages.indexOf(rfq.status);
        
        return `
            <div class="rfq-lifecycle">
                ${stages.map((s, i) => {
                    let cls = '';
                    if (i < currentIdx) cls = 'done';
                    else if (i === currentIdx) cls = 'current';
                    return `<div class="rfq-lifecycle-step ${cls}">${labels[i]}</div>`;
                }).join('')}
            </div>
        `;
    }
    
    function renderRfqTabContent(tabId, rfq) {
        switch (tabId) {
            case 'overview': return renderRfqOverviewTab(rfq);
            case 'items': return renderRfqItemsTab(rfq);
            case 'vendors': return renderRfqVendorsTab(rfq);
            case 'criteria': return renderRfqCriteriaTab(rfq);
            case 'clarifications': return renderRfqClarificationsTab(rfq);
            case 'activity': return renderRfqActivityTab(rfq);
            default: return renderRfqOverviewTab(rfq);
        }
    }
    
    function renderRfqOverviewTab(rfq) {
        const estValue = (rfq.lineItems || []).reduce((s, li) => s + (li.qty * li.estUnitPrice), 0);
        const totalQty = (rfq.lineItems || []).reduce((s, li) => s + li.qty, 0);
        
        return `
            <div class="proc-grid-2">
                <div class="proc-card">
                    <div class="proc-card-title">General Information</div>
                    <div class="proc-field"><span class="proc-field-label">Category</span><span class="proc-field-value">${esc(rfq.category)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Department</span><span class="proc-field-value">${esc(rfq.department)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Requester</span><span class="proc-field-value">${esc(rfq.requester)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Method</span><span class="proc-field-value">${esc(rfq.procurementMethod)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Priority</span><span class="proc-field-value">${esc(rfq.priority)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Cost Centre</span><span class="proc-field-value">${esc(rfq.costCentre)}</span></div>
                </div>
                
                <div class="proc-card">
                    <div class="proc-card-title">Commercial Terms</div>
                    <div class="proc-field"><span class="proc-field-label">Estimated Budget</span><span class="proc-field-value" style="color: var(--proc-primary); font-weight: 800;">${P.formatZAR(estValue)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Payment Terms</span><span class="proc-field-value">${esc(rfq.paymentTerms)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Validity Period</span><span class="proc-field-value">${rfq.validityPeriod} days</span></div>
                    <div class="proc-field"><span class="proc-field-label">Warranty</span><span class="proc-field-value">${rfq.warrantyMonths} months</span></div>
                    <div class="proc-field"><span class="proc-field-label">Delivery Location</span><span class="proc-field-value">${esc(rfq.deliveryLocation)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Required By</span><span class="proc-field-value">${P.formatDate(rfq.requiredDeliveryDate)}</span></div>
                </div>
            </div>
            
            <div class="proc-card" style="margin-top: 20px;">
                <div class="proc-card-title">Justification</div>
                <p style="font-size: 13px; color: var(--proc-text); line-height: 1.6;">${esc(rfq.justification)}</p>
            </div>
            
            <div class="proc-grid-3" style="margin-top: 20px;">
                <div class="rfq-summary-card">
                    <div class="rfq-summary-label">Line Items</div>
                    <div class="rfq-summary-value">${(rfq.lineItems || []).length}</div>
                </div>
                <div class="rfq-summary-card">
                    <div class="rfq-summary-label">Total Units</div>
                    <div class="rfq-summary-value">${totalQty}</div>
                </div>
                <div class="rfq-summary-card">
                    <div class="rfq-summary-label">Invited Suppliers</div>
                    <div class="rfq-summary-value">${(rfq.invitedVendors || []).length}</div>
                </div>
            </div>
            
            ${rfq.status === 'cancelled' && rfq.cancellationReason ? `
                <div style="margin-top: 20px; background: var(--proc-danger-bg); border: 1px solid #FECACA; border-radius: 12px; padding: 16px;">
                    <div style="font-weight: 700; color: var(--proc-danger); margin-bottom: 4px;">Cancelled</div>
                    <div style="font-size: 13px; color: #7F1D1D;">${esc(rfq.cancellationReason)}</div>
                </div>
            ` : ''}
            
            ${rfq.status === 'awarded' && rfq.awardedTo ? `
                <div style="margin-top: 20px; background: var(--proc-success-bg); border: 1px solid #A7F3D0; border-radius: 12px; padding: 16px;">
                    <div style="font-weight: 700; color: var(--proc-success); margin-bottom: 4px;">Awarded</div>
                    <div style="font-size: 13px; color: #065F46;">
                        Awarded to ${esc((getSupplier(rfq.awardedTo) || {}).tradingName || rfq.awardedTo)} 
                        for ${P.formatZAR(rfq.awardedValue)} on ${P.formatDate(rfq.awardedAt)}
                    </div>
                </div>
            ` : ''}
        `;
    }
    
    function renderRfqItemsTab(rfq) {
        const estTotal = (rfq.lineItems || []).reduce((s, li) => s + (li.qty * li.estUnitPrice), 0);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Line Items (${(rfq.lineItems || []).length})</div>
                <table class="proc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th style="text-align: right;">Qty</th>
                            <th>UOM</th>
                            <th style="text-align: right;">Est. Unit Price</th>
                            <th style="text-align: right;">Est. Line Total</th>
                            <th>Delivery Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(rfq.lineItems || []).map(li => `
                            <tr>
                                <td><span style="font-weight: 800; color: var(--proc-primary);">${li.line}</span></td>
                                <td style="font-weight: 600;">${esc(li.description)}</td>
                                <td>${esc(li.category)}</td>
                                <td style="text-align: right;">${li.qty}</td>
                                <td>${esc(li.uom)}</td>
                                <td style="text-align: right;">${P.formatZAR(li.estUnitPrice)}</td>
                                <td style="text-align: right; font-weight: 700;">${P.formatZAR(li.qty * li.estUnitPrice)}</td>
                                <td style="font-size: 12px;">${P.formatDate(li.deliveryDate)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background: var(--proc-bg);">
                            <td colspan="6" style="text-align: right; font-weight: 700; padding: 12px;">Estimated Total</td>
                            <td style="text-align: right; font-weight: 800; color: var(--proc-primary); font-size: 15px;">${P.formatZAR(estTotal)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
    
    function renderRfqVendorsTab(rfq) {
        const invited = (rfq.invitedVendors || []).map(id => getSupplier(id)).filter(Boolean);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">
                    <span>Invited Suppliers (${invited.length})</span>
                    ${rfq.status === 'published' ? `<button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementRfq.openInviteModal('${rfq.id}')">+ Invite Supplier</button>` : ''}
                </div>
                ${invited.length === 0 ? `
                    <p style="color: var(--proc-text-muted); font-size: 13px; padding: 20px 0;">No suppliers invited yet. ${rfq.status === 'draft' ? 'Add suppliers before publishing.' : ''}</p>
                ` : invited.map(v => `
                    <div class="proc-compliance-item">
                        <div class="vendor-avatar" style="background: ${getAvatarColor(v.tradingName)}; width: 36px; height: 36px;">${getInitials(v.tradingName)}</div>
                        <div class="compliance-body">
                            <div class="compliance-title">${esc(v.tradingName)}</div>
                            <div class="compliance-meta">${esc(v.categories?.join(', ') || '—')} · ${esc(v.province || '')} · Risk: ${v.riskRating}</div>
                        </div>
                        <div>
                            <span class="proc-badge proc-badge-${v.complianceStatus === 'compliant' ? 'success' : v.complianceStatus === 'expired' ? 'danger' : 'warning'}">
                                ${v.complianceStatus === 'compliant' ? 'Compliant' : v.complianceStatus === 'expired' ? 'Expired' : 'Attention'}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function renderRfqCriteriaTab(rfq) {
        const totalWeight = (rfq.evaluationCriteria || []).reduce((s, c) => s + c.weight, 0);
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Evaluation Criteria</div>
                <p style="font-size: 13px; color: var(--proc-text-muted); margin-bottom: 16px;">
                    Weighted scoring across ${(rfq.evaluationCriteria || []).length} criteria. 
                    ${totalWeight === 100 ? '<span style="color: var(--proc-success); font-weight: 700;">✓ Weights total 100%</span>' : `<span style="color: var(--proc-danger); font-weight: 700;">⚠ Weights total ${totalWeight}% (should be 100%)</span>`}
                </p>
                ${(rfq.evaluationCriteria || []).map(c => `
                    <div style="margin-bottom: 14px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="font-weight: 600; font-size: 13px;">${esc(c.criterion)}</span>
                            <span style="font-weight: 800; color: var(--proc-primary);">${c.weight}%</span>
                        </div>
                        <div style="height: 8px; background: #F3F4F6; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${c.weight}%; height: 100%; background: linear-gradient(90deg, var(--proc-primary), var(--proc-primary-light)); border-radius: 4px;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function renderRfqClarificationsTab(rfq) {
        const clarifications = rfq.clarifications || [];
        
        return `
            <div class="proc-card">
                <div class="proc-card-title">Clarifications (${clarifications.length})</div>
                ${clarifications.length === 0 ? `
                    <p style="color: var(--proc-text-muted); font-size: 13px; padding: 20px 0;">No clarifications yet.</p>
                ` : clarifications.map(c => {
                    const vendor = getSupplier(c.vendorId);
                    return `
                        <div class="rfq-clarification">
                            <div class="rfq-clarification-q">Q: ${esc(c.question)}</div>
                            <div class="rfq-clarification-meta">
                                From ${esc(vendor?.tradingName || c.vendorId)} · ${P.formatDateTime(c.submittedAt)}
                                ${c.visibility === 'shared' ? '<span class="proc-badge proc-badge-info" style="margin-left: 8px;">Shared with all</span>' : '<span class="proc-badge proc-badge-neutral" style="margin-left: 8px;">Vendor-specific</span>'}
                            </div>
                            ${c.answer ? `
                                <div class="rfq-clarification-a">
                                    <strong>Response</strong>
                                    ${esc(c.answer)}
                                    <div style="font-size: 11px; color: var(--proc-text-muted); margin-top: 4px;">By ${esc(c.answeredBy)} · ${P.formatDateTime(c.answeredAt)}</div>
                                </div>
                            ` : `
                                <div class="rfq-clarification-a" style="color: var(--proc-warning); font-style: italic;">
                                    Awaiting response
                                </div>
                            `}
                        </div>
                    `;
                }).join('')}
                
                ${rfq.status === 'published' ? `
                    <div class="clarification-form">
                        <div class="proc-form-label">Add Buyer Response (demo)</div>
                        <textarea class="proc-form-textarea" id="clarificationAnswer" rows="3" placeholder="Type your response..."></textarea>
                        <div style="margin-top: 8px; text-align: right;">
                            <button class="proc-btn proc-btn-primary proc-btn-sm" onclick="ProcurementRfq.addClarificationAnswer('${rfq.id}')">Post Response</button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    function renderRfqActivityTab(rfq) {
        const events = [
            { time: rfq.createdAt, user: rfq.requester, action: 'RFQ created' }
        ];
        if (rfq.publishedAt) events.push({ time: rfq.publishedAt, user: rfq.owner, action: 'Published to suppliers' });
        if (rfq.closedAt) events.push({ time: rfq.closedAt, user: rfq.owner, action: 'Submissions closed' });
        if (rfq.awardedAt) events.push({ time: rfq.awardedAt, user: rfq.owner, action: `Awarded to ${rfq.awardedTo}` });
        if (rfq.cancelledAt) events.push({ time: rfq.cancelledAt, user: rfq.owner, action: `Cancelled: ${rfq.cancellationReason}` });
        
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
    // WIZARD
    // ============================================================
    
    let wizardState = { step: 1, data: null, editingId: null };
    
    function createBlankRfq() {
        return {
            id: 'RFQ-2026-' + String((getRfqs().length + 1)).padStart(4, '0'),
            title: '',
            category: 'ICT Hardware',
            department: 'Information Technology',
            requester: (window.ERP?.currentUser?.name || 'Sarah Chen'),
            owner: (window.ERP?.currentUser?.name || 'Sarah Chen'),
            status: 'draft',
            currency: 'ZAR',
            procurementMethod: 'Open Tender',
            priority: 'Medium',
            costCentre: '',
            justification: '',
            internalReference: '',
            estimatedBudget: 0,
            deliveryLocation: '',
            requiredDeliveryDate: '',
            submissionDeadline: '',
            questionsDeadline: '',
            validityPeriod: 60,
            paymentTerms: 'Net 30',
            warrantyMonths: 12,
            lineItems: [],
            evaluationCriteria: [
                { criterion: 'Price', weight: 40 },
                { criterion: 'Technical Compliance', weight: 25 },
                { criterion: 'Delivery Capability', weight: 15 },
                { criterion: 'Supplier Track Record', weight: 10 },
                { criterion: 'Warranty & Support', weight: 10 }
            ],
            invitedVendors: [],
            clarifications: [],
            createdAt: new Date().toISOString()
        };
    }
    
    function renderWizard() {
        const modal = document.getElementById('rfqWizardModal') || (() => {
            const el = document.createElement('div');
            el.id = 'rfqWizardModal';
            el.className = 'proc-modal-overlay';
            document.body.appendChild(el);
            return el;
        })();
        
        modal.innerHTML = `
            <div class="proc-modal" style="max-width: 900px;">
                <div class="proc-modal-header">
                    <h3 class="proc-modal-title">${wizardState.editingId ? 'Edit RFQ' : 'New RFQ'} — ${wizardState.data.id}</h3>
                    <button onclick="ProcurementRfq.closeWizard()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--proc-text-muted);">×</button>
                </div>
                <div class="proc-modal-body">
                    ${renderWizardProgress()}
                    ${renderWizardStep()}
                </div>
                <div class="proc-modal-footer">
                    <button class="proc-btn proc-btn-secondary" onclick="ProcurementRfq.closeWizard()">Cancel</button>
                    ${wizardState.step > 1 ? `<button class="proc-btn proc-btn-secondary" onclick="ProcurementRfq.wizardPrev()">← Previous</button>` : ''}
                    ${wizardState.step < 5 ? `<button class="proc-btn proc-btn-primary" onclick="ProcurementRfq.wizardNext()">Next →</button>` : `<button class="proc-btn proc-btn-primary" onclick="ProcurementRfq.wizardSave()">${wizardState.editingId ? 'Save Changes' : 'Create RFQ'}</button>`}
                </div>
            </div>
        `;
    }
    
    function renderWizardProgress() {
        const steps = ['Details', 'Line Items', 'Commercial', 'Suppliers', 'Review'];
        return `
            <div class="rfq-wizard-progress">
                ${steps.map((s, i) => {
                    const num = i + 1;
                    const cls = num < wizardState.step ? 'done' : num === wizardState.step ? 'active' : '';
                    return `
                        <div class="rfq-step ${cls}">
                            <div class="rfq-step-num">${num < wizardState.step ? '✓' : num}</div>
                            <span class="rfq-step-label">${s}</span>
                        </div>
                        ${i < steps.length - 1 ? '<div class="rfq-step-line"></div>' : ''}
                    `;
                }).join('')}
            </div>
        `;
    }
    
    function renderWizardStep() {
        switch (wizardState.step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            default: return '';
        }
    }
    
    function renderStep1() {
        const d = wizardState.data;
        return `
            <h4 style="font-weight: 800; margin-bottom: 16px;">General Details</h4>
            <div class="proc-form-row">
                <div class="proc-form-group">
                    <label class="proc-form-label">RFQ Title *</label>
                    <input class="proc-form-input" id="wiz_title" value="${esc(d.title)}" placeholder="e.g. Enterprise Network Equipment Supply">
                </div>
                <div class="proc-form-group">
                    <label class="proc-form-label">Category</label>
                    <select class="proc-form-select" id="wiz_category">
                        ${['ICT Hardware', 'Software Licensing', 'Logistics', 'Office Supplies', 'Renewable Energy', 'Training', 'Construction', 'Catering', 'Facilities Management', 'Professional Services'].map(c => 
                            `<option ${d.category === c ? 'selected' : ''}>${c}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="proc-form-row">
                <div class="proc-form-group">
                    <label class="proc-form-label">Department</label>
                    <select class="proc-form-select" id="wiz_department">
                        ${['Information Technology', 'Operations', 'Finance', 'Human Resources', 'Procurement', 'Facilities', 'Sales'].map(c => 
                            `<option ${d.department === c ? 'selected' : ''}>${c}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="proc-form-group">
                    <label class="proc-form-label">Procurement Method</label>
                    <select class="proc-form-select" id="wiz_method">
                        ${['Open Tender', 'Limited Tender', 'Price Comparison', 'Direct Negotiation'].map(m => 
                            `<option ${d.procurementMethod === m ? 'selected' : ''}>${m}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="proc-form-row">
                <div class="proc-form-group">
                    <label class="proc-form-label">Priority</label>
                    <select class="proc-form-select" id="wiz_priority">
                        ${['Low', 'Medium', 'High'].map(p => `<option ${d.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </div>
                <div class="proc-form-group">
                    <label class="proc-form-label">Cost Centre</label>
                    <input class="proc-form-input" id="wiz_costCentre" value="${esc(d.costCentre)}" placeholder="e.g. IT-INFRA-2026">
                </div>
            </div>
            <div class="proc-form-group">
                <label class="proc-form-label">Justification *</label>
                <textarea class="proc-form-textarea" id="wiz_justification" rows="3" placeholder="Explain why this procurement is required">${esc(d.justification)}</textarea>
            </div>
        `;
    }
    
    function renderStep2() {
        const d = wizardState.data;
        return `
            <h4 style="font-weight: 800; margin-bottom: 16px;">Line Items</h4>
            <p style="font-size: 13px; color: var(--proc-text-muted); margin-bottom: 16px;">Define what you need to procure. Each line will be quoted separately.</p>
            
            <div id="wiz_lineItems">
                ${(d.lineItems || []).map((li, i) => renderLineItemEditor(li, i)).join('')}
            </div>
            
            <button class="proc-btn proc-btn-secondary" onclick="ProcurementRfq.addLineItem()" style="margin-top: 8px;">
                + Add Line Item
            </button>
            
            ${(d.lineItems || []).length > 0 ? `
                <div style="margin-top: 16px; padding: 16px; background: var(--proc-bg); border-radius: 10px; display: flex; justify-content: space-between;">
                    <span style="font-weight: 700;">Estimated Total:</span>
                    <span style="font-weight: 800; color: var(--proc-primary); font-size: 18px;">
                        ${P.formatZAR((d.lineItems || []).reduce((s, li) => s + (li.qty * li.estUnitPrice), 0))}
                    </span>
                </div>
            ` : ''}
        `;
    }
    
    function renderLineItemEditor(li, idx) {
        return `
            <div class="rfq-line-item" data-line-idx="${idx}">
                <div class="rfq-line-number">${idx + 1}</div>
                <button class="rfq-remove-btn" onclick="ProcurementRfq.removeLineItem(${idx})">×</button>
                <div class="rfq-line-body">
                    <div class="proc-form-group" style="margin-bottom: 8px;">
                        <input class="proc-form-input" placeholder="Item description" value="${esc(li.description || '')}" oninput="ProcurementRfq.updateLine(${idx}, 'description', this.value)">
                    </div>
                    <div class="rfq-line-fields">
                        <select class="proc-form-select" onchange="ProcurementRfq.updateLine(${idx}, 'category', this.value)">
                            ${['Networking', 'Software', 'Logistics', 'Furniture', 'Renewable Energy', 'Training', 'Construction', 'Catering', 'Services'].map(c => 
                                `<option ${li.category === c ? 'selected' : ''}>${c}</option>`
                            ).join('')}
                        </select>
                        <input class="proc-form-input" type="number" placeholder="Qty" value="${li.qty || 1}" oninput="ProcurementRfq.updateLine(${idx}, 'qty', parseFloat(this.value) || 0)">
                        <input class="proc-form-input" placeholder="UOM" value="${esc(li.uom || 'units')}" oninput="ProcurementRfq.updateLine(${idx}, 'uom', this.value)">
                        <input class="proc-form-input" type="number" placeholder="Unit Price" value="${li.estUnitPrice || 0}" oninput="ProcurementRfq.updateLine(${idx}, 'estUnitPrice', parseFloat(this.value) || 0)">
                        <input class="proc-form-input" type="date" value="${li.deliveryDate || ''}" onchange="ProcurementRfq.updateLine(${idx}, 'deliveryDate', this.value)">
                    </div>
                    <div class="rfq-line-summary">
                        <span>Line ${idx + 1}</span>
                        <span class="rfq-line-total">${P.formatZAR((li.qty || 0) * (li.estUnitPrice || 0))}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderStep3() {
        const d = wizardState.data;
        return `
            <h4 style="font-weight: 800; margin-bottom: 16px;">Commercial Terms & Deadlines</h4>
            <div class="proc-form-row">
                <div class="proc-form-group">
                    <label class="proc-form-label">Submission Deadline *</label>
                    <input class="proc-form-input" type="datetime-local" id="wiz_deadline" value="${toLocalDatetime(d.submissionDeadline)}">
                </div>
                <div class="proc-form-group">
                    <label class="proc-form-label">Questions Deadline</label>
                    <input class="proc-form-input" type="datetime-local" id="wiz_questionsDeadline" value="${toLocalDatetime(d.questionsDeadline)}">
                </div>
            </div>
            <div class="proc-form-row">
                <div class="proc-form-group">
                    <label class="proc-form-label">Required Delivery Date</label>
                    <input class="proc-form-input" type="date" id="wiz_requiredDate" value="${d.requiredDeliveryDate || ''}">
                </div>
                <div class="proc-form-group">
                    <label class="proc-form-label">Delivery Location</label>
                    <input class="proc-form-input" id="wiz_deliveryLocation" value="${esc(d.deliveryLocation)}" placeholder="e.g. Sandton, Johannesburg">
                </div>
            </div>
            <div class="proc-form-row">
                <div class="proc-form-group">
                    <label class="proc-form-label">Payment Terms</label>
                    <select class="proc-form-select" id="wiz_paymentTerms">
                        ${['Net 30', 'Net 45', 'Net 60', 'Per event', 'Milestone-based'].map(t => 
                            `<option ${d.paymentTerms === t ? 'selected' : ''}>${t}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="proc-form-group">
                    <label class="proc-form-label">Quotation Validity (days)</label>
                    <input class="proc-form-input" type="number" id="wiz_validity" value="${d.validityPeriod || 60}">
                </div>
                <div class="proc-form-group">
                    <label class="proc-form-label">Warranty (months)</label>
                    <input class="proc-form-input" type="number" id="wiz_warranty" value="${d.warrantyMonths || 12}">
                </div>
            </div>
        `;
    }
    
    function renderStep4() {
        const d = wizardState.data;
        const suppliers = getSuppliers();
        
        return `
            <h4 style="font-weight: 800; margin-bottom: 16px;">Invite Suppliers</h4>
            <p style="font-size: 13px; color: var(--proc-text-muted); margin-bottom: 16px;">
                Only qualified, compliant suppliers are eligible. Suspended vendors are excluded.
            </p>
            <div class="rfq-supplier-list">
                ${suppliers.map(s => {
                    const eligibility = getEligibility(s);
                    const isSelected = (d.invitedVendors || []).includes(s.id);
                    return `
                        <label class="rfq-supplier-option ${isSelected ? 'selected' : ''} ${!eligibility.eligible ? 'ineligible' : ''}">
                            <input type="checkbox" ${isSelected ? 'checked' : ''} ${!eligibility.eligible ? 'disabled' : ''} 
                                onchange="ProcurementRfq.toggleVendor('${s.id}', this.checked)" style="display: none;">
                            <div class="rfq-supplier-check">${isSelected ? '✓' : ''}</div>
                            <div class="vendor-avatar" style="background: ${getAvatarColor(s.tradingName)}; width: 32px; height: 32px; font-size: 11px;">${getInitials(s.tradingName)}</div>
                            <div class="rfq-supplier-info">
                                <div class="rfq-supplier-name">${esc(s.tradingName)}</div>
                                <div class="rfq-supplier-meta">${esc(s.categories?.join(', ') || '—')} · ${esc(s.province || '')}</div>
                                ${!eligibility.eligible ? `<div class="rfq-ineligible-reason">⚠ ${esc(eligibility.reason)}</div>` : ''}
                            </div>
                            ${eligibility.eligible && s.complianceStatus === 'compliant' ? '<span class="proc-badge proc-badge-success">✓</span>' : ''}
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    function renderStep5() {
        const d = wizardState.data;
        const estTotal = (d.lineItems || []).reduce((s, li) => s + (li.qty * li.estUnitPrice), 0);
        const totalWeight = (d.evaluationCriteria || []).reduce((s, c) => s + c.weight, 0);
        
        return `
            <h4 style="font-weight: 800; margin-bottom: 16px;">Review & ${wizardState.editingId ? 'Save' : 'Create'}</h4>
            <div class="proc-grid-2">
                <div class="proc-card">
                    <div class="proc-card-title">General</div>
                    <div class="proc-field"><span class="proc-field-label">Title</span><span class="proc-field-value">${esc(d.title || '—')}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Category</span><span class="proc-field-value">${esc(d.category)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Department</span><span class="proc-field-value">${esc(d.department)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Method</span><span class="proc-field-value">${esc(d.procurementMethod)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Priority</span><span class="proc-field-value">${esc(d.priority)}</span></div>
                </div>
                <div class="proc-card">
                    <div class="proc-card-title">Summary</div>
                    <div class="proc-field"><span class="proc-field-label">Line Items</span><span class="proc-field-value">${(d.lineItems || []).length}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Estimated Value</span><span class="proc-field-value" style="color: var(--proc-primary); font-weight: 800;">${P.formatZAR(estTotal)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Invited Suppliers</span><span class="proc-field-value">${(d.invitedVendors || []).length}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Deadline</span><span class="proc-field-value">${P.formatDateTime(d.submissionDeadline)}</span></div>
                    <div class="proc-field"><span class="proc-field-label">Weights</span><span class="proc-field-value">${totalWeight}% ${totalWeight === 100 ? '✓' : '⚠'}</span></div>
                </div>
            </div>
            
            ${totalWeight !== 100 ? `<div style="margin-top: 16px; padding: 12px; background: var(--proc-warning-bg); border-radius: 8px; font-size: 13px; color: #92400E;">
                ⚠ Evaluation weights total ${totalWeight}%, should be 100%. You can fix this after creation.
            </div>` : ''}
            
            <div style="margin-top: 16px; padding: 12px; background: var(--proc-info-bg); border-radius: 8px; font-size: 13px; color: #1E40AF;">
                ℹ This RFQ will be created in <strong>Draft</strong> status. You can review and submit for approval before publishing.
            </div>
        `;
    }
    
    // ============================================================
    // PUBLIC API
    // ============================================================
    
    window.ProcurementRfq = {
        setFilter(key, value) {
            rfqFilters[key] = value;
            document.getElementById('contentArea').innerHTML = renderRfqDashboard();
        },
        
        openRfq(id) {
            activeRfqTab = 'overview';
            document.body.dataset.currentRfqId = id;
            document.getElementById('contentArea').innerHTML = renderRfqDetail(id);
            document.getElementById('contentArea').scrollTop = 0;
        },
        
        backToRegister() {
            document.body.dataset.currentRfqId = '';
            document.getElementById('contentArea').innerHTML = renderRfqDashboard();
        },
        
        switchTab(tab) {
            activeRfqTab = tab;
            const id = document.body.dataset.currentRfqId;
            if (id) document.getElementById('contentArea').innerHTML = renderRfqDetail(id);
        },
        
        openWizard(id) {
            wizardState = { step: 1, data: id ? JSON.parse(JSON.stringify(getRfqs().find(r => r.id === id))) : createBlankRfq(), editingId: id || null };
            renderWizard();
        },
        
        closeWizard() {
            document.getElementById('rfqWizardModal')?.remove();
        },
        
        wizardNext() {
            if (!this.validateStep(wizardState.step)) return;
            this.captureStep();
            wizardState.step = Math.min(5, wizardState.step + 1);
            renderWizard();
        },
        
        wizardPrev() {
            this.captureStep();
            wizardState.step = Math.max(1, wizardState.step - 1);
            renderWizard();
        },
        
        captureStep() {
            const d = wizardState.data;
            if (wizardState.step === 1) {
                d.title = document.getElementById('wiz_title')?.value || '';
                d.category = document.getElementById('wiz_category')?.value || '';
                d.department = document.getElementById('wiz_department')?.value || '';
                d.procurementMethod = document.getElementById('wiz_method')?.value || '';
                d.priority = document.getElementById('wiz_priority')?.value || '';
                d.costCentre = document.getElementById('wiz_costCentre')?.value || '';
                d.justification = document.getElementById('wiz_justification')?.value || '';
            } else if (wizardState.step === 3) {
                d.submissionDeadline = document.getElementById('wiz_deadline')?.value ? new Date(document.getElementById('wiz_deadline').value).toISOString() : '';
                d.questionsDeadline = document.getElementById('wiz_questionsDeadline')?.value ? new Date(document.getElementById('wiz_questionsDeadline').value).toISOString() : '';
                d.requiredDeliveryDate = document.getElementById('wiz_requiredDate')?.value || '';
                d.deliveryLocation = document.getElementById('wiz_deliveryLocation')?.value || '';
                d.paymentTerms = document.getElementById('wiz_paymentTerms')?.value || 'Net 30';
                d.validityPeriod = parseInt(document.getElementById('wiz_validity')?.value) || 60;
                d.warrantyMonths = parseInt(document.getElementById('wiz_warranty')?.value) || 12;
            }
        },
        
        validateStep(step) {
            if (step === 1) {
                const title = document.getElementById('wiz_title')?.value?.trim();
                const justification = document.getElementById('wiz_justification')?.value?.trim();
                if (!title) { alert('Title is required'); return false; }
                if (!justification) { alert('Justification is required'); return false; }
            }
            if (step === 2) {
                if (!wizardState.data.lineItems || wizardState.data.lineItems.length === 0) {
                    alert('At least one line item is required');
                    return false;
                }
            }
            if (step === 3) {
                const deadline = document.getElementById('wiz_deadline')?.value;
                if (!deadline) { alert('Submission deadline is required'); return false; }
            }
            return true;
        },
        
        wizardSave() {
            this.captureStep();
            const d = wizardState.data;
            
            if (!P.data.rfqs) P.data.rfqs = [];
            
            if (wizardState.editingId) {
                const idx = P.data.rfqs.findIndex(r => r.id === wizardState.editingId);
                if (idx >= 0) P.data.rfqs[idx] = d;
            } else {
                P.data.rfqs.unshift(d);
            }
            P.save();
            this.closeWizard();
            document.getElementById('contentArea').innerHTML = renderRfqDashboard();
            if (window.App) window.App.toast(wizardState.editingId ? 'RFQ updated' : 'RFQ created', 'success');
        },
        
        addLineItem() {
            if (!wizardState.data.lineItems) wizardState.data.lineItems = [];
            wizardState.data.lineItems.push({
                line: wizardState.data.lineItems.length + 1,
                description: '',
                category: 'Networking',
                qty: 1,
                uom: 'units',
                estUnitPrice: 0,
                deliveryDate: ''
            });
            document.querySelector('.proc-modal-body').innerHTML = renderWizardProgress() + renderWizardStep();
        },
        
        removeLineItem(idx) {
            wizardState.data.lineItems.splice(idx, 1);
            wizardState.data.lineItems.forEach((li, i) => li.line = i + 1);
            document.querySelector('.proc-modal-body').innerHTML = renderWizardProgress() + renderWizardStep();
        },
        
        updateLine(idx, field, value) {
            if (wizardState.data.lineItems[idx]) {
                wizardState.data.lineItems[idx][field] = value;
            }
        },
        
        toggleVendor(vendorId, checked) {
            if (!wizardState.data.invitedVendors) wizardState.data.invitedVendors = [];
            if (checked) {
                if (!wizardState.data.invitedVendors.includes(vendorId)) wizardState.data.invitedVendors.push(vendorId);
            } else {
                wizardState.data.invitedVendors = wizardState.data.invitedVendors.filter(v => v !== vendorId);
            }
            document.querySelector('.proc-modal-body').innerHTML = renderWizardProgress() + renderWizardStep();
        },
        
        submitForApproval(id) {
            const rfq = getRfqs().find(r => r.id === id);
            if (!rfq) return;
            rfq.status = 'pending_approval';
            P.save();
            document.getElementById('contentArea').innerHTML = renderRfqDetail(id);
            if (window.App) window.App.toast('Submitted for approval', 'success');
        },
        
        publish(id) {
            const rfq = getRfqs().find(r => r.id === id);
            if (!rfq) return;
            if ((rfq.invitedVendors || []).length === 0) {
                alert('Cannot publish without invited suppliers');
                return;
            }
            rfq.status = 'published';
            rfq.publishedAt = new Date().toISOString();
            P.save();
            document.getElementById('contentArea').innerHTML = renderRfqDetail(id);
            if (window.App) window.App.toast('RFQ published', 'success');
        },
        
        closeRfq(id) {
            if (!confirm('Close submissions? Suppliers will no longer be able to submit quotations.')) return;
            const rfq = getRfqs().find(r => r.id === id);
            if (!rfq) return;
            rfq.status = 'closed';
            rfq.closedAt = new Date().toISOString();
            P.save();
            document.getElementById('contentArea').innerHTML = renderRfqDetail(id);
            if (window.App) window.App.toast('Submissions closed', 'success');
        },
        
        startEvaluation(id) {
            const rfq = getRfqs().find(r => r.id === id);
            if (!rfq) return;
            rfq.status = 'under_evaluation';
            P.save();
            document.getElementById('contentArea').innerHTML = renderRfqDetail(id);
            if (window.App) window.App.toast('Evaluation started (Phase 4)', 'info');
        },
        
        addClarificationAnswer(id) {
            const rfq = getRfqs().find(r => r.id === id);
            if (!rfq) return;
            const answer = document.getElementById('clarificationAnswer')?.value?.trim();
            if (!answer) { alert('Please enter a response'); return; }
            
            const pending = (rfq.clarifications || []).find(c => !c.answer);
            if (!pending) { alert('No pending clarifications'); return; }
            
            pending.answer = answer;
            pending.answeredAt = new Date().toISOString();
            pending.answeredBy = (window.ERP?.currentUser?.name || 'Sarah Chen');
            pending.status = 'answered';
            P.save();
            document.getElementById('contentArea').innerHTML = renderRfqDetail(id);
            if (window.App) window.App.toast('Response posted', 'success');
        },
        
        openInviteModal(rfqId) {
            const rfq = getRfqs().find(r => r.id === rfqId);
            if (!rfq) return;
            
            const suppliers = getSuppliers().filter(s => !(rfq.invitedVendors || []).includes(s.id));
            const eligible = suppliers.filter(s => getEligibility(s).eligible);
            
            if (eligible.length === 0) {
                alert('No additional eligible suppliers available');
                return;
            }
            
            const modal = document.createElement('div');
            modal.className = 'proc-modal-overlay';
            modal.innerHTML = `
                <div class="proc-modal">
                    <div class="proc-modal-header">
                        <h3 class="proc-modal-title">Invite Supplier</h3>
                        <button onclick="this.closest('.proc-modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                    </div>
                    <div class="proc-modal-body">
                        <div class="rfq-supplier-list">
                            ${eligible.map(s => `
                                <div class="rfq-supplier-option" onclick="ProcurementRfq.addInvitedVendor('${rfqId}', '${s.id}'); this.closest('.proc-modal-overlay').remove();">
                                    <div class="vendor-avatar" style="background: ${getAvatarColor(s.tradingName)}; width: 32px; height: 32px; font-size: 11px;">${getInitials(s.tradingName)}</div>
                                    <div class="rfq-supplier-info">
                                        <div class="rfq-supplier-name">${esc(s.tradingName)}</div>
                                        <div class="rfq-supplier-meta">${esc(s.categories?.join(', ') || '')}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        },
        
        addInvitedVendor(rfqId, vendorId) {
            const rfq = getRfqs().find(r => r.id === rfqId);
            if (!rfq) return;
            if (!rfq.invitedVendors) rfq.invitedVendors = [];
            if (!rfq.invitedVendors.includes(vendorId)) rfq.invitedVendors.push(vendorId);
            P.save();
            document.getElementById('contentArea').innerHTML = renderRfqDetail(rfqId);
            if (window.App) window.App.toast('Supplier invited', 'success');
        },
        
        exportCSV() {
            const rfqs = getFilteredRfqs();
            const headers = ['RFQ #', 'Title', 'Category', 'Department', 'Owner', 'Status', 'Deadline', 'Invited'];
            const rows = rfqs.map(r => [
                r.id, r.title, r.category, r.department, r.owner, r.status,
                P.formatDate(r.submissionDeadline), (r.invitedVendors || []).length
            ]);
            const csv = [headers, ...rows].map(row => row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rfqs-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    
    // ============================================================
    // HELPERS
    // ============================================================
    
    function getEligibility(supplier) {
        if (supplier.operationalStatus === 'suspended') return { eligible: false, reason: 'Vendor suspended' };
        if (supplier.onboardingStatus !== 'qualified') return { eligible: false, reason: 'Not qualified' };
        if (supplier.complianceStatus === 'expired') return { eligible: false, reason: 'Compliance expired' };
        return { eligible: true };
    }
    
    function getRfqStatusBadge(status) {
        const map = {
            draft: { class: 'neutral', label: 'Draft' },
            pending_approval: { class: 'warning', label: 'Pending Approval' },
            published: { class: 'success', label: 'Published' },
            closed: { class: 'info', label: 'Closed' },
            under_evaluation: { class: 'warning', label: 'Evaluation' },
            awarded: { class: 'success', label: 'Awarded' },
            cancelled: { class: 'danger', label: 'Cancelled' }
        };
        const m = map[status] || map.draft;
        return `<span class="proc-badge proc-badge-${m.class}">${m.label}</span>`;
    }
    
    function getCountdown(deadline, status) {
        if (status === 'closed' || status === 'awarded' || status === 'cancelled') {
            return `<span class="rfq-countdown closed">Closed</span>`;
        }
        if (!deadline) return '<span style="color: var(--proc-text-muted); font-size: 11px;">No deadline</span>';
        
        const diff = new Date(deadline) - new Date();
        if (diff < 0) return `<span class="rfq-countdown closed">Expired</span>`;
        
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        
        if (days < 3) return `<span class="rfq-countdown urgent">${days}d ${hours}h left</span>`;
        return `<span class="rfq-countdown">${days}d left</span>`;
    }
    
    function toLocalDatetime(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60000);
        return local.toISOString().slice(0, 16);
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
    
})();