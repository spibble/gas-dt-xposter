/*
*  Script property stuff
*/
function addSecret(key, value) {
  Logger.log("Adding a new secret...");

  var props = PropertiesService.getScriptProperties();
  switch (key) {
    case 'discord_url':
      props.setProperty('DC_WEBHOOK', value);
      Logger.log(`Added ${value} for DC_WEBHOOK`);
      break;
    case 'discord_username':
      props.setProperty('DC_USERNAME', value);
      Logger.log(`Added ${value} for DC_USERNAME`);
      break;
    case 'telegram_token':
      props.setProperty('TG_BOTTOKEN', value);
      Logger.log(`Added ${value} for TG_BOTTOKEN`);
      break;
    case 'telegram_channel':
      props.setProperty('TG_CHANNEL', value);
      Logger.log(`Added ${value} for TG_CHANNEL`);
      break;
  }
}

function saveSecrets(vals) {
  addSecret('discord_url', vals[0]);
  addSecret('discord_username', vals[1]);
  addSecret('telegram_token', vals[2]);
  addSecret('telegram_channel', vals[3]);
}

/*
*  Google Sheet stuff
*/
function getSelectedCell() {
  const range = SpreadsheetApp.getActiveRange();
  Logger.log(`Active range is ${range.getA1Notation()}`)
  if (!range) return '';

  const cell = range.getCell(1, 1);
  const cellA1 = cell.getA1Notation();
  Logger.log(`Got cell ${cellA1}`);
  return cellA1;
}

// Takes a RichTextValue and returns it as an array of form [<text content>, <is bold>, <is italic>, <is underlined>, <is struck through>].
function processRichTextValue(rtv) {
  let ret = ['', 0, 0, 0, 0];
  ret[0] = rtv.getText();

  let ts = rtv.getTextStyle();
  if (ts == null) {
    Logger.log('ERROR: multiple text styles in one run')
    return;
  }
  if (ts.isBold()) { ret[1] = 1; }
  if (ts.isItalic()) { ret[2] = 1; }
  if (ts.isUnderline()) {ret[3] = 1; }
  if (ts.isStrikethrough()) {ret[4] = 1; }

  return ret;
}

// Returns one array contents containing RTVs and image contents
function processForm(cellA1, base64Image) {
  Logger.log(base64Image)
  const cell = SpreadsheetApp.getActiveSpreadsheet().getRange(cellA1);
  const richTextValues = cell.getRichTextValue().getRuns();

  let messageContents = [];

  for (let i = 0; i < richTextValues.length; i++) {
    messageContents[i] = processRichTextValue(richTextValues[i]);
    Logger.log(messageContents[i]);
  }

  const contents = [messageContents, base64Image];
  return contents;
}