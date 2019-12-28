logsStorage = window.localStorage;

let logsBlob = new Blob(["Timestamp, tab_id, eventTag, parameters,", JSON.parse(logsStorage.getItem('advHistoryLogs'))], {
  type: 'application/json'
})

let exportBtn = document.getElementById("export");
exportBtn.setAttribute("href", URL.createObjectURL(logsBlob));
exportBtn.setAttribute("download", "advHistoryLogs.csv");



timestampToDateStr = (timestamp) => {
  var date = new Date(parseInt(timestamp) * 1000);

  var hours = ("0" + date.getHours()).substr(-2);
  var minutes = ("0" + date.getMinutes()).substr(-2);

  return hours + ':' + minutes + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

}


let writesCounter = 0;
writeToLog = (text) => {
  let historyLogs = document.getElementById("history-logs");
  let tr = document.createElement("tr");

  let tdIndex = document.createElement("td");
  tdIndex.innerText = writesCounter;
  tr.appendChild(tdIndex);
  writesCounter += 1;

  text.split(',').forEach((value, index) => {
    let td = document.createElement("td");
    td.innerText = `${value.trim().substr(0,120)}`;
    tr.appendChild(td);
  });

  historyLogs.appendChild(tr);

  // I wanted a clickable link
  // <td><a href/></td> was destroying the look
  // so I made <td><a href><td>link text</td></a></td>
  // consider it a hack

  if (tr.children.item(3).innerText === 'urlChangedTo') {

    let urlElm = document.createElement("a");
    urlElm.setAttribute('href', tr.children.item(4).innerText)

    let td = document.createElement("td");
    td.innerText = tr.children.item(4).innerText;
    urlElm.appendChild(td);

    tr.children.item(4).remove();

    let tdOuter = document.createElement("td");
    tdOuter.appendChild(urlElm);
    tr.appendChild(tdOuter);
  }
  tr.children.item(1).innerText = timestampToDateStr(tr.children.item(1).innerText);
}


let allL = JSON.parse(logsStorage.getItem('advHistoryLogs'));

allL.forEach((value, index) => {
  writeToLog(value)
});