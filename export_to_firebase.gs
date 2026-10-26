// Запускать в Apps Script, привязанном к твоей таблице (Расширения → Apps Script).
// Переносит цвета, эмодзи и примечания в Firebase в формате нового приложения.
function exportToFirebase() {
  const DB   = 'https://dayyyy-8d035-default-rtdb.europe-west1.firebasedatabase.app';
  const USER = 'winnieshe4k0';
  const YEAR = 2026;
  const MOODS = ['awful','bad','normal','good','super'];

  const sh = SpreadsheetApp.getActiveSheet();
  const legend = sh.getRange('Q6:Q10').getBackgrounds().map(r => r[0].toLowerCase());
  const grid = sh.getRange('C6:N36');
  const bg = grid.getBackgrounds();
  const vals = grid.getValues();
  const notes = grid.getNotes();

  const days = {};
  const unknown = {};
  for (let m = 0; m < 12; m++) {
    const dim = new Date(YEAR, m + 1, 0).getDate();
    for (let d = 0; d < dim; d++) {
      const color = String(bg[d][m]).toLowerCase();
      const idx = legend.indexOf(color);
      const emoji = String(vals[d][m] || '').trim();
      const note = String(notes[d][m] || '').trim();
      if (idx === -1 && color !== '#ffffff') unknown[color] = (unknown[color] || 0) + 1;
      if (idx > -1 || emoji || note) {
        days[m + '-' + (d + 1)] = { mood: idx > -1 ? MOODS[idx] : '', split2: '', emoji: emoji, note: note, photoUrl: '', locations: [] };
      }
    }
  }
  const res = UrlFetchApp.fetch(DB + '/' + USER + '/' + YEAR + '/days.json', {
    method: 'put', contentType: 'application/json',
    payload: JSON.stringify(days), muteHttpExceptions: true
  });
  Logger.log('Записей: ' + Object.keys(days).length + ', ответ: ' + res.getResponseCode());
  Logger.log('Цвета вне легенды: ' + JSON.stringify(unknown));
}
