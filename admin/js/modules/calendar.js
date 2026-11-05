// ============================================================
// MODULE: Calendar
// ============================================================

Views.calendar = () => {
    const events = ERP.calendarEvents.sort((a, b) => a.date.localeCompare(b.date));
    const typeColor = { Meeting: 'bg-blue-500', Deadline: 'bg-red-500', Holiday: 'bg-green-500', Review: 'bg-amber-500', Reminder: 'bg-purple-500' };
    
    const grouped = {};
    events.forEach(e => {
        if (!grouped[e.date]) grouped[e.date] = [];
        grouped[e.date].push(e);
    });

    const html = Object.keys(grouped).sort().map(date => `
        <div class="flex gap-4 content-enter">
            <div class="w-16 text-center flex-shrink-0">
                <p class="text-2xl font-bold text-brand-dark">${new Date(date).getDate()}</p>
                <p class="text-xs text-gray-500 uppercase">${new Date(date).toLocaleDateString('en-US', { month: 'short' })}</p>
                <p class="text-[10px] text-gray-400">${new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            </div>
            <div class="flex-1 bg-white rounded-2xl border border-gray-100 p-4">
                ${grouped[date].map(ev => `
                    <div onclick="App.openEventModal('${ev.id}')" class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div class="w-1 h-12 rounded ${typeColor[ev.type] || 'bg-gray-400'}"></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <p class="font-semibold text-sm text-brand-dark">${ev.title}</p>
                                <span class="text-[11px] text-gray-500">${ev.time}</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">${ev.description}</p>
                            <div class="flex gap-2 mt-1">
                                <span class="badge ${App.badgeClass(ev.type)}">${ev.type}</span>
                                ${ev.attendees ? `<span class="text-[10px] text-gray-400">👥 ${ev.attendees}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    return App.header('Calendar', 'Meetings, deadlines, and events', `
        <button onclick="App.openEventModal()" class="px-4 py-2 bg-brand-brown text-white text-sm font-bold rounded-lg hover:bg-brand-dark">+ New Event</button>
    `) +
    `<div class="space-y-3">${html || '<p class="text-center text-gray-400 py-8">No events scheduled</p>'}</div>`;
};