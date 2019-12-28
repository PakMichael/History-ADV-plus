logsStorage = window.localStorage;


writeToLocalStorage = (logs) => {
  const rawStorage = logsStorage.getItem('advHistoryLogs');
  const existingLogs = rawStorage !== null ? JSON.parse(rawStorage) : [];

  logsStorage.setItem('advHistoryLogs', JSON.stringify([...existingLogs, logs]));
}

function handleMessage(msg, tabId) {
  const timestamp = Math.floor(Date.now() / 1000);

  const offset = `\n${timestamp}, ${tabId}`;
  let eventTag = msg.split('-')[1];
  let eventTagParams = '';

  browser.tabs.get(tabId).then(
    (value) => {
      switch (msg) {
        case "tab-urlChangedTo":
          eventTagParams = `${value.url}`;
          break;
        case "tab-titleChangedTo":
          eventTagParams = `${value.title.replace(/,/g, "")}`;
          break;
        case "tab-audibleChangedTo":
          eventTagParams = `${value.audible}`;
          break;
        case "tab-mutedChangedTo":
          eventTagParams = `${value.mutedInfo.muted}`;
          break;
      }

      if (eventTag !== undefined) writeToLocalStorage(`${offset}, ${eventTag}, ${eventTagParams.trim()}`);
      console.log(`${offset}, ${eventTag}, ${eventTagParams.trim()}`);
    }
  ).catch(
    (reason) => {
      if (eventTag !== undefined) writeToLocalStorage(`${offset}, ${eventTag}, ${eventTagParams.trim()}`);
      console.log(`${offset}, ${eventTag}, ${eventTagParams.trim()}`);
    }
  );


}

onUpdatedListener = (tabId, changeInfo, tabInfo) => {
  let msg = "";
  if (changeInfo.url) msg = "tab-urlChangedTo";
  if (changeInfo.title) msg = "tab-titleChangedTo";
  if (changeInfo.audible) msg = "tab-audibleChangedTo";
  if (changeInfo.mutedInfo) msg = "tab-mutedChangedTo";
  if (msg.length > 0) handleMessage(msg, tabId);
}

browser.tabs.onCreated.addListener((tab) => {
  handleMessage("tab-created", tab.id)
});
browser.tabs.onRemoved.addListener((tabId) => {
  handleMessage("tab-removed", tabId)
});
browser.tabs.onActivated.addListener((activeInfo) => {
  handleMessage("tab-activated", activeInfo.tabId)
});
browser.runtime.onStartup.addListener(() => {
  handleMessage('tab-browserStarted')
});
browser.tabs.onUpdated.addListener(onUpdatedListener);
window.addEventListener('unload', () => {
  handleMessage('tab-browserClosed')
});


browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({
    "url": "/index.html"
  });
});