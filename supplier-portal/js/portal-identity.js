// ============================================================
// PORTAL IDENTITY - Session helpers
// Kept separate for clarity: session, permissions, preferences
// ============================================================

Portal.Identity = {
    // Who am I?
    me: function() {
        return Portal.currentSupplier;
    },
    
    // Is this supplier eligible to quote?
    canQuote: function() {
        const s = Portal.currentSupplier;
        if (!s) return false;
        return s.onboardingStatus === 'qualified' && 
               s.operationalStatus === 'active' && 
               s.complianceStatus !== 'expired';
    },
    
    // Why can't this supplier quote? (for UI)
    getQuoteBlockers: function() {
        const s = Portal.currentSupplier;
        if (!s) return ['Not signed in'];
        
        const blockers = [];
        if (s.onboardingStatus !== 'qualified') blockers.push('Company onboarding not complete');
        if (s.operationalStatus !== 'active') blockers.push('Account not active');
        if (s.complianceStatus === 'expired') blockers.push('Compliance documents expired');
        return blockers;
    },
    
    // Does this supplier have any documents expiring?
    getExpiringDocuments: function() {
        if (!s) return [];
        const s = Portal.currentSupplier;
        const records = Procurement.getCompliance(s.id);
        const now = Date.now();
        return records.filter(r => {
            if (!r.expiryDate) return false;
            const days = Math.floor((new Date(r.expiryDate) - now) / 86400000);
            return days >= 0 && days < 60;
        });
    },
    
    // Company profile completeness (0-100)
    getProfileCompleteness: function() {
        const s = Portal.currentSupplier;
        if (!s) return 0;
        
        const required = [
            'legalName', 'tradingName', 'registrationNumber', 'taxRef',
            'province', 'businessAddress', 'primaryContact'
        ];
        
        let complete = 0;
        required.forEach(field => {
            if (field === 'primaryContact') {
                if (s.primaryContact?.email && s.primaryContact?.name) complete++;
            } else if (s[field]) {
                complete++;
            }
        });
        
        return Math.round((complete / required.length) * 100);
    }
};