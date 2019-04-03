/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Get Report",
    functionName : "customizeReportFromMenu"
  },null,{
    name : "Start Automatic Trigger",
    functionName : "start_trigger"
  },{
    name : "Stop Automatic Trigger",
    functionName : "stop_trigger"
  }];
  sheet.addMenu("Document Creator", entries);
  
};


function start_trigger(){
 stop_trigger();
 var id = ScriptApp.newTrigger("trigger_action").timeBased().everyMinutes(1).create().getUniqueId();
 PropertiesService.getScriptProperties().setProperty('current_trigger', id);
}

function stop_trigger(){
 var triggers = ScriptApp.getProjectTriggers();
 var id = PropertiesService.getScriptProperties().getProperty('current_trigger');
 for (var i = 0; i < triggers.length; i++) {
   var trigger = triggers[i];
   var f = trigger.getHandlerFunction()
   if (f == "trigger_action"){
    ScriptApp.deleteTrigger(trigger);
   }
   if(trigger.getUniqueId() == id){
     PropertiesService.getScriptProperties().setProperty('current_trigger', "");
   }
 }
}

function trigger_action(triggerEvent){
 
 var current_trigger_id = PropertiesService.getScriptProperties().getProperty('current_trigger');
  if(triggerEvent == null || triggerEvent.triggerUid != current_trigger_id){
    stop_trigger();
    return; 
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Score");
  var iLastRow = sheet.getDataRange().getNumRows();
  var fromRow = 999999;
  
  var failed = [];
  
  for(var i = iLastRow ; i >2 ; i--){
    var chksum = sheet.getRange(i, 165).getValue();
    if (chksum != ""){
      fromRow = i;
      break;
    }
  }
  if(fromRow < iLastRow){
    var dest_address = sheet.getRange("EW" + fromRow + ":FI" + iLastRow);
    sheet.getRange("EW" + fromRow + ":FI" + fromRow).copyTo(dest_address);
    for(var j = fromRow + 1; j <= iLastRow ; j++){
      if (customizeReport(j) == false){
       failed.push(j); 
      }
    }
  }
  
  if(failed.length >0){
   emailAdminForFailures(failed);
   var message = "Checksum failed for row " + i
   logInfo(message);
  }
}

function customizeReportFromMenu(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Score");
  var row_num = SpreadsheetApp.getActiveRange().getRow();
  var dest_address = sheet.getRange("EW" + row_num + ":FI" + row_num);
  var reference_address = sheet.getRange("EW3:FI3");
  reference_address.copyTo(dest_address);
  customizeReport(row_num);
}

function customizeReport(row_num){
  
  try{
    
    //Let's get the data from the spreadsheet
    var row = getSpreadsheetData(row_num);  
    var fullName = row.name + ", " + row.title + ", " + row.company;
    var simpleName = row.name.split(" ")[0];
    var email = row.email;
    var subscriberEmail = row.subscriberEmail;
    var chksum = row.chksum;
    //If our checksum doesn't match, we don't have all the data we need to proceed
    if(!checkTheSum(row.chksum)){
      //Browser.msgBox("The checksum didn't match! Looks like you need to calculate the results first.");
      return false;
    }
    
    if(row.status == "Mail Sent"){
      //Browser.msgBox("The mail is already sent before.");
      return true;
    }
    
    //How the Candidate Is Now
    var HowCandidateIsNow = [row.p1, row.s1, row.i1, row.u1];
    var firstHighestIndex1 = getHighest(HowCandidateIsNow);
    var secondHighestIndex1 = getSecondHighest(HowCandidateIsNow);
    var thirdHighestIndex1 = getThirdHighest(HowCandidateIsNow);
    var fourthHighestIndex1 = getFourthHighest(HowCandidateIsNow);
    
    if(HowCandidateIsNow[0]>43){
      var candidateCurrentStyleName = 'Big Producer';
    }else if(HowCandidateIsNow[1]>43){
      var candidateCurrentStyleName = 'Big Stabilizer';
    }else if(HowCandidateIsNow[2]>43){
      var candidateCurrentStyleName = 'Big Innovator';
    }else if(HowCandidateIsNow[3]>43){
      var candidateCurrentStyleName = 'Big Unifier';
    }else if(HowCandidateIsNow.every(areAllSame) || inRange(HowCandidateIsNow[firstHighestIndex1], HowCandidateIsNow[fourthHighestIndex1],3)){
      var candidateCurrentStyleName = 'Even-Steven';
    }else{
      var indexBundle = firstHighestIndex1.toString()+secondHighestIndex1.toString()+thirdHighestIndex1.toString()+fourthHighestIndex1.toString();
      var candidateCurrentStyleName = getClosestCandidateStyle(indexBundle, HowCandidateIsNow);
    }
    var candidateCurrentStyleCode = getPSIUStyleCode(candidateCurrentStyleName);
    
    //How the Candidate Wants to Be
    var HowCandidateWantsToBe = [row.p2, row.s2, row.i2, row.u2];
    firstHighestIndex1 = getHighest(HowCandidateWantsToBe);
    secondHighestIndex1 = getSecondHighest(HowCandidateWantsToBe);
    thirdHighestIndex1 = getThirdHighest(HowCandidateWantsToBe);
    fourthHighestIndex1 = getFourthHighest(HowCandidateWantsToBe);
    
    if(HowCandidateWantsToBe[0]>43){
      var candidateDesiredStyleName = 'Big Producer';
    }else if(HowCandidateWantsToBe[1]>43){
      var candidateDesiredStyleName = 'Big Stabilizer';
    }else if(HowCandidateWantsToBe[2]>43){
      var candidateDesiredStyleName = 'Big Innovator';
    }else if(HowCandidateWantsToBe[3]>43){
      var candidateDesiredStyleName = 'Big Unifier';
    }else if(HowCandidateWantsToBe.every(areAllSame) || inRange(HowCandidateWantsToBe[firstHighestIndex1], HowCandidateWantsToBe[fourthHighestIndex1],3)){
      var candidateDesiredStyleName = 'Even-Steven';
    }else{
      var indexBundle = firstHighestIndex1.toString()+secondHighestIndex1.toString()+thirdHighestIndex1.toString()+fourthHighestIndex1.toString();
      var candidateDesiredStyleName = getClosestCandidateStyle(indexBundle, HowCandidateWantsToBe);
    }
    var candidateDesiredStyleCode = getPSIUStyleCode(candidateDesiredStyleName);
    
    //Needed Style
    var NeededStyle = [row.p3, row.s3, row.i3, row.u3];
    firstHighestIndex1 = getHighest(NeededStyle);
    secondHighestIndex1 = getSecondHighest(NeededStyle);
    thirdHighestIndex1 = getThirdHighest(NeededStyle);
    fourthHighestIndex1 = getFourthHighest(NeededStyle);
    
    if(NeededStyle[0]>43){
      var neededStyleName = 'Big Producer';
    }else if(NeededStyle[1]>43){
      var neededStyleName = 'Big Stabilizer';
    }else if(NeededStyle[2]>43){
      var neededStyleName = 'Big Innovator';
    }else if(NeededStyle[3]>43){
      var neededStyleName = 'Big Unifier';
    }else if(NeededStyle.every(areAllSame) || inRange(NeededStyle[firstHighestIndex1], NeededStyle[fourthHighestIndex1],3)){
      var neededStyleName = 'Even-Steven';
    }else{
      var indexBundle = firstHighestIndex1.toString()+secondHighestIndex1.toString()+thirdHighestIndex1.toString()+fourthHighestIndex1.toString();
      var neededStyleName = getClosestCandidateStyle(indexBundle, NeededStyle);
    }
    var neededStyleCode = getPSIUStyleCode(neededStyleName);
    
    //get today's date and format it properly
    var todaysDate = Utilities.formatDate(new Date(), "GMT", "MMMM d, yyyy");
    
    //Prepare and copy template to the new document
    var docId = copyTemplate(fullName);
    var doc = DocumentApp.openById(docId);
    var docBody = doc.getActiveSection();
    
    //Replace the name of the client and the date in the document
    docBody = docBody.replaceText('name_placeholder', fullName);
    docBody = docBody.replaceText('date_placeholder', todaysDate);
    
    //Loop through and propagate data table  
    var dataTable = doc.getTables()[0];
    var arr = ['p','s','i','u'];
    for(var a=1; a<=3; a++){
      dataRow = dataTable.getRow(a);
      for(var b=0;b < arr.length;b++){      
        dataRow.getCell(b+1).setText(row[arr[b]+a]);      
      }
    } 
    
    
    ////Needed Style Template Part
    docBody = docBody.replaceText('<NeededStyleName>', neededStyleName);
    docBody = docBody.replaceText('<NeededStyleCode>', neededStyleCode);
    if(neededStyleName=='Even-Steven' || neededStyleName=='Innovator-Unifier'){
      docBody = docBody.replaceText('<NeededIndefiniteArticle>', 'an');
    }else{
      docBody = docBody.replaceText('<NeededIndefiniteArticle>', 'a');
    }
    
    //How the Candidate Is Now Template Part
    docBody = docBody.replaceText('<CurrentStyleName>', candidateCurrentStyleName);
    docBody = docBody.replaceText('<CurrentStyleCode>', candidateCurrentStyleCode);
    if(candidateCurrentStyleName=='Even-Steven' || candidateCurrentStyleName=='Innovator-Unifier'){
      docBody = docBody.replaceText('<CurrentIndefiniteArticle>', 'an');
    }else{
      docBody = docBody.replaceText('<CurrentIndefiniteArticle>', 'a');
    }
    
    //How the Candidate Wants to Be Template Part
    docBody = docBody.replaceText('<DesiredStyleName>', candidateDesiredStyleName);
    docBody = docBody.replaceText('<DesiredStyleCode>', candidateDesiredStyleCode);
    if(candidateDesiredStyleName=='Even-Steven' || candidateDesiredStyleName=='Innovator-Unifier'){
      docBody = docBody.replaceText('<DesiredIndefiniteArticle>', 'an');
    }else{
      docBody = docBody.replaceText('<DesiredIndefiniteArticle>', 'a');
    }
    
    var chartHowYouAre = docBody.findText('template_graph_how_you_are').getElement().getParent();
    var chartHowYouWantToBe = docBody.findText('template_graph_how_you_want_to_be').getElement().getParent();
    var chartHowOthersWantYouToBe = docBody.findText('template_graph_how_others_want_you_to_be').getElement().getParent();
//    try {
//      //we need the data in comma separated values for chart generation
//      var data1 = formatChartData(HowCandidateIsNow);
//      var data2 = formatChartData(HowCandidateWantsToBe);
//      var data3 = formatChartData(NeededStyle);
//
//      //generate each radar chart
//      chart1 = "http://chart.apis.google.com/chart?chxl=0:|0|10|20|30|40|50|1:|Producer|Stabilizer|Innovator|Unifier&chxp=0,0,20,40,60,80,100&chxr=1,0,50&chxs=0,000000,14,.90,l,676767|1,000000,16,0,lt,676767&chxt=y,x&chs=600x400&cht=r&chco=4a7ebb,a5a5a5,a5a5a5,a5a5a5,a5a5a5,a5a5a5&chd=t:" + data1 + "|20,20,20,20,20|40,40,40,40,40|60,60,60,60,60|80,80,80,80,80|100,100,100,100,100&chdl=How+You+Are&chls=5|0|0|0|0|0&chdls=000000,14&chma=0,0,0,0|200&chm=D,a5a5a5,1,0,1,-1|D,a5a5a5,2,0,1,-1|D,a5a5a5,3,0,1,-1|D,a5a5a5,4,0,1,-1|D,a5a5a5,5,0,1,-1";
//      chart2 = "http://chart.apis.google.com/chart?chxl=0:|0|10|20|30|40|50|1:|Producer|Stabilizer|Innovator|Unifier&chxp=0,0,20,40,60,80,100&chxr=1,0,50&chxs=0,000000,14,.90,l,676767|1,000000,16,0,lt,676767&chxt=y,x&chs=600x400&cht=r&chco=4a7ebb,be4b48,a5a5a5,a5a5a5,a5a5a5,a5a5a5,a5a5a5&chd=t:" + data1 + "|" + data2 + "|20,20,20,20,20|40,40,40,40,40|60,60,60,60,60|80,80,80,80,80|100,100,100,100,100&chdl=How+You+Are|How+You+Want+To+Be&chls=5|5|0|0|0|0|0&chdls=000000,14&chma=0,0,0,0|200&chm=D,a5a5a5,2,0,1,-1|D,a5a5a5,3,0,1,-1|D,a5a5a5,4,0,1,-1|D,a5a5a5,5,0,1,-1|D,a5a5a5,6,0,1,-1";
//      chart3 = "http://chart.apis.google.com/chart?chxl=0:|0|10|20|30|40|50|1:|Producer|Stabilizer|Innovator|Unifier&chxp=0,0,20,40,60,80,100&chxr=1,0,50&chxs=0,000000,14,.90,l,676767|1,000000,16,0,lt,676767&chxt=y,x&chs=600x400&cht=r&chco=4a7ebb,be4b48,98b954,a5a5a5,a5a5a5,a5a5a5,a5a5a5,a5a5a5&chd=t:" + data1  + "|" + data2  + "|" + data3 + "|20,20,20,20,20|40,40,40,40,40|60,60,60,60,60|80,80,80,80,80|100,100,100,100,100&chdl=How+You+Are|How+You+Want+To+Be|How+Others+Want+You+To+Be&chls=5|5|5|0|0|0|0|0&chdls=000000,14&chma=0,0,0,0|200&chm=D,a5a5a5,3,0,1,-1|D,a5a5a5,4,0,1,-1|D,a5a5a5,5,0,1,-1|D,a5a5a5,6,0,1,-1|D,a5a5a5,7,0,1,-1";
//      
//      //fetch image to insert into document
//      var getChart1 = UrlFetchApp.fetch(chart1.replace(/\|/g, '%7c'));
//      var getChart2 = UrlFetchApp.fetch(chart2.replace(/\|/g, '%7c'));
//      var getChart3 = UrlFetchApp.fetch(chart3.replace(/\|/g, '%7c')); 
//      
//      // insert the image at correct location as designated by template
//      
//      chartHowYouAre.setText(' ');
//      chartHowYouAre.insertInlineImage(0,getChart1.getBlob());
//      
//      chartHowYouWantToBe.setText(' ');
//      chartHowYouWantToBe.insertInlineImage(0,getChart2.getBlob());
//      
//      chartHowOthersWantYouToBe.setText(' ');
//      chartHowOthersWantYouToBe.insertInlineImage(0,getChart3.getBlob());
//    } catch(e) 
    {
      var data1 = HowCandidateIsNow.join(",");
      var data2 = HowCandidateWantsToBe.join(",");
      var data3 = NeededStyle.join(",");
      try {
        //generate each radar chart
        var chart1 = 'https://quickchart.io/chart?bkg=white&w=300&h=250&c=' + encodeURIComponent('{type:"radar",data:{labels:[["Producer",""],"    Stabilizer",["","Innovator"]," Unifier    "],datasets:[{label:"How You Are",borderColor:"#4a7ebb",backgroundColor:"#4a7ebb",borderWidth:2,pointRadius:0,fill:false,data:[' + data1 + ']}]},options:{scale:{gridLines:{color:"lightgrey",lineWidth:1},ticks:{beginAtZero:true,min:0,max:50,stepSize:10,backdropColor:"rgba(255,255,255,0)",fontSize:6,fontColor:"#333"},pointLabels:{fontSize:8,fontColor:"#333"}},legend:{position:"bottom",labels:{boxWidth:6,fontSize:6,fontColor:"#333"}}}}');
        var chart2 = 'https://quickchart.io/chart?bkg=white&w=300&h=250&c=' + encodeURIComponent('{type:"radar",data:{labels:[["Producer",""],"    Stabilizer",["","Innovator"]," Unifier    "],datasets:[{label:"How You Want To Be",borderColor:"#be4b48",backgroundColor:"#be4b48",borderWidth:2,pointRadius:0,fill:false,data:[' + data2 + ']},{label:"How You Are",borderColor:"#4a7ebb",backgroundColor:"#4a7ebb",borderWidth:2,pointRadius:0,fill:false,data:[' + data1 + ']}]},options:{scale:{gridLines:{color:"lightgrey",lineWidth:1},ticks:{beginAtZero:true,min:0,max:50,stepSize:10,backdropColor:"rgba(255,255,255,0)",fontSize:6,fontColor:"#333"},pointLabels:{fontSize:8,fontColor:"#333"}},legend:{position:"bottom",reverse:true,labels:{boxWidth:6,fontSize:6,fontColor:"#333"}}}}');
        var chart3 = 'https://quickchart.io/chart?bkg=white&w=300&h=250&c=' + encodeURIComponent('{type:"radar",data:{labels:[["Producer",""],"    Stabilizer",["","Innovator"]," Unifier    "],datasets:[{label:"How Others Want You To Be",borderColor:"#98b954",backgroundColor:"#98b954",borderWidth:2,pointRadius:0,fill:false,data:[' + data3 + ']},{label:"How You Want To Be",borderColor:"#be4b48",backgroundColor:"#be4b48",borderWidth:2,pointRadius:0,fill:false,data:[' + data2 + ']},{label:"How You Are",borderColor:"#4a7ebb",backgroundColor:"#4a7ebb",borderWidth:2,pointRadius:0,fill:false,data:[' + data1 + ']}]},options:{scale:{gridLines:{color:"lightgrey",lineWidth:1},ticks:{beginAtZero:true,min:0,max:50,stepSize:10,backdropColor:"rgba(255,255,255,0)",fontSize:6,fontColor:"#333"},pointLabels:{fontSize:8,fontColor:"#333"}},legend:{position:"bottom",reverse:true,labels:{boxWidth:6,fontSize:6,fontColor:"#333"}}}}');
        
        //fetch image to insert into document
        var getChart1 = UrlFetchApp.fetch(chart1);
        var getChart2 = UrlFetchApp.fetch(chart2);
        var getChart3 = UrlFetchApp.fetch(chart3); 
        
        // insert the image at correct location as designated by template
        
        chartHowYouAre.setText(' ');
        chartHowYouAre.insertInlineImage(0,getChart1.getBlob());
        
        chartHowYouWantToBe.setText(' ');
        chartHowYouWantToBe.insertInlineImage(0,getChart2.getBlob());
        
        chartHowOthersWantYouToBe.setText(' ');
        chartHowOthersWantYouToBe.insertInlineImage(0,getChart3.getBlob());
      } catch(e) {
        Logger.log(e);
        chartHowYouAre.setText('Sorry, this image is temporarily unavailable. We\'re working on a fix.');
        chartHowYouWantToBe.setText('Sorry, this image is temporarily unavailable. We\'re working on a fix.');
        chartHowOthersWantYouToBe.setText('Sorry, this image is temporarily unavailable. We\'re working on a fix.');
      }
    }
    doc.saveAndClose();
    
    
    // Send an email with a file from Google Drive attached as a PDF.
    var bodyMessage = getBodyMessage(simpleName);
    var htmlBodyMessage = getHtmlBodyMessage(simpleName);
    GmailApp.sendEmail(email, 'PSIU Individual Assessment Report', bodyMessage, {
      attachments: [doc.getAs(MimeType.PDF)],
      htmlBody: htmlBodyMessage,
      cc: subscriberEmail
    });
    
    var log_message = "Successfully Mailed Row " + row_num + " Data to " + email +" ," + subscriberEmail
    
    logInfo(log_message);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Score");
    sheet.getRange(row_num, 166).setValue("Mail Sent");
    return true;
    
  }catch(e){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Score");
    sheet.getRange(row_num, 166).setValue("Failed");
    return false;
  }
 
}

function getPSIUStyleCode(targetName){
  
  var psui_list = {};
  psui_list['Producer-Stabilizer'] = 'accomplish the daily/weekly work and to bring order out of chaos.';
  psui_list['Producer-Innovator'] = 'accomplish the daily/weekly work and to find creative solutions to complex problems.';
  psui_list['Producer-Unifier'] = 'accomplish the daily/weekly work and to keep the team/clients on the same page.';
  psui_list['Stabilizer-Innovator'] = 'bring order out of chaos and to find creative solutions to complex problems.';
  psui_list['Stabilizer-Unifier'] = 'bring order out of chaos and to keep the team/clients on the same page.';
  psui_list['Innovator-Unifier'] = 'find creative solutions to complex problems and to keep the team/clients on the same page.';
  psui_list['Producer-Stabilizer-Unifier'] = 'accomplish the daily/weekly work, to bring order out of chaos, and to keep the team/clients on the same page.';
  psui_list['Producer-Innovator-Unifier'] = 'accomplish the daily/weekly work, to find creative solutions to complex problems, and to keep the team/clients on the same page.';
  psui_list['Producer-Stabilizer-Innovator'] = 'accomplish the daily/weekly work, to bring order out of chaos, and to find creative solutions to complex problems.';
  psui_list['Stabilizer-Innovator-Unifier'] = 'bring order out of chaos, to find creative solutions to complex problems, and to keep the team/clients on the same page.';
  psui_list['Even-Steven'] = 'fill in the open gaps.';
  psui_list['Big Producer'] = 'accomplish the daily/weekly work.';
  psui_list['Big Stabilizer'] = 'bring order out of chaos.';
  psui_list['Big Innovator'] = 'find creative solutions to complex problems.';
  psui_list['Big Unifier'] = 'keep the team/clients on the same page.';
  
  for(name in psui_list){
    
    if(name == targetName){
      return psui_list[name];
    }
    
  }
  
  return false;
  
}

function getClosestCandidateStyle(indexBundle, array){
  
  switch (indexBundle) {
    case '0123':
      if(array[2]>=30){
        return 'Producer-Stabilizer-Innovator';
      }else{
        return 'Producer-Stabilizer';
      }
      break;
    case '0132':
      if(array[3]>=30){
        return 'Producer-Stabilizer-Unifier';
      }else{
        return 'Producer-Stabilizer';
      }
      break;
    case '0213':
      if(array[1]>=30){
        return 'Producer-Stabilizer-Innovator';
      }else{
        return 'Producer-Innovator';
      }
      break;
    case '0231':
      if(array[3]>=30){
        return 'Producer-Innovator-Unifier';
      }else{
        return 'Producer-Innovator';
      }
      break;
    case '0312':
      if(array[1]>=30){
        return 'Producer-Stabilizer-Unifier';
      }else{
        return 'Producer-Unifier';
      }
      break;
    case '0321':
      if(array[2]>=30){
        return 'Producer-Innovator-Unifier';
      }else{
        return 'Producer-Unifier';
      }
      break;
    case '1023':
      if(array[2]>=30){
        return 'Producer-Stabilizer-Innovator';
      }else{
        return 'Producer-Stabilizer';
      }
      break;
    case '1032':
      if(array[3]>=30){
        return 'Producer-Stabilizer-Unifier';
      }else{
        return 'Producer-Stabilizer';
      }
      break;
    case '1203':
      if(array[0]>=30){
        return 'Producer-Stabilizer-Innovator';
      }else{
        return 'Stabilizer-Innovator';
      }
      break;
    case '1230':
      if(array[3]>=30){
        return 'Stabilizer-Innovator-Unifier';
      }else{
        return 'Stabilizer-Innovator';
      }
      break;
    case '1302':
      if(array[0]>=30){
        return 'Producer-Stabilizer-Unifier';
      }else{
        return 'Stabilizer-Unifier';
      }
      break;
    case '1320':
      if(array[2]>=30){
        return 'Stabilizer-Innovator-Unifier';
      }else{
        return 'Stabilizer-Unifier';
      }
      break;
    case '2013':
      if(array[1]>=30){
        return 'Producer-Stabilizer-Innovator';
      }else{
        return 'Producer-Innovator';
      }
      break;
    case '2031':
      if(array[3]>=30){
        return 'Producer-Innovator-Unifier';
      }else{
        return 'Producer-Innovator';
      }
      break;
    case '2103':
      if(array[0]>=30){
        return 'Producer-Stabilizer-Innovator';
      }else{
        return 'Stabilizer-Innovator';
      }
      break;
    case '2130':
      if(array[3]>=30){
        return 'Stabilizer-Innovator-Unifier';
      }else{
        return 'Stabilizer-Innovator';
      }
      break;
    case '2301':
      if(array[0]>=30){
        return 'Producer-Innovator-Unifier';
      }else{
        return 'Innovator-Unifier';
      }
      break;
    case '2310':
      if(array[1]>=30){
        return 'Stabilizer-Innovator-Unifier';
      }else{
        return 'Innovator-Unifier';
      }
      break;
    case '3012':
      if(array[1]>=30){
        return 'Producer-Stabilizer-Unifier';
      }else{
        return 'Producer-Unifier';
      }
      break;
    case '3021':
      if(array[2]>=30){
        return 'Producer-Innovator-Unifier';
      }else{
        return 'Producer-Unifier';
      }
      break;
    case '3102':
      if(array[0]>=30){
        return 'Producer-Stabilizer-Unifier';
      }else{
        return 'Stabilizer-Unifier';
      }
      break;
    case '3120':
      if(array[2]>=30){
        return 'Stabilizer-Innovator-Unifier';
      }else{
        return 'Stabilizer-Unifier';
      }
      break;
    case '3201':
      if(array[0]>=30){
        return 'Producer-Innovator-Unifier';
      }else{
        return 'Innovator-Unifier';
      }
      break;
    case '3210':
      if(array[1]>=30){
        return 'Stabilizer-Innovator-Unifier';
      }else{
        return 'Innovator-Unifier';
      }
      break;
    default:
      return false;
  }
  
  return text;
  
}

function copyTemplate(fullName){
  var oldFile = DriveApp.getFileById('17vtUUFKGR3-JbrBPhY_B2e6Ai-1SZbgOsjwVvS4TD8c')
  var docId = oldFile.makeCopy("PSIU Individual Assessment Report " + fullName).getId();
  return docId;
}

function inRange( a, b, x ){
	return (Math.abs( a - b ) <= x);
}

function areAllSame(el, index, arr) {
    if (index === 0){
        return true;
    }
    else {
        return (el === arr[index - 1]);
    }
}

function getHighest(arr){
    return arr.indexOf(Math.max.apply( Math, arr ));
}

function getSecondHighest(original){
  var originalCopy = original.slice(0);
  var newArray = original.slice(0);
  var sortedArray = newArray.sort(compare);
  var secondHighest = newArray[1];
  //check if highest is the same number for ties
  if(sortedArray[0] == sortedArray[1]){
    delete originalCopy[originalCopy.indexOf(sortedArray[0])];
  }  
  return originalCopy.indexOf(secondHighest);
}

function getThirdHighest(original){
  var originalCopy = original.slice(0);
  var newArray = original.slice(0);
  var sortedArray = newArray.sort(compare);
  var thirdHighest = newArray[2];
  //check if highest is the same number for ties
  if(sortedArray[0] == sortedArray[2]){
    delete originalCopy[originalCopy.indexOf(sortedArray[0])];
  }  
  if(sortedArray[1] == sortedArray[2]){
    delete originalCopy[originalCopy.indexOf(sortedArray[1])];
  } 
  return originalCopy.indexOf(thirdHighest);
}

function getFourthHighest(original){
  var originalCopy = original.slice(0);
  var newArray = original.slice(0);
  var sortedArray = newArray.sort(compare);
  var fourthHighest = newArray[3];
  //check if highest is the same number for ties
  if(sortedArray[0] == sortedArray[3]){
    delete originalCopy[originalCopy.indexOf(sortedArray[0])];
  }  
  if(sortedArray[1] == sortedArray[3]){
    delete originalCopy[originalCopy.indexOf(sortedArray[1])];
  }
  if(sortedArray[2] == sortedArray[3]){
    delete originalCopy[originalCopy.indexOf(sortedArray[2])];
  }
  return originalCopy.indexOf(fourthHighest);
}

function compare(a,b){
  return(b-a);
}

function formatChartData(arr){
  for(var i=0;i<arr.length;i++){
    arr[i] *= 2;
  }
  //need to connect lines, so we duplicate the first values
  arr[i] = arr[0];
  //also need it to be comma separated values
  return arr.join(",");
}

function getSpreadsheetData(row){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Score");  
  var selectedRange = "A" + row + ":" + "FL" + row; 
  
  var range = sheet.getRange(selectedRange);  
  var values = getRowsData(sheet, range, 2)[0];
  
  //var values = sheet.getRange(selectedRange).getValues()[0];
  return values;
}

function checkTheSum(checkSum){  
  return (parseInt(checkSum) == 360);  
}


// getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}


// For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

// Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

// Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

// Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}

// Given a JavaScript 2d Array, this function returns the transposed table.
// Arguments:
//   - data: JavaScript 2d Array
// Returns a JavaScript 2d Array
// Example: arrayTranspose([[1,2,3],[4,5,6]]) returns [[1,4],[2,5],[3,6]].
function arrayTranspose(data) {
  if (data.length == 0 || data[0].length == 0) {
    return null;
  }

  var ret = [];
  for (var i = 0; i < data[0].length; ++i) {
    ret.push([]);
  }

  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < data[i].length; ++j) {
      ret[j][i] = data[i][j];
    }
  }

  return ret;
}

