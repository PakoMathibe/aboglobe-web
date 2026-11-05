// ============================================================
// PROCUREMENT STORE & SERVICES
// Shared data layer for all procurement modules
// ============================================================

window.Procurement = {
    version: '1.0.0',
    storageKey: 'abo_procurement_state_v1',
    data: null,
    initialized: false
};

// ============================================================
// STORAGE - Save / Load / Reset
// ============================================================

Procurement.save = function() {
    try {
        localStorage.setItem(this.storageKey, JSON.stringify({
            version: this.version,
            savedAt: new Date().toISOString(),
            data: this.data
        }));
        return true;
    } catch (e) {
        console.error('[Procurement] Save failed:', e);
        return false;
    }
};

Procurement.load = function() {
    try {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return false;
        
        const parsed = JSON.parse(raw);
        if (!parsed.data || parsed.version !== this.version) {
            console.warn('[Procurement] Incompatible state version, resetting');
            return false;
        }
        this.data = parsed.data;
        return true;
    } catch (e) {
        console.error('[Procurement] Load failed:', e);
        return false;
    }
};

Procurement.reset = function() {
    this.data = JSON.parse(JSON.stringify(window.ProcurementData));
    this.save();
    return true;
};

Procurement.init = function() {
    if (this.initialized) return;
    
    if (!this.load()) {
        this.data = JSON.parse(JSON.stringify(window.ProcurementData));
        this.save();
    }
    this.initialized = true;
    console.log('[Procurement] Initialized with', this.data.suppliers.length, 'suppliers');
};

// ============================================================
// DATASTORE - CRUD operations
// ============================================================

Procurement.getSuppliers = function() {
    return this.data.suppliers || [];
};

Procurement.getSupplier = function(id) {
    return this.data.suppliers.find(s => s.id === id);
};

Procurement.getCompliance = function(vendorId) {
    return (this.data.complianceRecords || []).filter(c => c.vendorId === vendorId);
};

Procurement.getRisks = function(vendorId) {
    return (this.data.risks || []).filter(r => r.vendorId === vendorId);
};

Procurement.getPerformance = function(vendorId) {
    return (this.data.performanceReviews || []).filter(p => p.vendorId === vendorId);
};

Procurement.getContracts = function(vendorId) {
    return (this.data.contracts || []).filter(c => c.vendorId === vendorId);
};

