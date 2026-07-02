const path = require('node:path')
const { app, BrowserWindow, shell } = require('electron')
const { WINDOW_OPTIONS } = require('./window-options.cjs')

function openExternalUrl(url) {
  try {
    const protocol = new URL(url).protocol
    if (protocol === 'https:' || protocol === 'http:') void shell.openExternal(url)
  } catch {
    // Ignore malformed links rather than navigating the desktop window.
  }
}

function createWindow() {
  const window = new BrowserWindow(WINDOW_OPTIONS)

  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url)
    return { action: 'deny' }
  })
  window.webContents.on('will-navigate', (event, url) => {
    if (url === window.webContents.getURL()) return
    event.preventDefault()
    openExternalUrl(url)
  })
  window.once('ready-to-show', () => window.show())
  void window.loadFile(path.join(__dirname, '../dist/index.html'))
}

app.setAppUserModelId('com.zijian.textlayout')
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