// Given a JavaScript 2d Array, this function returns the transposed table.
// Arguments:
//   - data: JavaScript 2d Array
// Returns a JavaScript 2d Array
// Example: arrayTranspose([[1,2,3],[4,5,6]]) returns [[1,4],[2,5],[3,6]].
function arrayTranspose(data) {
  if (data.length == 0 || data[0].length == 0) {
    return null;
  }

  var ret = [];
  for (var i = 0; i < data[0].length; ++i) {
    ret.push([]);
  }

  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < data[i].length; ++j) {
      ret[j][i] = data[i][j];
    }
  }

  return ret;
}


function getBodyMessage(simpleName) {
  var templateMessage = "Hi %simplename%,"
    + "\n\n"
    + "Please find attached a copy of your PSIU Individual Assessment Report. "
    + "I recommend that you print this report, scan it, then watch this 12-minute video for insights on how to interpret your results."
    + "\n\n"
    + "Thank you and please contact me if you have any questions."
    + "\n\n"
    + "To your success,"
    + "\n\n"
    + "Lex Sisney"
    + "\n"
    + "Organizational Physics"
    + "\n"
    + "805-886-6400";
  
  return templateMessage.replace("%simplename%", simpleName);
}


function getHtmlBodyMessage(simpleName) {
  var templateMessage = "Hi %simplename%,"
    + "<br /><br />"
    + "Please find attached a copy of your PSIU Individual Assessment Report. "
    + "I recommend that you print this report, scan it, then "
    + "<a href=\"http://www.youtube.com/watch?v=FVjXobyuL-c&amp;feature=youtu.be\" target=\"_blank\">watch this 12-minute video</a> "
    + "for insights on how to interpret your results."
    + "<br /><br />"
    + "Thank you and please contact me if you have any questions."
    + "<br /><br />"
    + "To your success,"
    + "<br /><br />"
    + "Lex Sisney"
    + "<br />"
    + "<a href=\"http://www.OrganizationalPhysics.com\" target=\"_blank\">Organizational Physics</a>"
    + "<br />"
    + "805-886-6400";
  
  return templateMessage.replace("%simplename%", simpleName);
}


