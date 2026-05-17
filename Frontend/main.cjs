const { app, BrowserWindow } = require('electron');

function createWindow () {
    // Tạo một cửa sổ Desktop
    const win = new BrowserWindow({
        width: 1000,
        height: 650,
        autoHideMenuBar: true, // Giấu cái thanh File, Edit, View... cho giống app xịn
        resizable: false,      // Tạm thời khóa kích thước để form không bị méo
    });

    // Bắt cửa sổ này hiển thị cái localhost mà Vite đang chạy
    win.loadURL('http://localhost:5173');
}

// Khi Electron đã sẵn sàng thì mở cửa sổ
app.whenReady().then(() => {
    createWindow();
});

// Thoát app khi người dùng bấm dấu X
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});