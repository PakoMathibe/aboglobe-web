// ============================================================
// MODULE: Profile
// ============================================================

Views.profile = () => {
    const u = ERP.currentUser;
    return App.header('My Profile', 'Manage your account and preferences') +
    `<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 content-enter text-center">
            <div class="w-24 h-24 rounded-full bg-brand-brown text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                ${u.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 class="text-lg font-bold text-brand-dark">${u.name}</h3>
            <p class="text-sm text-gray-500">${u.title || u.role}</p>
            <p class="text-xs text-gray-400 mt-1">${u.department} · ${u.location || ''}</p>
            
            <div class="mt-6 space-y-3 text-left text-sm">
                <div class="flex items-center gap-2 text-gray-600">
                    <svg class="w-4 h-4 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span class="truncate">${u.email}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                    <svg class="w-4 h-4 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>${u.phone || '—'}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                    <svg class="w-4 h-4 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Joined ${App.fmtDate(u.joined)}</span>
                </div>
            </div>

            <button onclick="App.navigateTo('users')" class="mt-6 w-full py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Manage All Users
            </button>
        </div>

        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 content-enter">
            <h3 class="font-bold text-brand-dark mb-1">Account Information</h3>
            <p class="text-xs text-gray-500 mb-6">Update your personal details</p>
            
            <form onsubmit="App.saveProfile(event)" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Full Name</label>
                        <input type="text" name="name" value="${u.name}" required class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Job Title</label>
                        <input type="text" name="title" value="${u.title || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Email</label>
                        <input type="email" name="email" value="${u.email}" required class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Phone</label>
                        <input type="tel" name="phone" value="${u.phone || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Department</label>
                        <select name="department" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">
                            ${['Executive', 'Finance', 'Procurement', 'Operations', 'HR', 'Sales', 'IT'].map(d => `<option ${d === u.department ? 'selected' : ''}>${d}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Location</label>
                        <input type="text" name="location" value="${u.location || ''}" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Bio</label>
                    <textarea name="bio" rows="3" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none">${u.bio || ''}</textarea>
                </div>
                <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button type="submit" class="px-6 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">Save Changes</button>
                </div>
            </form>

            <div class="mt-8 pt-6 border-t border-gray-100">
                <h4 class="font-bold text-brand-dark mb-3">Security</h4>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="text-sm font-semibold">Two-Factor Authentication</p>
                            <p class="text-xs text-gray-500">Add an extra layer of security</p>
                        </div>
                        <button onclick="App.toast('MFA settings opened', 'info')" class="px-3 py-1.5 bg-brand-brown text-white text-xs font-bold rounded-lg">Configure</button>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="text-sm font-semibold">Change Password</p>
                            <p class="text-xs text-gray-500">Last changed 45 days ago</p>
                        </div>
                        <button onclick="App.toast('Password change form opened', 'info')" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg">Update</button>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="text-sm font-semibold">Active Sessions</p>
                            <p class="text-xs text-gray-500">3 devices currently logged in</p>
                        </div>
                        <button onclick="App.toast('Session manager opened', 'info')" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg">View</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};