function updateSpreadsheet() {
  const majanSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('成績')
  var range1 = majanSheet.getRange("B3:B4"); // 更新したい範囲を指定
  var range2 = majanSheet.getRange("I5"); // 更新したい範囲を指定
  var formulas1 = range1.getFormulas();
  var formulas2 = range2.getFormulas();
  range1.setFormulas(formulas1);
  range2.setFormulas(formulas2);
}
