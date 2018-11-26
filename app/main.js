const path = require('path');
const {
	app,
	Menu,
	Tray,
	clipboard,
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

const clippings = [];
let tray = null;

app.on('ready', () => {
	tray = new Tray(path.join(__dirname, getIcon()));
	if(process.platform === 'win32') {
		tray.on('click', tray.popUpContextMenu);
	}

	if(app.dock) { app.dock.hide(); }
	updateMenu();
	tray.setToolTip('Clipmaster');
});

const updateMenu = () => {
	const menu = Menu.buildFromTemplate([
		{
			label: 'Create New Clipping',
			click() { addClipping(); },
			accelerator: 'CommandOrControl+Shift+C'
		},
		{ type: 'separator' },
		...clippings.slice(0, 10).map(createClippingMenuItem),
		{ type: 'separator' },
		{
			label: 'Quit',
			click() { app.quit(); },
			accelerator: 'CommandOrControl+Q'
		}
	]);

	tray.setContextMenu(menu);
};

const addClipping = () => {
	const clipping = clipboard.readText();
	if(clippings.includes(clipping)) return;
	clippings.unshift(clipping);
	updateMenu();
	return clipping;
};

const createClippingMenuItem = (clipping, index) => {
	return {
		label: clipping.length > 20
		? clipping.slice(0, 20) + '...' : clipping,
		click(){ clipboard.writeText(clipping); },
		accelerator: `CommandOrControl+${index}`
	}
};
