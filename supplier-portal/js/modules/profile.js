// ============================================================
// PORTAL MODULE: Company Profile + Compliance
// ============================================================

Portal.VIEWS.profile = function() {
    const s = Portal.currentSupplier;
    if (!s) return '<p>Not signed in</p>';
    
    const compliance = Procurement.getCompliance(s.id);
    const profilePct = Portal.Identity.getProfileCompleteness();
    const canQuote = Portal.Identity.canQuote();
    const blockers = Portal.Identity.getQuoteBlockers();
    
    return `
        <div class="space-y-6">
            ${!canQuote ? `
                <div class="p-alert p-alert-warning">
                    <div class="p-alert-icon">⚠</div>
                    <div>
                        <div style="font-weight: 700; margin-bottom: 4px;">You cannot submit quotations yet</div>
                        <ul style="margin: 0; padding-left: 18px; font-size: 12px;">
                            ${blockers.map(b => `<li>${Portal.esc(b)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            ` : `
                <div class="p-alert p-alert-success">
                    <div class="p-alert-icon">✓</div>
                    <div>
                        <div style="font-weight: 700;">Eligible to Quote</div>
                        <div style="font-size: 12px;">Your company is qualified, active, and compliant.</div>
                    </div>
                </div>
            `}
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left: avatar + completeness -->
                <div class="lg:col-span-1">
                    <div class="portal-card" style="text-align: center; padding: 28px;">
                        <div style="width: 88px; height: 88px; border-radius: 20px; margin: 0 auto 16px; background: ${Portal.avatarColor(s.tradingName)}; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 800;">
                            ${s.tradingName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <h3 style="font-size: 18px; font-weight: 700; color: var(--p-navy); margin-bottom: 4px;">${Portal.esc(s.tradingName)}</h3>
                        <p style="font-size: 13px; color: var(--p-muted); margin-bottom: 16px;">${Portal.esc(s.legalName)}</p>
                        
                        <div style="padding: 14px; background: var(--p-surface); border-radius: 10px; margin-bottom: 16px;">
                            <div style="font-size: 11px; font-weight: 700; color: var(--p-muted); text-transform: uppercase; margin-bottom: 8px;">Profile Completeness</div>
                            <div style="font-size: 28px; font-weight: 800; color: var(--p-accent); margin-bottom: 8px;">${profilePct}%</div>
                            <div class="p-progress">
                                <div class="p-progress-fill ${profilePct === 100 ? 'success' : profilePct >= 70 ? 'accent' : 'warning'}" style="width: ${profilePct}%;"></div>
                            </div>
                        </div>
                        
                        <div style="text-align: left; font-size: 13px;">
                            <div class="p-field-row">
                                <span class="p-field-row-label">Supplier ID</span>
                                <span class="p-field-row-value">${Portal.esc(s.id)}</span>
                            </div>
                            <div class="p-field-row">
                                <span class="p-field-row-label">B-BBEE Level</span>
                                <span class="p-field-row-value">${s.bbbeeLevel ? 'Level ' + s.bbbeeLevel : 'Not declared'}</span>
                            </div>
                            <div class="p-field-row">
                                <span class="p-field-row-label">Province</span>
                                <span class="p-field-row-value">${Portal.esc(s.province || '—')}</span>
                            </div>
                        </div>
                        
                        <button class="p-btn p-btn-primary" style="width: 100%; margin-top: 16px;" onclick="Portal.Profile.openEdit()">
                            Edit Profile
                        </button>
                    </div>
                </div>
                
                <!-- Right: details + compliance -->
                <div class="lg:col-span-2 space-y-6">
                    <div class="portal-card">
                        <div class="portal-section-title">Company Information</div>
                        <div class="p-grid-2">
                            <div>
                                <div class="p-field-row"><span class="p-field-row-label">Legal Name</span><span class="p-field-row-value">${Portal.esc(s.legalName || '—')}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">Trading Name</span><span class="p-field-row-value">${Portal.esc(s.tradingName || '—')}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">Registration #</span><span class="p-field-row-value">${Portal.esc(s.registrationNumber || '—')}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">Tax Reference</span><span class="p-field-row-value">${Portal.esc(s.taxRef || '—')}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">VAT Number</span><span class="p-field-row-value">${Portal.esc(s.vatNumber || 'Not registered')}</span></div>
                            </div>
                            <div>
                                <div class="p-field-row"><span class="p-field-row-label">Province</span><span class="p-field-row-value">${Portal.esc(s.province || '—')}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">Municipality</span><span class="p-field-row-value">${Portal.esc(s.municipality || '—')}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">Website</span><span class="p-field-row-value">${Portal.esc(s.website || '—')}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">Years in Business</span><span class="p-field-row-value">${s.yearsInBusiness || '—'}</span></div>
                                <div class="p-field-row"><span class="p-field-row-label">B-BBEE Level</span><span class="p-field-row-value">${s.bbbeeLevel ? 'Level ' + s.bbbeeLevel : '—'}</span></div>
                            </div>
                        </div>
                        <div class="p-field-row" style="padding-top: 14px;">
                            <span class="p-field-row-label">Business Address</span>
                            <span class="p-field-row-value" style="max-width: 70%;">${Portal.esc(s.businessAddress || '—')}</span>
                        </div>
                    </div>
                    
                    <div class="portal-card">
                        <div class="portal-section-title">Primary Contact</div>
                        <div class="p-grid-2">
                            <div class="p-field-row"><span class="p-field-row-label">Name</span><span class="p-field-row-value">${Portal.esc(s.primaryContact?.name || '—')}</span></div>
                            <div class="p-field-row"><span class="p-field-row-label">Role</span><span class="p-field-row-value">${Portal.esc(s.primaryContact?.role || '—')}</span></div>
                            <div class="p-field-row"><span class="p-field-row-label">Email</span><span class="p-field-row-value">${Portal.esc(s.primaryContact?.email || '—')}</span></div>
                            <div class="p-field-row"><span class="p-field-row-label">Phone</span><span class="p-field-row-value">${Portal.esc(s.primaryContact?.phone || '—')}</span></div>
                        </div>
                    </div>
                    
                    <div class="portal-card">
                        <div class="portal-section-title">Compliance Documents (${compliance.length})</div>
                        ${compliance.length === 0 ? '<p style="font-size: 13px; color: var(--p-muted); padding: 12px 0;">No compliance documents uploaded</p>' : compliance.map(c => {
                            const state = getDocState(c);
                            return `
                                <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px; border: 1px solid var(--p-border); border-radius: 10px; margin-bottom: 10px; ${state.css}">
                                    <div style="width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; background: ${state.bg}; color: ${state.color};">${state.icon}</div>
                                    <div style="flex: 1; min-width: 0;">
                                        <div style="font-weight: 700; font-size: 13px; color: var(--p-navy);">${Portal.esc(c.documentType)}</div>
                                        <div style="font-size: 11px; color: var(--p-muted); margin-top: 2px;">
                                            ${c.referenceNumber ? `Ref: ${Portal.esc(c.referenceNumber)} · ` : ''}
                                            ${c.expiryDate ? `Expires ${Portal.formatDate(c.expiryDate)} · ` : ''}
                                            <span style="font-weight: 700; color: ${state.color};">${state.label}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        
                        <button class="p-btn p-btn-secondary p-btn-sm" style="margin-top: 8px;" onclick="Portal.Profile.openUploadDoc()">
                            + Upload New Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

function getDocState(record) {
    if (!record) return { label: 'Missing', icon: '?', color: '#94A3B8', bg: '#F1F5F9', css: '' };
    if (record.reviewStatus === 'missing') return { label: 'Missing', icon: '?', color: '#94A3B8', bg: '#F1F5F9', css: '' };
    if (record.reviewStatus === 'rejected') return { label: 'Rejected', icon: '✕', color: '#EF4444', bg: '#FEF2F2', css: 'background: #FEF2F2; border-color: #FECACA;' };
    if (record.reviewStatus === 'expired') return { label: 'Expired', icon: '✕', color: '#EF4444', bg: '#FEF2F2', css: 'background: #FEF2F2; border-color: #FECACA;' };
    
    if (record.expiryDate) {
        const days = Math.floor((new Date(record.expiryDate) - new Date()) / 86400000);
        if (days < 0) return { label: 'Expired', icon: '✕', color: '#EF4444', bg: '#FEF2F2', css: 'background: #FEF2F2; border-color: #FECACA;' };
        if (days < 30) return { label: `Expires in ${days}d`, icon: '⚠', color: '#F59E0B', bg: '#FFFBEB', css: 'background: #FFFBEB; border-color: #FDE68A;' };
    }
    
    if (record.reviewStatus === 'approved') return { label: 'Approved', icon: '✓', color: '#10B981', bg: '#ECFDF5', css: '' };
    return { label: 'Under Review', icon: '…', color: '#3B82F6', bg: '#EFF6FF', css: '' };
}

// ============================================================
// ACTIONS
// ============================================================
Portal.Profile = {
    openEdit: function() {
        const s = Portal.currentSupplier;
        Portal.openModal('Edit Company Profile', `
            <form id="profileEditForm" onsubmit="Portal.Profile.saveEdit(event)">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="p-form-group">
                        <label class="p-form-label">Trading Name *</label>
                        <input class="p-input" name="tradingName" required value="${Portal.esc(s.tradingName)}">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Legal Name *</label>
                        <input class="p-input" name="legalName" required value="${Portal.esc(s.legalName)}">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Registration Number</label>
                        <input class="p-input" name="registrationNumber" value="${Portal.esc(s.registrationNumber || '')}">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Tax Reference</label>
                        <input class="p-input" name="taxRef" value="${Portal.esc(s.taxRef || '')}">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">VAT Number</label>
                        <input class="p-input" name="vatNumber" value="${Portal.esc(s.vatNumber || '')}">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">B-BBEE Level</label>
                        <select class="p-select" name="bbbeeLevel">
                            <option value="">Not declared</option>
                            ${[1,2,3,4,5,6,7,8].map(n => `<option value="${n}" ${s.bbbeeLevel === n ? 'selected' : ''}>Level ${n}</option>`).join('')}
                        </select>
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Province</label>
                        <select class="p-select" name="province">
                            ${['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Free State','Limpopo','Mpumalanga','North West','Northern Cape'].map(p => `<option ${s.province === p ? 'selected' : ''}>${p}</option>`).join('')}
                        </select>
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Years in Business</label>
                        <input class="p-input" type="number" name="yearsInBusiness" value="${s.yearsInBusiness || ''}">
                    </div>
                </div>
                <div class="p-form-group">
                    <label class="p-form-label">Business Address</label>
                    <textarea class="p-textarea" name="businessAddress" rows="2">${Portal.esc(s.businessAddress || '')}</textarea>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="p-form-group">
                        <label class="p-form-label">Primary Contact Name</label>
                        <input class="p-input" name="contactName" value="${Portal.esc(s.primaryContact?.name || '')}">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Primary Contact Email</label>
                        <input class="p-input" type="email" name="contactEmail" value="${Portal.esc(s.primaryContact?.email || '')}">
                    </div>
                </div>
                <div class="p-form-group">
                    <label class="p-form-label">Company Description</label>
                    <textarea class="p-textarea" name="description" rows="3">${Portal.esc(s.description || '')}</textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--p-border);">
                    <button type="button" class="p-btn p-btn-secondary" onclick="Portal.closeModal()">Cancel</button>
                    <button type="submit" class="p-btn p-btn-primary">Save Changes</button>
                </div>
            </form>
        `, 'lg');
    },
    
    saveEdit: function(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const updates = {
            tradingName: fd.get('tradingName'),
            legalName: fd.get('legalName'),
            registrationNumber: fd.get('registrationNumber'),
            taxRef: fd.get('taxRef'),
            vatNumber: fd.get('vatNumber'),
            bbbeeLevel: fd.get('bbbeeLevel') ? parseInt(fd.get('bbbeeLevel')) : null,
            province: fd.get('province'),
            yearsInBusiness: fd.get('yearsInBusiness') ? parseInt(fd.get('yearsInBusiness')) : null,
            businessAddress: fd.get('businessAddress'),
            description: fd.get('description'),
            primaryContact: {
                ...Portal.currentSupplier.primaryContact,
                name: fd.get('contactName'),
                email: fd.get('contactEmail')
            }
        };
        
        Procurement.updateSupplier(Portal.currentSupplier.id, updates);
        Portal.currentSupplier = Procurement.getSupplier(Portal.currentSupplier.id);
        Portal.updateUserInfo();
        Portal.closeModal();
        Portal.navigateTo('profile');
        Portal.toast('Profile updated');
    },
    
    openUploadDoc: function() {
        Portal.openModal('Upload Compliance Document', `
            <form id="uploadDocForm" onsubmit="Portal.Profile.saveDoc(event)">
                <div class="p-form-group">
                    <label class="p-form-label">Document Type *</label>
                    <select class="p-select" name="documentType" required>
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
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="p-form-group">
                        <label class="p-form-label">Reference Number</label>
                        <input class="p-input" name="referenceNumber">
                    </div>
                    <div class="p-form-group">
                        <label class="p-form-label">Issue Date</label>
                        <input class="p-input" type="date" name="issueDate">
                    </div>
                </div>
                <div class="p-form-group">
                    <label class="p-form-label">Expiry Date</label>
                    <input class="p-input" type="date" name="expiryDate">
                </div>
                <div class="p-form-group">
                    <label class="p-form-label">Notes</label>
                    <textarea class="p-textarea" name="notes" rows="2"></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--p-border);">
                    <button type="button" class="p-btn p-btn-secondary" onclick="Portal.closeModal()">Cancel</button>
                    <button type="submit" class="p-btn p-btn-primary">Submit Document</button>
                </div>
            </form>
        `);
    },
    
    saveDoc: function(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        Procurement.addComplianceRecord(Portal.currentSupplier.id, {
            documentType: fd.get('documentType'),
            referenceNumber: fd.get('referenceNumber'),
            issueDate: fd.get('issueDate'),
            expiryDate: fd.get('expiryDate'),
            notes: fd.get('notes')
        });
        Portal.closeModal();
        Portal.navigateTo('profile');
        Portal.toast('Document submitted for review');
    }
};