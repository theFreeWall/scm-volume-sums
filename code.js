/* ------------------------------------------------------ */
/*                      Settings                          */
/* ------------------------------------------------------ */

maxHistory = 33;  //recommended: 1080p = 33 / 1440p = 48
emptyStartLine = true;

/* ------------------------------------------------------ */

url = window.location.href;

if(url.match("steamcommunity.com/market/listings")){

  function steamDate(volvoplz){
    return new Date(volvoplz.substring(0,15) + "00:00 GMT" + volvoplz.substring(volvoplz.length-2)); 
  }

  function getActiveScript(){
    var s;
    s=document.getElementsByTagName('script');
    return s[s.length - 1];
  }

  activeScripts = getActiveScript().outerHTML;

  historyPositionStart = activeScripts.indexOf("line1=") + 6;
  historyMidSection = activeScripts.substring(historyPositionStart);
  historyPositionEnd = historyMidSection.indexOf(";");

  saleHistory = historyMidSection.substring(0, historyPositionEnd);

  saleHistory = jQuery.parseJSON(saleHistory);
  saleHistoryCount = Object.keys(saleHistory).length;
  newHistory = new Array;

  saleHistory[saleHistoryCount] = ["LST XX XXXX XX: +0", 0, 0];
  hourIndex = saleHistory[0][0].indexOf(":");

  i = 0;
  n = 0;

  while (i <= saleHistoryCount-1){

    if(newHistory[n] == undefined)
      newHistory[n] = [0,0,0,0];

    if(saleHistory[i][0].substring(0,hourIndex-2) == saleHistory[i+1][0].substring(0,hourIndex-2)){
        newHistory[n][1] += parseFloat(saleHistory[i][1]);
        newHistory[n][2] += parseFloat(saleHistory[i][2]); 
        newHistory[n][3] += 1;
    }
    else{
        newHistory[n][0] = saleHistory[i][0];
        newHistory[n][1] += parseFloat(saleHistory[i][1]);
        newHistory[n][2] += parseFloat(saleHistory[i][2]);  

        if(newHistory[n][3] != 0){
          newHistory[n][3] += 1;
          newHistory[n][1] = (newHistory[n][1]/(newHistory[n][3]));
        }

        if(newHistory[n][0].substring(hourIndex-2,hourIndex) != "01")
          newHistory[n][0] = newHistory[n][0].substring(0,hourIndex-2) + "01" + newHistory[n][0].substring(hourIndex);

        n++;
    }
    i++;
  }

  i = saleHistoryCount - 1;
  last24hrs = ["Last 24 hours",0,0,0];

  dateNow = new Date();
  dateNow.setHours(dateNow.getHours() - 24);

  while (i >= saleHistoryCount-1-24){
    if(steamDate(saleHistory[i][0]) > dateNow){
      last24hrs[1] += parseFloat(saleHistory[i][1]);
      last24hrs[2] += parseFloat(saleHistory[i][2]); 
      last24hrs[3] += 1;
    }
    i--;
  }

  /* Returning volume history */

  n = newHistory.length-1;

  if(emptyStartLine == true) console.log("\n\n");
  console.log("========================");
  console.log("Last 24 hours \t\t\t\t\t\t\t\t\t\t\t\t\t\t" + "[" + last24hrs[2] + "]");

  while (n >= newHistory.length-maxHistory) {
    if(newHistory[n] == undefined) break;
    console.log(steamDate(newHistory[n][0]) + "\t[" + newHistory[n][2] + "]");
    if(n == newHistory.length-1)                  console.log("========================");
    if(steamDate(newHistory[n][0]).getDay() == 1) console.log("------------------------");
    n--;
  }
}