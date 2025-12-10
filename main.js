import { app, BrowserWindow, dialog, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import serve from 'electron-serve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadURL = serve({ directory: 'out' });

// Set App User Model ID for Windows Notifications
app.setAppUserModelId('com.hydroflow.app');

let mainWindow;
let tray = null;
let isQuitting = false;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'public/icons/icon.png')
  });

  const isDev = !app.isPackaged;

  try {
    if (isDev) {
      await mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
    } else {
      await loadURL(mainWindow);
    }
  } catch (e) {
    console.error('Failed to load app:', e);
    dialog.showErrorBox('Application Error', 'Failed to load application resources.\n' + e.message);
  }

  // Intercept close event to minimize to tray
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'public/icons/icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath);

  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip('Water Tracker');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => mainWindow.show()
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  // Do not quit on window close (handled by tray)
  if (process.platform !== 'darwin') {
    // app.quit(); // We want to keep running
  }
});
