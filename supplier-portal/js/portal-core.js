// ============================================================
// SUPPLIER PORTAL - CORE
// Init, session, routing, sidebar, toast, modals
// ============================================================

window.Portal = {
    currentSupplier: null,
    currentView: 'dashboard',
    storageKey: 'abo_supplier_portal_session'
};

Portal.init = function() {
    // Wait for Procurement to be initialized
    if (!window.Procurement || !Procurement.data) {
        console.warn('[Portal] Waiting for Procurement init...');
        setTimeout(() => Portal.init(), 100);
        return;
    }
    
    // Seed portal accounts if not present
    Portal.seedPortalAccounts();
    
    // Check for existing session
    const saved = localStorage.getItem(Portal.storageKey);
    if (saved) {
        try {
            const session = JSON.parse(saved);
            const supplier = Portal.getSupplier(session.supplierId);
            if (supplier) {
                Portal.currentSupplier = supplier;
                Portal.showAppShell();
                return;
            }
        } catch (e) {
            console.warn('[Portal] Failed to restore session', e);
        }
    }
    
    Portal.showLogin();
};

// ============================================================
// SEED PORTAL ACCOUNTS
// ============================================================
Portal.seedPortalAccounts = function() {
    if (!Procurement.data.portalAccounts) {
        Procurement.data.portalAccounts = [
            { supplierId: 'VEN-0001', demoPassword: 'demo', lastLogin: null },
            { supplierId: 'VEN-0002', demoPassword: 'demo', lastLogin: null },
            { supplierId: 'VEN-0003', demoPassword: 'demo', lastLogin: null },
            { supplierId: 'VEN-0004', demoPassword: 'demo', lastLogin: null },
            { supplierId: 'VEN-0005', demoPassword: 'demo', lastLogin: null },
            { supplierId: 'VEN-0006', demoPassword: 'demo', lastLogin: null },
            { supplierId: 'VEN-0008', demoPassword: 'demo', lastLogin: null },
            { supplierId: 'VEN-0010', demoPassword: 'demo', lastLogin: null }
        ];
        
        if (!Procurement.data.portalNotifications) {
            Procurement.data.portalNotifications = [];
        }
        
        Procurement.save();
    }
};

// ============================================================
// AUTH
// ============================================================
Portal.loginAs = function(supplierId) {
    const supplier = Portal.getSupplier(supplierId);
    if (!supplier) {
        Portal.toast('Supplier not found', 'error');
        return;
    }
    
    Portal.currentSupplier = supplier;
    Portal.seedNotifications(supplierId);
    
    localStorage.setItem(Portal.storageKey, JSON.stringify({
        supplierId,
        loginAt: new Date().toISOString()
    }));
    
    Portal.showAppShell();
};

Portal.logout = function() {
    Portal.currentSupplier = null;
    localStorage.removeItem(Portal.storageKey);
    Portal.showLogin();
};

Portal.showLogin = function() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appShell').classList.add('hidden');
    Portal.renderLoginList();
};

Portal.showAppShell = function() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appShell').classList.remove('hidden');
    Portal.updateUserInfo();
    Portal.renderSidebar();
    Portal.renderNotifications();
    Portal.navigateTo('dashboard');
};

Portal.updateUserInfo = function() {
    const s = Portal.currentSupplier;
    if (!s) return;
    
    const initials = s.tradingName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const avatarColor = Portal.avatarColor(s.tradingName);
    
    document.getElementById('supplierAvatar').textContent = initials;
    document.getElementById('supplierAvatar').style.background = avatarColor;
    document.getElementById('supplierName').textContent = s.tradingName;
    document.getElementById('supplierRef').textContent = s.id;
    document.getElementById('portalLogo').textContent = initials;
};

