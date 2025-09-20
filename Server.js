/*
*  This esentially "adds" the app under the Extensions drop-down in GS.
*  onInstall() is for if you were to install this from the GAS add-ons page.
*/
function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
    .addItem('Config', 'showConfigSidebar')
    .addItem('Post', 'showPostSidebar')
    .addToUi();
}

function onInstall(e) { onOpen(e); }

/*
*  Helpers
*/
function showSidebar(title, filename) {
  var ui = HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .setTitle(title);
  SpreadsheetApp.getUi().showSidebar(ui);
}

function showConfigSidebar() {
  showSidebar('Poster/Config', 'ConfigSidebar');
}

function showPostSidebar() {
  showSidebar('Poster/Post', 'PostSidebar');
}

// Takes a fake JS file (i.e., "file.js.html" and embeds it as a script in an actual HTML file)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

/*
*  Error and alert handling
*/
function error(s) {
  SpreadsheetApp.getUi().alert(s);
  throw s;
}

function toast(msg) {
  SpreadsheetApp.getActiveSpreadsheet().toast(msg);
  console.log(msg);
}