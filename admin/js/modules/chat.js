// ============================================================
// MODULE: Chat
// ============================================================

Views.chat = () => {
    const activeChannel = ERP.activeChannelId || 'general';
    const channel = ERP.chatChannels.find(c => c.id === activeChannel);
    const messages = ERP.chatMessages.filter(m => m.channelId === activeChannel);
    const channels = ERP.chatChannels.map(c => `
        <button onclick="App.openChannel('${c.id}')" class="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${c.id === activeChannel ? 'bg-brand-brown text-white' : 'hover:bg-gray-100'}">
            <span class="flex items-center gap-2 text-sm">
                <span class="font-bold">${c.icon}</span>
                <span class="truncate">${c.name}</span>
            </span>
            ${c.unread ? `<span class="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">${c.unread}</span>` : ''}
        </button>
    `).join('');

    const messagesHtml = messages.length ? messages.map(m => `
        <div class="flex items-start gap-3 ${m.self ? 'flex-row-reverse' : ''}">
            <div class="w-8 h-8 rounded-full ${m.self ? 'bg-brand-brown' : 'bg-brand-cream'} text-${m.self ? 'white' : 'brand-brown'} flex items-center justify-center text-xs font-bold flex-shrink-0">
                ${m.avatar}
            </div>
            <div class="${m.self ? 'items-end' : 'items-start'} flex flex-col max-w-[70%]">
                <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-xs font-bold text-gray-700">${m.self ? 'You' : m.author}</span>
                    <span class="text-[10px] text-gray-400">${m.time}</span>
                </div>
                <div class="${m.self ? 'bg-brand-brown text-white' : 'bg-gray-100 text-gray-800'} px-4 py-2.5 rounded-2xl text-sm leading-relaxed">
                    ${m.text}
                </div>
            </div>
        </div>
    `).join('') : `<p class="text-center text-gray-400 text-sm py-12">No messages yet. Say hello!</p>`;

    return App.header('Team Chat', 'Real-time messaging across channels') +
    `<div class="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-220px)]">
        <div class="md:col-span-1 bg-white rounded-2xl border border-gray-100 p-3 overflow-y-auto">
            <p class="text-[10px] font-bold uppercase text-gray-400 px-3 mb-2">Channels</p>
            <div class="space-y-1">${channels}</div>
        </div>
        <div class="md:col-span-3 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-brand-dark">${channel.icon} ${channel.name}</h3>
                    <p class="text-xs text-gray-500">${messages.length} messages</p>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chatMessages">
                ${messagesHtml}
            </div>
            <div class="p-4 border-t border-gray-100">
                <div class="flex gap-2">
                    <input id="chatInput" type="text" placeholder="Message ${channel.name}..."
                        onkeypress="if(event.key==='Enter') App.sendChatMessage('${activeChannel}')"
                        class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none text-sm">
                    <button onclick="App.sendChatMessage('${activeChannel}')" class="px-5 py-2.5 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">Send</button>
                </div>
            </div>
        </div>
    </div>`;
};