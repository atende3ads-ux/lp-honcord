const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function createContext() {
  const rows = [['Recebido em', 'LP', 'Nome', 'WhatsApp', 'Convênio', 'Motivo do contato', 'Página', 'UTM source', 'UTM medium', 'UTM campaign', 'UTM term', 'UTM content', 'GCLID', 'ID do envio']];
  const sheet = {
    getLastRow: () => rows.length,
    getRange: (start, column, count) => ({getDisplayValues: () => rows.slice(start - 1, start - 1 + count).map(row => [row[column - 1]])}),
    appendRow: row => rows.push(row),
  };
  const context = {
    SpreadsheetApp: {openById: () => ({getSheetByName: () => sheet}), flush: () => {}},
    LockService: {getScriptLock: () => ({waitLock: () => {}, releaseLock: () => {}})},
    ContentService: {MimeType: {JSON: 'application/json'}, createTextOutput: text => ({text, setMimeType() {return this;}})},
    console,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(require.resolve('../apps-script/Code.gs'), 'utf8'), context);
  return {context, rows};
}

const base = {
  lp: 'hematologista', nome: 'TESTE 3ADS', whatsapp: '(62) 98435-2270',
  convenio: 'Particular', motivo: 'Encaminhamento médico',
  submission_id: '12345678-1234-1234-1234-123456789abc',
};
function submit(context, data) {
  return JSON.parse(context.doPost({postData: {contents: JSON.stringify(data)}}).text);
}

test('registra cada LP, preserva telefone e evita duplicidade', () => {
  const {context, rows} = createContext();
  assert.equal(submit(context, base).success, true);
  assert.equal(rows.length, 2);
  assert.equal(rows[1][3], "'62984352270");
  assert.equal(rows[1][6], 'https://saude.honcord.com.br/hematologista/');
  assert.equal(submit(context, base).success, true);
  assert.equal(rows.length, 2);
  assert.equal(submit(context, {...base, lp: 'oncologia', motivo: 'Segunda opinião', submission_id: '22345678-1234-1234-1234-123456789abc'}).success, true);
  assert.equal(rows[2][6], 'https://saude.honcord.com.br/oncologia/');
});

test('recusa motivos incompatíveis e telefones inválidos', () => {
  const {context, rows} = createContext();
  for (const changed of [
    {lp: 'outra'}, {motivo: 'Segunda opinião'},
    {whatsapp: '(62) 99999-9999'}, {whatsapp: '(62) 90000-0001'},
  ]) assert.equal(submit(context, {...base, ...changed}).success, false);
  assert.equal(rows.length, 1);
});

test('impede fórmula em texto recebido', () => {
  const {context, rows} = createContext();
  assert.equal(submit(context, {...base, convenio: '=HYPERLINK("x")'}).success, true);
  assert.equal(rows[1][4], '\'=HYPERLINK("x")');
});
