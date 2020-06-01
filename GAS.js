var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/15FfRPcB6Hk8XsFG1alVchVZT5G2zWA9osbdSJeIPYu0/edit#gid=2104700177"),
     s = ss.getSheets();

function getData(){
  var result = [], info = [], news = [];
  
  for (var j = 0; j < s.length - 1; j++){
    var sheet = s[j],
    values = sheet.getDataRange().getValues(),
    last_row = parseInt(sheet.getLastRow());
    
    for (var i = 0; i < last_row; i++){
      if(s[j].getName()=="Info")
        info.push(values[i]);
    
      if(s[j].getName()=="News")
        news.push(values[i]);
    }
  }
  
  result.push(info);
  result.push(news);
  
  var settingsSheet = s[3];
  var settings = {'info_table': [settingsSheet.getRange('B2').getValue(), settingsSheet.getRange('C2').getValue()],
                  'news_table': [settingsSheet.getRange('B3').getValue(), settingsSheet.getRange('C3').getValue()]};
  
  result.push(settings);
  
  return result; 
}

function doGet() {
  var data = getData();
  if(!data) {
    data = '';
  }
  var info = data[0], news = data[1], settings = data[2];
  return ContentService.createTextOutput(JSON.stringify({'info': info, 'news': news, 'settings': settings})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  if(e.parameter.bcc != null){
    MailApp.sendEmail(e.parameter);
  }else{
    var sheet = ss.getSheetByName("Add");
    var content = e.parameter;
    sheet.getRange(sheet.getLastRow() + 1, 1).setValue(content.text);
    return ContentService.createTextOutput(JSON.stringify(e.parameter));
  }
}