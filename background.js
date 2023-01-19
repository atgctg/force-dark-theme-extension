function isDisallowedUrl(tab) {
  const disallowedUrls = ['chrome://', 'https://chrome.google.com']
  return disallowedUrls.some((url) => tab.url?.startsWith(url))
}

async function getForcedDarkModeUrls() {
  let { forcedDarkModeUrls } = await chrome.storage.local.get(
    'forcedDarkModeUrls'
  )
  if (!forcedDarkModeUrls) forcedDarkModeUrls = []
  return forcedDarkModeUrls
}

function setForcedDarkModeUrls(forcedDarkModeUrls) {
  chrome.storage.local.set({ forcedDarkModeUrls })
}

chrome.action.onClicked.addListener(async (tab) => {
  if (isDisallowedUrl(tab)) return

  const forcedDarkModeUrls = await getForcedDarkModeUrls()
  const urlOrigin = new URL(tab.url).origin

  if (!forcedDarkModeUrls.includes(urlOrigin)) {
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['dark-mode.css'],
    })

    setForcedDarkModeUrls([...forcedDarkModeUrls, urlOrigin])
  } else {
    chrome.scripting.removeCSS({
      target: { tabId: tab.id },
      files: ['dark-mode.css'],
    })

    setForcedDarkModeUrls(forcedDarkModeUrls.filter((url) => url !== urlOrigin))
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (isDisallowedUrl(tab)) return

  console.log('tab updated', tabId, changeInfo, tab)
  if (!tab || !tab.url) return
  if (changeInfo.status === 'loading') {
    const forcedDarkModeUrls = await getForcedDarkModeUrls()
    const tabUrlOrigin = new URL(tab.url).origin
    if (forcedDarkModeUrls.includes(tabUrlOrigin)) {
      chrome.scripting.insertCSS({
        target: { tabId },
        files: ['dark-mode.css'],
      })
    } else {
      chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        files: ['dark-mode.css'],
      })
    }
  }
})
