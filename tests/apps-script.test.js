const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const HEADER = ['Recebido em', 'LP', 'Nome', 'WhatsApp', 'Convênio', 'Motivo do contato', 'Página', 'UTM source', 'UTM medium', 'UTM campaign', 'UTM term', 'UTM content', 'GCLID', 'ID do envio'];

function createSheet(name, rows = []) {
  return {
    name, rows, frozen: 0,
    getLastRow: () => rows.length,
    getRange: (start, column, count) => ({getDisplayValues: () => rows.slice(start - 1, start - 1 + count).map(row => [row[column - 1]])}),
    appendRow: row => rows.push(row),
    setFrozenRows(n) { this.frozen = n; },
  };
}

function createContext() {
  const sheets = [createSheet('Leads Honcord', [HEADER.slice()])];
  const book = {
    getSheetByName: name => sheets.find(sheet => sheet.name === name) || null,
    getSheets: () => sheets,
    insertSheet: (name, index) => { const sheet = createSheet(name); sheets.splice(index, 0, sheet); return sheet; },
  };
  const context = {
    SpreadsheetApp: {openById: () => book, flush: () => {}},
    LockService: {getScriptLock: () => ({waitLock: () => {}, releaseLock: () => {}})},
    ContentService: {MimeType: {JSON: 'application/json'}, createTextOutput: text => ({text, setMimeType() {return this;}})},
    console,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(require.resolve('../apps-script/Code.gs'), 'utf8'), context);
  const tab = name => book.getSheetByName(name);
  return {context, sheets, tab};
}

const base = {
  lp: 'hematologista', nome: 'TESTE 3ADS', whatsapp: '(62) 98435-2270',
  convenio: 'Particular', motivo: 'Encaminhamento médico',
  submission_id: '12345678-1234-1234-1234-123456789abc',
};
function submit(context, data) {
  return JSON.parse(context.doPost({postData: {contents: JSON.stringify(data)}}).text);
}

test('registra cada LP na sua aba, preserva telefone e evita duplicidade', () => {
  const {context, sheets, tab} = createContext();
  assert.equal(submit(context, base).success, true);
  const hemato = tab('LP Hematologia').rows;
  assert.deepEqual(Array.from(hemato[0]), HEADER);
  assert.equal(tab('LP Hematologia').frozen, 1);
  assert.equal(hemato.length, 2);
  assert.equal(hemato[1][3], "'62984352270");
  assert.equal(hemato[1][6], 'https://saude.honcord.com.br/hematologista/');
  assert.equal(submit(context, base).success, true);
  assert.equal(hemato.length, 2);
  assert.equal(submit(context, {...base, lp: 'oncologia', motivo: 'Segunda opinião', submission_id: '22345678-1234-1234-1234-123456789abc'}).success, true);
  const onco = tab('LP Oncologia').rows;
  assert.equal(onco.length, 2);
  assert.equal(onco[1][6], 'https://saude.honcord.com.br/oncologia/');
  assert.equal(hemato.length, 2);
  assert.equal(tab('Leads Honcord').rows.length, 1);
  assert.deepEqual(sheets.map(sheet => sheet.name), ['LP Oncologia', 'LP Hematologia', 'Leads Honcord']);
});

test('recusa motivos incompatíveis e telefones inválidos', () => {
  const {context, sheets} = createContext();
  for (const changed of [
    {lp: 'outra'}, {motivo: 'Segunda opinião'},
    {whatsapp: '(62) 99999-9999'}, {whatsapp: '(62) 90000-0001'},
  ]) assert.equal(submit(context, {...base, ...changed}).success, false);
  assert.equal(sheets.length, 1);
});

test('impede fórmula em texto recebido', () => {
  const {context, tab} = createContext();
  assert.equal(submit(context, {...base, convenio: '=HYPERLINK("x")'}).success, true);
  assert.equal(tab('LP Hematologia').rows[1][4], '\'=HYPERLINK("x")');
});
