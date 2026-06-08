const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
        width: 1000,
        height: 650,
        autoHideMenuBar: true,
    });

    // Nếu app đã được đóng gói (production), thì load file index.html trong thư mục dist
    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        // Đang code (development) thì load localhost
        win.loadURL('http://localhost:5173');
    }
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
