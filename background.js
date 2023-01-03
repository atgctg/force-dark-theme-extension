chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get('darkModeEnabled').then((data) => {
    if (!data.darkModeEnabled) {
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['dark-mode.css'],
      })
      chrome.action.setIcon({
        path: 'icons/on.png',
      })
      chrome.storage.local.set({ darkModeEnabled: true })
    } else {
      chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        files: ['dark-mode.css'],
      })
      chrome.action.setIcon({
        path: 'icons/off.png',
      })
      chrome.storage.local.set({ darkModeEnabled: false })
    }
  })
})
