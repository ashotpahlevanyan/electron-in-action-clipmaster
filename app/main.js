const path = require('path');
const {
	app,
	Menu,
	Tray,
	systemPreferences
} = require('electron');

const getIcon = () => {
	if(process.platform === 'win32') {
		return 'icon-light@2x.ico';
	}
	if(systemPreferences.isDarkMode()) {
		return 'icon-light.png';
	}
	return 'icon-dark.png';
};

let tray = null;

app.on('ready', () => {
	tray = new Tray(path.join(__dirname, getIcon()));
	if(process.platform === 'win32') {
		tray.on('click', tray.popUpContextMenu);
	}

	if(app.dock) { app.dock.hide(); }
	const menu = Menu.buildFromTemplate([
		{
			label: 'Quit',
			click() { app.quit(); }
		}
	]);

	tray.setToolTip('Clipmaster');
	tray.setContextMenu(menu);
});


