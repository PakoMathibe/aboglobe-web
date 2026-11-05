// ============================================================
// MODULE: Email
// ============================================================

Views.email = () => {
    const folder = ERP.activeEmailFolder || 'Inbox';
    const emails = ERP.emails.filter(e => e.folder === folder).sort((a, b) => new Date(b.date) - new Date(a.date));
    const unread = ERP.emails.filter(e => !e.read && e.folder === 'Inbox').length;

    const list = emails.map(m => `
        <div onclick="App.viewEmail('${m.id}')" class="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!m.read ? 'bg-brand-cream/30' : ''}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-semibold ${!m.read ? 'text-brand-dark' : 'text-gray-600'}">${m.fromName}</span>
                <span class="text-[11px] text-gray-400">${new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <p class="text-sm ${!m.read ? 'font-bold text-brand-dark' : 'text-gray-700'} mb-1">${m.subject}</p>
            <p class="text-xs text-gray-500 line-clamp-1">${m.body.substring(0, 80)}...</p>
        </div>
    `).join('') || '<p class="p-8 text-center text-gray-400 text-sm">No emails in this folder</p>';

    const folders = ['Inbox', 'Sent', 'Drafts', 'Trash'].map(f => `
        <button onclick="ERP.activeEmailFolder='${f}'; App.navigateTo('email')" 
            class="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${f === folder ? 'bg-brand-brown text-white' : 'hover:bg-gray-100 text-gray-700'}">
            <span>${f}</span>
            ${f === 'Inbox' && unread ? `<span class="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">${unread}</span>` : ''}
        </button>
    `).join('');

    return App.header('Email', 'Inbox, compose, and reply', `
        <button onclick="App.openModal('Compose Email', document.getElementById('composeEmailTemplate').innerHTML, 'lg')" class="px-4 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">+ Compose</button>
    `) +
    `<div class="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-220px)]">
        <div class="md:col-span-1 bg-white rounded-2xl border border-gray-100 p-3">
            <div class="space-y-1">${folders}</div>
        </div>
        <div class="md:col-span-3 bg-white rounded-2xl border border-gray-100 overflow-y-auto">
            ${list}
        </div>
    </div>
    
    <div id="composeEmailTemplate" style="display:none">
        <form onsubmit="App.sendEmail(event)" class="space-y-4">
            <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">To</label>
                <input type="email" name="to" required class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></div>
            <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Subject</label>
                <input type="text" name="subject" required class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></div>
            <div><label class="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Message</label>
                <textarea name="body" rows="10" required class="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"></textarea></div>
            <div class="flex justify-end gap-2"><button type="button" onclick="App.closeModal()" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" class="px-6 py-2 text-sm bg-brand-brown text-white rounded-lg font-semibold">Send</button></div>
        </form>
    </div>`;
};