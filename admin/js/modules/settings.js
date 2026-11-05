// ============================================================
// MODULE: Settings
// ============================================================

Views.settings = () => {
    const s = ERP.settings || {};
    return App.header('Settings', 'Company configuration and system preferences') +
    `<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-2xl border border-gray-100 p-6 content-enter">
                <h3 class="font-bold text-brand-dark mb-4">Company Information</h3>
                <form onsubmit="App.saveSettings(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Company Name</label>
                            <input type="text" name="companyName" value="${s.companyName || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></div>
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Email</label>
                            <input type="email" name="email" value="${s.email || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></div>
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Phone</label>
                            <input type="tel" name="phone" value="${s.phone || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></div>
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Currency</label>
                            <select name="currency" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none">
                                ${['USD','EUR','GBP','JPY','CAD'].map(c => `<option ${c === s.currency ? 'selected' : ''}>${c}</option>`).join('')}
                            </select></div>
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Timezone</label>
                            <select name="timezone" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none">
                                ${['America/Chicago','America/New_York','Europe/London','Asia/Tokyo'].map(t => `<option ${t === s.timezone ? 'selected' : ''}>${t}</option>`).join('')}
                            </select></div>
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Fiscal Year Start</label>
                            <select name="fiscalYearStart" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none">
                                ${['January','April','July','October'].map(m => `<option ${m === s.fiscalYearStart ? 'selected' : ''}>${m}</option>`).join('')}
                            </select></div>
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Default Tax Rate (%)</label>
                            <input type="number" name="taxRate" value="${s.taxRate || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></div>
                        <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Invoice Prefix</label>
                            <input type="text" name="invoicePrefix" value="${s.invoicePrefix || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></div>
                    </div>
                    <div class="flex justify-end pt-3 border-t border-gray-100">
                        <button type="submit" class="px-6 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">Save Settings</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 p-6 content-enter">
                <h3 class="font-bold text-brand-dark mb-4">Security & Compliance</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div><p class="text-sm font-semibold">Multi-Factor Authentication</p><p class="text-xs text-gray-500">Require MFA for all users</p></div>
                        <span class="badge badge-success">Enabled</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div><p class="text-sm font-semibold">Session Timeout</p><p class="text-xs text-gray-500">Auto-logout after inactivity</p></div>
                        <span class="text-sm font-bold">${s.sessionTimeout || 30} min</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div><p class="text-sm font-semibold">Automated Backup</p><p class="text-xs text-gray-500">Last backup: Today 03:00 AM</p></div>
                        <span class="badge badge-success">${s.autoBackup || 'Daily'}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-1 space-y-4">
            <div class="bg-white rounded-2xl border border-gray-100 p-6 content-enter">
                <h3 class="font-bold text-brand-dark mb-2">Demo Controls</h3>
                <p class="text-xs text-gray-500 mb-4">Reset all changes back to seed data</p>
                <button onclick="if(confirm('Reset all demo data?')) App.resetState()" class="w-full py-2.5 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100">Reset Demo Data</button>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-6 content-enter">
                <h3 class="font-bold text-brand-dark mb-2">System Info</h3>
                <div class="space-y-2 text-xs text-gray-600">
                    <div class="flex justify-between"><span>Version</span><span class="font-semibold">2.4.1</span></div>
                    <div class="flex justify-between"><span>Data Storage</span><span class="font-semibold">localStorage</span></div>
                    <div class="flex justify-between"><span>Session</span><span class="font-semibold">${ERP.currentUser.name}</span></div>
                    <div class="flex justify-between"><span>Storage Used</span><span class="font-semibold">~${(JSON.stringify(ERP).length / 1024).toFixed(1)} KB</span></div>
                </div>
            </div>
        </div>
    </div>`;
};