function emailAdminForFailures(rows){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Score");
  var admin_email = Session.getEffectiveUser().getEmail();
  var templateMessage = "Following rows failed the checksum test."
  + "<br /> Please manually verify the results and run 'Get Report' command from menu."
  + "<br /><br />"
  for (var i = 0 ; i < rows.length ; i++){
   var row = sheet.getRange(rows[i], 1, 1, 7).getValues()[0];
    templateMessage += ""
      +   "<b> Row :</b> " + rows[i] 
      +"<br />"
      +   "<b>Name :</b> " + row[0] + "-" + row[1] + "(" + row[3] + ")"
      +"<br /> <b>Email:</b> " + row[2]
      +"<br /><br />"  
  }
  templateMessage += "<b>Link of Spreadsheet<br />" + "<a href=\"" + SpreadsheetApp.getActiveSpreadsheet().getUrl() + "\" target=\"_blank\">"+ SpreadsheetApp.getActiveSpreadsheet().getName() + "</a></b>"
  
  GmailApp.sendEmail(admin_email, 'Failed checksum list', "", {htmlBody: templateMessage});
  
}

function logInfo(message){
 var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("report_trigger_logs");
  if(sheet == null){
   sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("report_trigger_logs") 
   sheet.getRange(1, 1).setValue("Date Time")
   sheet.getRange(1, 2).setValue("Message") 
  }
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "MM-dd-yyyy HH:mm:ss")
  var row = sheet.getLastRow() + 1;
  sheet.getRange(row, 1).setValue(formattedDate);
  sheet.getRange(row, 2).setValue(message);
  
}