Portal.renderLoginList = function() {
    const list = document.getElementById('loginSupplierList');
    if (!list) return;
    
    const suppliers = Procurement.getSuppliers();
    const accounts = Procurement.data.portalAccounts || [];
    const allowedIds = accounts.map(a => a.supplierId);
    const availableSuppliers = suppliers.filter(s => allowedIds.includes(s.id));
    
    if (availableSuppliers.length === 0) {
        list.innerHTML = '<p class="text-sm text-portal-muted text-center py-8">No supplier accounts configured</p>';
        return;
    }
    
    list.innerHTML = availableSuppliers.map(s => {
        const initials = s.tradingName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const color = Portal.avatarColor(s.tradingName);
        const statusBadge = s.onboardingStatus === 'qualified' && s.operationalStatus === 'active'
            ? '<span class="portal-badge portal-badge-success">Active</span>'
            : s.operationalStatus === 'suspended'
            ? '<span class="portal-badge portal-badge-danger">Suspended</span>'
            : '<span class="portal-badge portal-badge-warning">Pending</span>';
        
        return `
            <button onclick="Portal.loginAs('${s.id}')" class="w-full flex items-center gap-3 p-3 border border-portal-border rounded-xl hover:border-portal-accent hover:bg-slate-50 transition-all text-left">
                <div class="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style="background: ${color};">${initials}</div>
                <div class="min-w-0 flex-1">
                    <div class="text-sm font-semibold text-portal-navy truncate">${Portal.esc(s.tradingName)}</div>
                    <div class="text-xs text-portal-muted truncate">${Portal.esc(s.id)} · ${Portal.esc((s.categories || []).join(', '))}</div>
                </div>
                ${statusBadge}
            </button>
        `;
    }).join('');
};

// ============================================================
// SIDEBAR NAV
// ============================================================
Portal.NAV = [
    { section: 'Overview', items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' }
    ]},
    { section: 'Opportunities', items: [
        { id: 'opportunities', label: 'Open RFQs', icon: 'search', badge: 'opportunities' },
        { id: 'quotations', label: 'My Quotations', icon: 'file' }
    ]},
    { section: 'Orders', items: [
        { id: 'orders', label: 'Purchase Orders', icon: 'cart' },
        { id: 'invoices', label: 'Invoices', icon: 'money' }
    ]},
    { section: 'Account', items: [
        { id: 'profile', label: 'Company Profile', icon: 'building' },
        { id: 'messages', label: 'Messages', icon: 'chat', badge: 'messages' }
    ]}
];

Portal.ICONS = {
    home: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>',
    search: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>',
    file: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
    cart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>',
    money: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
    building: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>',
    chat: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>'
};

Portal.icon = function(name) {
    const path = Portal.ICONS[name] || Portal.ICONS.home;
    return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">${path}</svg>`;
};

Portal.renderSidebar = function() {
    const nav = document.getElementById('portalNav');
    if (!nav) return;
    
    const counts = {
        opportunities: Portal.getOpenOpportunitiesCount(),
        messages: Portal.getUnreadMessageCount()
    };
    
    nav.innerHTML = Portal.NAV.map(g => `
        <div class="portal-nav-section-title">${g.section}</div>
        ${g.items.map(item => {
            const badge = item.badge && counts[item.badge] > 0 
                ? `<span class="badge-count">${counts[item.badge]}</span>` 
                : '';
            return `
                <a class="portal-nav-link ${Portal.currentView === item.id ? 'active' : ''}" 
                    data-view="${item.id}" 
                    onclick="Portal.navigateTo('${item.id}')">
                    ${Portal.icon(item.icon)}
                    <span>${item.label}</span>
                    ${badge}
                </a>
            `;
        }).join('')}
    `).join('');
};

// ============================================================
// ROUTING
// ============================================================
Portal.VIEWS = {};  // Modules register here

Portal.META = {
    dashboard: ['Dashboard', 'Your workspace overview'],
    opportunities: ['Open RFQs', 'Opportunities from ABO Group'],
    quotations: ['My Quotations', 'Draft and submitted quotations'],
    orders: ['Purchase Orders', 'Issued orders from ABO Group'],
    invoices: ['Invoices', 'Submit and track invoices'],
    profile: ['Company Profile', 'Your company information'],
    messages: ['Messages', 'Communication with ABO Group']
};

