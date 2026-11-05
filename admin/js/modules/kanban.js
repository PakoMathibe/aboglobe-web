// ============================================================
// MODULE: Kanban Board
// ============================================================

Views.kanban = () => {
    const board = ERP.kanbanBoards.find(b => b.id === ERP.activeBoardId);
    const priorityColor = {
        Low: 'bg-gray-100 text-gray-600',
        Medium: 'bg-amber-100 text-amber-700',
        High: 'bg-red-100 text-red-700'
    };
    const cardHtml = (card) => `
        <div class="kanban-card bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3 group"
             draggable="true"
             data-card-id="${card.id}"
             ondragstart="event.dataTransfer.setData('cardId', '${card.id}'); this.style.opacity='0.4';"
             ondragend="this.style.opacity='1';">
            <div class="flex items-start justify-between mb-2">
                <span class="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${priorityColor[card.priority] || priorityColor.Medium}">${card.priority}</span>
                <button onclick="event.stopPropagation(); App.openCardModal('${card.id}')" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-brand-brown text-lg leading-none">⋯</button>
            </div>
            <p class="text-sm font-semibold text-brand-dark leading-snug mb-3">${card.title}</p>
            ${card.tags?.length ? `<div class="flex flex-wrap gap-1 mb-3">${card.tags.map(t => `<span class="text-[10px] px-1.5 py-0.5 bg-brand-cream text-brand-brown rounded">#${t}</span>`).join('')}</div>` : ''}
            <div class="flex items-center justify-between text-xs pt-2 border-t border-gray-50">
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full bg-brand-cream text-brand-brown flex items-center justify-center text-[9px] font-bold">${(card.assignee || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <span class="text-gray-500 truncate max-w-[100px]">${card.assignee || 'Unassigned'}</span>
                </div>
                ${card.dueDate ? `<span class="text-gray-400">${App.fmtDate(card.dueDate)}</span>` : ''}
            </div>
        </div>`;
    const columnsHtml = board.columns.map(col => {
        const cards = board.cards.filter(c => c.column === col);
        return `
            <div class="kanban-column flex-shrink-0 w-72 flex flex-col bg-gray-100/60 rounded-xl"
                 data-column="${col}"
                 ondragover="event.preventDefault(); this.classList.add('bg-brand-cream');"
                 ondragleave="this.classList.remove('bg-brand-cream');"
                 ondrop="event.preventDefault(); this.classList.remove('bg-brand-cream'); const id = event.dataTransfer.getData('cardId'); if(id) App.moveCard(id, '${col}');">
                <div class="p-3 flex items-center justify-between border-b border-gray-200/60">
                    <div class="flex items-center gap-2">
                        <h3 class="text-sm font-bold text-brand-dark uppercase tracking-wide">${col}</h3>
                        <span class="text-[11px] bg-white px-2 py-0.5 rounded-full text-gray-500 font-bold">${cards.length}</span>
                    </div>
                    <button onclick="App.openCardModal(null)" class="text-gray-400 hover:text-brand-brown transition-colors" title="Add card">+</button>
                </div>
                <div class="p-3 flex-1 overflow-y-auto" style="min-height: 200px; max-height: calc(100vh - 340px);">
                    ${cards.length ? cards.map(cardHtml).join('') : `<p class="text-xs text-gray-400 text-center py-6">No cards</p>`}
                </div>
            </div>`;
    }).join('');
    const boardSelector = `
        <select onchange="App.switchBoard(this.value)" class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-brown outline-none bg-white font-semibold">
            ${ERP.kanbanBoards.map(b => `<option value="${b.id}" ${b.id === board.id ? 'selected' : ''}>${b.name}</option>`).join('')}
        </select>`;
    return App.header(board.name, 'Drag cards between columns to update status', `
        ${boardSelector}
        <button onclick="App.openCardModal(null)" class="px-4 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">+ New Card</button>
    `) +
    `<div class="flex gap-4 overflow-x-auto pb-4">${columnsHtml}</div>`;
};