Procurement.getAuditLog = function(entityType, entityId) {
    return (this.data.auditLog || []).filter(a => {
        if (entityType && a.entityType !== entityType) return false;
        if (entityId && a.entityId !== entityId) return false;
        return true;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

Procurement.getNotifications = function() {
    return (this.data.notifications || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

Procurement.getUnreadNotificationCount = function() {
    return (this.data.notifications || []).filter(n => !n.read).length;
};

Procurement.createSupplier = function(supplierData) {
    const id = this.generateId('VEN');
    const supplier = {
        id,
        ...supplierData,
        onboardingStatus: supplierData.onboardingStatus || 'draft',
        operationalStatus: supplierData.operationalStatus || 'pending',
        qualificationStatus: supplierData.qualificationStatus || 'unqualified',
        complianceStatus: 'missing',
        riskRating: 'medium',
        performanceScore: null,
        spendToDate: 0,
        createdAt: new Date().toISOString()
    };
    
    this.data.suppliers.push(supplier);
    this.logAudit('vendor', id, 'Vendor created', 'New vendor record created', null, { tradingName: supplier.tradingName });
    this.save();
    return supplier;
};

Procurement.updateSupplier = function(id, updates) {
    const idx = this.data.suppliers.findIndex(s => s.id === id);
    if (idx < 0) return null;
    
    const before = { ...this.data.suppliers[idx] };
    this.data.suppliers[idx] = { ...this.data.suppliers[idx], ...updates, updatedAt: new Date().toISOString() };
    
    this.logAudit('vendor', id, 'Vendor updated', this.summarizeChanges(before, updates), before, this.data.suppliers[idx]);
    this.save();
    return this.data.suppliers[idx];
};

Procurement.deleteSupplier = function(id) {
    const idx = this.data.suppliers.findIndex(s => s.id === id);
    if (idx < 0) return false;
    
    const supplier = this.data.suppliers[idx];
    this.data.suppliers.splice(idx, 1);
    this.logAudit('vendor', id, 'Vendor deleted', `Deleted ${supplier.tradingName}`, supplier, null);
    this.save();
    return true;
};

Procurement.addComplianceRecord = function(vendorId, recordData) {
    const id = this.generateId('CMP');
    const record = {
        id,
        vendorId,
        reviewStatus: 'submitted',
        verificationStatus: 'not_externally_verified',
        ...recordData
    };
    this.data.complianceRecords.push(record);
    this.recalculateComplianceStatus(vendorId);
    this.logAudit('compliance', id, 'Compliance record added', `${record.documentType} for ${vendorId}`, null, record);
    this.save();
    return record;
};

Procurement.updateComplianceRecord = function(id, updates) {
    const idx = this.data.complianceRecords.findIndex(c => c.id === id);
    if (idx < 0) return null;
    
    const before = { ...this.data.complianceRecords[idx] };
    this.data.complianceRecords[idx] = { ...this.data.complianceRecords[idx], ...updates };
    this.recalculateComplianceStatus(before.vendorId);
    this.logAudit('compliance', id, 'Compliance record updated', this.summarizeChanges(before, updates), before, this.data.complianceRecords[idx]);
    this.save();
    return this.data.complianceRecords[idx];
};

Procurement.markNotificationRead = function(id) {
    const n = (this.data.notifications || []).find(n => n.id === id);
    if (n) {
        n.read = true;
        this.save();
    }
};

// ============================================================
// WORKFLOW - Onboarding state transitions
// ============================================================

Procurement.ONBOARDING_STATES = {
    draft: { label: 'Draft', next: ['submitted'], color: 'neutral' },
    submitted: { label: 'Submitted', next: ['under_review', 'rejected'], color: 'info' },
    under_review: { label: 'Under Review', next: ['qualified', 'rejected', 'info_required'], color: 'warning' },
    info_required: { label: 'Information Required', next: ['under_review'], color: 'warning' },
    qualified: { label: 'Qualified', next: ['suspended'], color: 'success' },
    rejected: { label: 'Rejected', next: ['draft'], color: 'danger' },
    suspended: { label: 'Suspended', next: ['qualified'], color: 'danger' }
};

Procurement.transitionOnboarding = function(vendorId, newStatus, reason) {
    const supplier = this.getSupplier(vendorId);
    if (!supplier) return { error: 'Vendor not found' };
    
    const currentState = this.ONBOARDING_STATES[supplier.onboardingStatus];
    if (!currentState) return { error: 'Invalid current state' };
    
    if (!currentState.next.includes(newStatus)) {
        return { error: `Cannot transition from ${supplier.onboardingStatus} to ${newStatus}. Allowed: ${currentState.next.join(', ')}` };
    }
    
    // Blockers for qualification
    if (newStatus === 'qualified') {
        const blockers = this.getQualificationBlockers(vendorId);
        if (blockers.length > 0) {
            return { error: 'Qualification blocked', blockers };
        }
    }
    
    const before = supplier.onboardingStatus;
    supplier.onboardingStatus = newStatus;
    supplier.operationalStatus = newStatus === 'qualified' ? 'active' : (newStatus === 'rejected' ? 'inactive' : 'pending');
    supplier.qualificationStatus = newStatus === 'qualified' ? 'qualified' : (newStatus === 'rejected' ? 'rejected' : 'pending');
    supplier.updatedAt = new Date().toISOString();
    
    this.recalculateComplianceStatus(vendorId);
    this.logAudit('vendor', vendorId, 'Onboarding status changed', `${before} → ${newStatus}${reason ? ': ' + reason : ''}`, { status: before }, { status: newStatus });
    this.save();
    
    return { success: true, supplier };
};

Procurement.getQualificationBlockers = function(vendorId) {
    const supplier = this.getSupplier(vendorId);
    if (!supplier) return ['Vendor not found'];
    
    const blockers = [];
    const compliance = this.getCompliance(vendorId);
    
    // Check required documents
    const primaryCategory = supplier.categories[0] || 'default';
    const required = this.data.config.requiredDocuments[primaryCategory] || this.data.config.requiredDocuments.default;
    
    required.forEach(docType => {
        const record = compliance.find(c => c.documentType === docType);
        if (!record || record.reviewStatus === 'missing') {
            blockers.push(`Missing document: ${docType}`);
        } else if (record.reviewStatus === 'expired') {
            blockers.push(`Expired document: ${docType}`);
        } else if (record.reviewStatus === 'rejected') {
            blockers.push(`Rejected document: ${docType}`);
        } else if (record.reviewStatus === 'submitted' || record.reviewStatus === 'under_review') {
            blockers.push(`Unreviewed document: ${docType}`);
        }
    });
    
    // Check profile completeness
    if (!supplier.registrationNumber) blockers.push('Registration number missing');
    if (!supplier.primaryContact?.email) blockers.push('Primary contact email missing');
    if (!supplier.categories || supplier.categories.length === 0) blockers.push('No categories assigned');
    
    return blockers;
};

Procurement.getReadiness = function(vendorId) {
    const blockers = this.getQualificationBlockers(vendorId);
    const supplier = this.getSupplier(vendorId);
    const compliance = this.getCompliance(vendorId);
    const reviewed = compliance.filter(c => c.reviewStatus === 'approved').length;
    const total = compliance.length;
    
    return {
        ready: blockers.length === 0,
        blockers,
        complianceProgress: total > 0 ? Math.round((reviewed / total) * 100) : 0,
        reviewed,
        total
    };
};

// ============================================================
// COMPLIANCE CALCULATIONS
// ============================================================

Procurement.recalculateComplianceStatus = function(vendorId) {
    const supplier = this.getSupplier(vendorId);
    if (!supplier) return;
    
    const compliance = this.getCompliance(vendorId);
    const now = new Date();
    const warnDate = new Date(now.getTime() + this.data.config.complianceWarningDays * 24 * 60 * 60 * 1000);
    
    let hasMissing = false;
    let hasExpired = false;
    let hasExpiring = false;
    let hasRejected = false;
    
    compliance.forEach(c => {
        if (c.reviewStatus === 'missing') hasMissing = true;
        else if (c.reviewStatus === 'expired') hasExpired = true;
        else if (c.reviewStatus === 'rejected') hasRejected = true;
        else if (c.expiryDate) {
            const exp = new Date(c.expiryDate);
            if (exp < now) { c.reviewStatus = 'expired'; hasExpired = true; }
            else if (exp < warnDate) { hasExpiring = true; }
        }
    });
    
    if (hasExpired || hasRejected) supplier.complianceStatus = 'expired';
    else if (hasMissing || hasExpiring) supplier.complianceStatus = 'attention_required';
    else supplier.complianceStatus = 'compliant';
};

Procurement.getComplianceItemState = function(record) {
    if (!record) return { state: 'missing', label: 'Missing', daysLeft: null };
    
    if (record.reviewStatus === 'missing') return { state: 'missing', label: 'Missing', daysLeft: null };
    if (record.reviewStatus === 'expired') return { state: 'expired', label: 'Expired', daysLeft: 0 };
    if (record.reviewStatus === 'rejected') return { state: 'rejected', label: 'Rejected', daysLeft: null };
    if (record.reviewStatus === 'submitted' || record.reviewStatus === 'under_review') return { state: 'pending', label: 'Under Review', daysLeft: null };
    
    if (record.expiryDate) {
        const days = Math.floor((new Date(record.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (days < 0) return { state: 'expired', label: 'Expired', daysLeft: days };
        if (days < 30) return { state: 'expiring', label: `Expiring in ${days}d`, daysLeft: days };
        if (days < 90) return { state: 'expiring_soon', label: `Expires in ${days}d`, daysLeft: days };
        return { state: 'valid', label: 'Valid', daysLeft: days };
    }
    
    return { state: 'valid', label: 'Approved', daysLeft: null };
};

// ============================================================
// PERFORMANCE CALCULATIONS
// ============================================================

Procurement.calculatePerformanceScore = function(vendorId) {
    const reviews = this.getPerformance(vendorId);
    if (reviews.length === 0) return { score: null, reviews: 0, insufficient: true };
    
    const weights = this.data.config.performanceWeights;
    const latest = reviews[reviews.length - 1];
    
    const score = Math.round(
        (latest.onTimeDelivery * weights.onTimeDelivery / 100) +
        (latest.qualityAcceptance * weights.qualityAcceptance / 100) +
        (latest.priceCompetitiveness * weights.priceCompetitiveness / 100) +
        (latest.responsiveness * weights.responsiveness / 100) +
        (latest.documentation * weights.documentation / 100)
    );
    
    return { score, reviews: reviews.length, latest, insufficient: false };
};

// ============================================================
// RISK CALCULATIONS
// ============================================================

Procurement.calculateRiskSeverity = function(score) {
    if (score >= 20) return { level: 'critical', label: 'Critical', color: 'danger' };
    if (score >= 12) return { level: 'high', label: 'High', color: 'danger' };
    if (score >= 6) return { level: 'medium', label: 'Medium', color: 'warning' };
    return { level: 'low', label: 'Low', color: 'success' };
};

Procurement.getVendorRiskSummary = function(vendorId) {
    const risks = this.getRisks(vendorId);
    if (risks.length === 0) return { total: 0, highest: null, level: 'low' };
    
    const sorted = [...risks].sort((a, b) => b.score - a.score);
    const highest = sorted[0];
    return {
        total: risks.length,
        highest,
        level: this.calculateRiskSeverity(highest.score).level,
        openRisks: risks.filter(r => r.status === 'open').length
    };
};

// ============================================================
// DUPLICATE DETECTION
// ============================================================

Procurement.detectDuplicates = function(vendorId) {
    const supplier = this.getSupplier(vendorId);
    if (!supplier) return [];
    
    const duplicates = [];
    const all = this.getSuppliers();
    
    all.forEach(other => {
        if (other.id === vendorId) return;
        
        const matches = [];
        if (supplier.registrationNumber && other.registrationNumber && 
            supplier.registrationNumber === other.registrationNumber) {
            matches.push('Same registration number');
        }
        if (supplier.vatNumber && other.vatNumber && supplier.vatNumber === other.vatNumber) {
            matches.push('Same VAT number');
        }
        if (supplier.primaryContact?.email && other.primaryContact?.email) {
            const domain1 = supplier.primaryContact.email.split('@')[1];
            const domain2 = other.primaryContact.email.split('@')[1];
            if (domain1 && domain1 === domain2 && domain1 !== 'example.com') {
                matches.push('Same email domain');
            }
        }
        if (supplier.tradingName && other.tradingName) {
            const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalize(supplier.tradingName) === normalize(other.tradingName)) {
                matches.push('Similar trading name');
            }
        }
        
        if (matches.length > 0) {
            duplicates.push({ vendor: other, reasons: matches });
        }
    });
    
    return duplicates;
};

// ============================================================
// AUDIT LOGGING
// ============================================================

Procurement.logAudit = function(entityType, entityId, action, summary, before, after) {
    if (!this.data.auditLog) this.data.auditLog = [];
    
    const entry = {
        id: this.generateId('ACT'),
        timestamp: new Date().toISOString(),
        user: (window.ERP && window.ERP.currentUser) ? window.ERP.currentUser.name : 'Demo User',
        action,
        entityType,
        entityId,
        summary,
        before,
        after
    };
    
    this.data.auditLog.unshift(entry);
    if (this.data.auditLog.length > 500) this.data.auditLog.length = 500;
    return entry;
};

// ============================================================
// UTILITIES
// ============================================================

Procurement.generateId = function(prefix) {
    const existing = this.getAllIds(prefix);
    let counter = 1;
    while (existing.has(`${prefix}-${String(counter).padStart(4, '0')}`)) {
        counter++;
    }
    return `${prefix}-${String(counter).padStart(4, '0')}`;
};

Procurement.getAllIds = function(prefix) {
    const set = new Set();
    const collections = ['suppliers', 'complianceRecords', 'risks', 'performanceReviews', 'contracts', 'auditLog', 'notifications'];
    collections.forEach(col => {
        (this.data[col] || []).forEach(item => {
            if (item.id && item.id.startsWith(prefix + '-')) set.add(item.id);
        });
    });
    return set;
};

Procurement.summarizeChanges = function(before, after) {
    const changes = [];
    Object.keys(after).forEach(key => {
        if (before[key] !== after[key] && key !== 'updatedAt') {
            changes.push(`${key}: ${JSON.stringify(before[key])} → ${JSON.stringify(after[key])}`);
        }
    });
    return changes.length > 0 ? changes.join('; ') : 'No visible changes';
};

Procurement.formatZAR = function(amount) {
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(amount);
};

Procurement.formatDate = function(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
};

Procurement.formatDateTime = function(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

Procurement.timeAgo = function(iso) {
    if (!iso) return '—';
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return Procurement.formatDate(iso);
};

Procurement.escapeHtml = function(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
};

// Auto-initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Procurement.init());
} else {
    Procurement.init();
}