Portal.navigateTo = function(view) {
    if (!Portal.currentSupplier) return;
    
    const viewFn = Portal.VIEWS[view];
    if (!viewFn) {
        console.warn('[Portal] No view for ' + view);
        return;
    }
    
    Portal.currentView = view;
    const meta = Portal.META[view] || ['', ''];
    document.getElementById('portalPageTitle').textContent = meta[0];
    document.getElementById('portalPageSubtitle').textContent = meta[1];
    
    document.querySelectorAll('.portal-nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.view === view);
    });
    
    const content = document.getElementById('portalContent');
    content.innerHTML = viewFn();
    content.classList.remove('portal-content-enter');
    void content.offsetWidth;
    content.classList.add('portal-content-enter');
    content.scrollTop = 0;
    
    if (window.innerWidth < 1024) {
        document.getElementById('portalSidebar').classList.add('-translate-x-full');
    }
};

// ============================================================
// HELPERS
// ============================================================
Portal.getSupplier = function(id) {
    return Procurement.getSupplier(id);
};

Portal.getMyRfqs = function() {
    if (!Portal.currentSupplier) return [];
    const rfqs = (Procurement.data && Procurement.data.rfqs) ? Procurement.data.rfqs : [];
    return rfqs.filter(r => (r.invitedVendors || []).includes(Portal.currentSupplier.id));
};

Portal.getMyQuotations = function() {
    if (!Portal.currentSupplier) return [];
    const quotations = (Procurement.data && Procurement.data.quotations) ? Procurement.data.quotations : [];
    return quotations.filter(q => q.vendorId === Portal.currentSupplier.id);
};

Portal.getMyOrders = function() {
    if (!Portal.currentSupplier) return [];
    const orders = (Procurement.data && Procurement.data.purchaseOrders) ? Procurement.data.purchaseOrders : [];
    return orders.filter(o => o.vendorId === Portal.currentSupplier.id);
};

Portal.getMyInvoices = function() {
    if (!Portal.currentSupplier) return [];
    const invoices = (Procurement.data && Procurement.data.invoices) ? Procurement.data.invoices : [];
    return invoices.filter(i => i.vendorId === Portal.currentSupplier.id);
};

Portal.getOpenOpportunitiesCount = function() {
    return Portal.getMyRfqs().filter(r => r.status === 'published').length;
};

Portal.getUnreadMessageCount = function() {
    if (!Procurement.data.portalMessages) return 0;
    return Procurement.data.portalMessages.filter(m => 
        m.supplierId === Portal.currentSupplier?.id && !m.read
    ).length;
};

Portal.esc = function(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
};

Portal.formatZAR = function(n) {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n || 0);
};

Portal.formatDate = function(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
};

