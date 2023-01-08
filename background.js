async function getForcedDarkModeTabIds() {
  let { forcedDarkModeTabIds } = await chrome.storage.local.get(
    'forcedDarkModeTabIds'
  )
  if (!forcedDarkModeTabIds) forcedDarkModeTabIds = []
  return forcedDarkModeTabIds
}

function setForcedDarkModeTabIds(forcedDarkModeTabIds) {
  chrome.storage.local.set({ forcedDarkModeTabIds })
}

function setIcon(on = true) {
  chrome.action.setIcon({
    path: on ? 'icons/on.png' : 'icons/off.png',
  })
}

chrome.action.onClicked.addListener(async (tab) => {
  const forcedDarkModeTabIds = await getForcedDarkModeTabIds()
  if (!forcedDarkModeTabIds.includes(tab.id)) {
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['dark-mode.css'],
    })

    setForcedDarkModeTabIds([...forcedDarkModeTabIds, tab.id])
    setIcon(true)
  } else {
    chrome.scripting.removeCSS({
      target: { tabId: tab.id },
      files: ['dark-mode.css'],
    })

    setForcedDarkModeTabIds(forcedDarkModeTabIds.filter((id) => id !== tab.id))
    setIcon(false)
  }
})

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const forcedDarkModeTabIds = await getForcedDarkModeTabIds()
  if (forcedDarkModeTabIds.includes(tabId)) {
    setIcon(true)
  } else {
    setIcon(false)
  }
})
