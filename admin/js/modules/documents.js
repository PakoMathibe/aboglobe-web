// ============================================================
// MODULE: Document Management
// ============================================================

Views.documents = () => {
    const typeColors = { Contract: 'badge-info', Invoice: 'badge-warning', Proposal: 'badge-success', Report: 'badge-neutral', Policy: 'badge-warning', Document: 'badge-neutral' };
    const docs = ERP.documents.map(d => `
        <div class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer content-enter" onclick="App.openDocEditor('${d.id}')">
            <div class="flex items-start justify-between mb-3">
                <div class="w-11 h-11 rounded-xl bg-brand-cream text-brand-brown flex items-center justify-center">${App.icon('file')}</div>
                <span class="badge ${typeColors[d.type] || 'badge-neutral'}">${d.type}</span>
            </div>
            <h4 class="font-bold text-brand-dark text-sm mb-2 leading-snug">${d.title}</h4>
            <p class="text-xs text-gray-500 line-clamp-2 mb-3">${(d.body || '').substring(0, 100)}...</p>
            <div class="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-50">
                <span>${d.owner}</span>
                <span>${d.shared}</span>
            </div>
        </div>
    `).join('');

    return App.header('Document Management', 'Contracts, reports, policies and files', `
        <button onclick="App.openDocEditor()" class="px-4 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">+ New Document</button>
    `) +
    `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        ${docs || '<p class="text-gray-500 text-sm">No documents yet</p>'}
    </div>`;
};