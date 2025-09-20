function announce(contents) {
  const messageContents = contents[0];
  const base64Image = contents[1];

  const discordMessage = buildMessage(messageContents, 'discord');
  const telegramMessage = buildMessage(messageContents, 'telegram');

  if (base64Image) {
    const image = decodeImage(base64Image);
    announceDiscord(discordMessage, image);
    announceTelegram(telegramMessage, image);
  } else {
    announceDiscord(discordMessage, null);
    announceTelegram(telegramMessage, null);
  }
}

function decodeImage(base64) {
  // there is likely a much better way of doing this, but i am lazy
  const mimeTypeStart = base64.indexOf(':') + 1;
  const mimeTypeEnd = base64.indexOf(';');
  const dataStart = base64.indexOf(',') + 1;

  const mimeType = base64.substring(mimeTypeStart, mimeTypeEnd);
  const data = base64.substring(dataStart);

  const imageContents = Utilities.base64Decode(data);
  const image = Utilities.newBlob(imageContents, mimeType);
  return image;
}

function buildMessage(messageContents, platform) {
  let tokens = []; 

  // intialize tokens to [<bold>, <italic>, <underline>, <strikethrough>]; 
  if (platform == 'discord') { tokens = ['**', '*', '__', '~~']; }
  else if (platform == 'telegram') { tokens = ['*', '_', '__', "~"]; }

  // messageContents is a 2D array s.t. messageContents[i][j] contains the i-th run with j format array
  var messageString = '';
  for (let i = 0; i < messageContents.length; i++) {
    let text = messageContents[i][0];

    for (let j = 0; j < tokens.length; j++) {
      if (messageContents[i][j + 1]) { text = `${tokens[j]}${text}${tokens[j]}`; }
    }

    messageString += text;
  }

  return messageString;
}

function announceDiscord(message, image) {
  // no bot required, just a webhook URL
  const url = PropertiesService.getScriptProperties().getProperty('DC_WEBHOOK');
  // const bot_name = PropertiesService.getScriptProperties().getProperty('DC_USERNAME');

  const payload = {
    content: message
  }

  if (image) {

  } else {
    const params = {
      method: "POST",
      payload: payload,
      muteHttpExceptions: true
    };

  Logger.log('Sending message to Discord...')
  // whatever. go my webhook
  var response = UrlFetchApp.fetch(url, params);
  Logger.log(`Message sent to Discord, received response ${response.getResponseCode()}`);
  }
}

function announceTelegram(message) {
  const botToken = PropertiesService.getScriptProperties().getProperty('TG_BOTTOKEN');
  const channel = PropertiesService.getScriptProperties().getProperty('TG_CHANNEL');
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?parse_mode=MarkdownV2`;

  const params = {
    method: "POST",
    contentType: 'application/json',
    payload: JSON.stringify({ 
      chat_id: channel, 
      text: message 
    }),
    muteHttpExceptions: false
  };

  // whatever. go my request
  Logger.log('Sending message to Telegram...')
  const response = UrlFetchApp.fetch(url, params);
  Logger.log(`Message sent to Telegram, received response ${response.getResponseCode()}`); // sanity check
}