Portal.formatDateTime = function(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

Portal.timeAgo = function(d) {
    if (!d) return '';
    const diff = (Date.now() - new Date(d)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    return Math.floor(diff/86400) + 'd ago';
};

Portal.countdown = function(deadline) {
    if (!deadline) return { label: 'No deadline', class: '' };
    const diff = new Date(deadline) - new Date();
    if (diff < 0) return { label: 'Expired', class: 'critical' };
    
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    
    if (days < 1) return { label: `${hours}h left`, class: 'critical' };
    if (days < 3) return { label: `${days}d ${hours}h left`, class: 'urgent' };
    return { label: `${days}d left`, class: '' };
};

Portal.avatarColor = function(name) {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#6366F1'];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

Portal.badgeClass = function(status) {
    const map = {
        draft: 'portal-badge-neutral',
        submitted: 'portal-badge-info',
        under_review: 'portal-badge-warning',
        clarification_required: 'portal-badge-warning',
        evaluated: 'portal-badge-info',
        awarded: 'portal-badge-success',
        unsuccessful: 'portal-badge-neutral',
        published: 'portal-badge-success',
        closed: 'portal-badge-neutral',
        cancelled: 'portal-badge-danger',
        pending: 'portal-badge-warning',
        paid: 'portal-badge-success'
    };
    return map[status] || 'portal-badge-neutral';
};

Portal.badgeLabel = function(status) {
    const map = {
        draft: 'Draft',
        submitted: 'Submitted',
        under_review: 'Under Review',
        clarification_required: 'Clarification Required',
        evaluated: 'Evaluated',
        awarded: 'Awarded',
        unsuccessful: 'Unsuccessful',
        published: 'Open',
        closed: 'Closed',
        cancelled: 'Cancelled',
        pending: 'Pending',
        paid: 'Paid'
    };
    return map[status] || status;
};

// ============================================================
// TOAST
// ============================================================
Portal.toast = function(message, type = 'success') {
    const container = document.getElementById('portalToastContainer');
    if (!container) return;
    
    const icons = { success: '✓', error: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `p-toast ${type}`;
    toast.innerHTML = `
        <span style="font-size: 16px; color: var(--p-${type === 'error' ? 'danger' : type === 'info' ? 'info' : 'success'});">${icons[type]}</span>
        <span>${Portal.esc(message)}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// ============================================================
// NOTIFICATIONS
// ============================================================
Portal.seedNotifications = function(supplierId) {
    if (!Procurement.data.portalNotifications) Procurement.data.portalNotifications = [];
    
    const existing = Procurement.data.portalNotifications.filter(n => n.supplierId === supplierId);
    if (existing.length > 0) return;
    
    const seeded = [
        { id: 'PN-' + Date.now() + '-1', supplierId, type: 'info', title: 'Welcome to Supplier Connect', text: 'Your account is now active.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'PN-' + Date.now() + '-2', supplierId, type: 'warning', title: 'New RFQ available', text: 'Enterprise Network Equipment Supply is now open for quotation.', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() }
    ];
    
    Procurement.data.portalNotifications.push(...seeded);
    Procurement.save();
};

Portal.getNotifications = function() {
    if (!Procurement.data.portalNotifications || !Portal.currentSupplier) return [];
    return Procurement.data.portalNotifications
        .filter(n => n.supplierId === Portal.currentSupplier.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

Portal.renderNotifications = function() {
    const list = document.getElementById('portalNotifList');
    if (!list) return;
    
    const notifs = Portal.getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    
    document.getElementById('portalNotifDot').classList.toggle('hidden', unread === 0);
    
    if (notifs.length === 0) {
        list.innerHTML = '<p class="p-6 text-sm text-portal-muted text-center">No notifications</p>';
        return;
    }
    
    const typeColors = { info: 'var(--p-info)', warning: 'var(--p-warning)', danger: 'var(--p-danger)', success: 'var(--p-success)' };
    
    list.innerHTML = notifs.map(n => `
        <div class="p-notification ${n.read ? '' : 'unread'}" onclick="Portal.markRead('${n.id}')">
            <div class="p-notification-dot" style="background: ${typeColors[n.type] || 'var(--p-info)'};"></div>
            <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-portal-navy">${Portal.esc(n.title)}</div>
                <div class="text-xs text-portal-muted mt-0.5">${Portal.esc(n.text)}</div>
                <div class="text-[10px] text-portal-muted mt-1">${Portal.timeAgo(n.createdAt)}</div>
            </div>
        </div>
    `).join('');
};

Portal.markRead = function(id) {
    const n = (Procurement.data.portalNotifications || []).find(x => x.id === id);
    if (n) {
        n.read = true;
        Procurement.save();
        Portal.renderNotifications();
        Portal.renderSidebar();
    }
};

Portal.markAllRead = function() {
    (Procurement.data.portalNotifications || []).forEach(n => {
        if (n.supplierId === Portal.currentSupplier.id) n.read = true;
    });
    Procurement.save();
    Portal.renderNotifications();
    Portal.renderSidebar();
    Portal.toast('All notifications read');
};

// ============================================================
// MODAL
// ============================================================
Portal.openModal = function(title, bodyHtml, size = 'md') {
    const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    const modal = document.createElement('div');
    modal.id = 'portalModal';
    modal.className = 'p-modal-overlay';
    modal.innerHTML = `
        <div class="p-modal ${sizes[size]}">
            <div class="p-modal-header">
                <h3 class="p-modal-title">${Portal.esc(title)}</h3>
                <button onclick="Portal.closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--p-muted);">×</button>
            </div>
            <div class="p-modal-body">${bodyHtml}</div>
        </div>
    `;
    document.body.appendChild(modal);
};

Portal.closeModal = function() {
    document.getElementById('portalModal')?.remove();
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    Portal.init();
    
    document.getElementById('portalMenuToggle')?.addEventListener('click', () => {
        document.getElementById('portalSidebar').classList.toggle('-translate-x-full');
    });
});