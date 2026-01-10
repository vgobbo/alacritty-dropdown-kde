/*
# vim:tabstop=4:shiftwidth=4:noexpandtab
*/

var firstRun = true;
var heightPer = 90;
var widthPer = 90;

function isAlacritty(client) {
	return client && !client.deleted && client.normalWindow && client.resourceName.toString() === "alacritty";
}

function findAlacritty() {
	let clients = workspace.windowList();
	return clients.find(client => isAlacritty(client)) || null;
}

function isVisible(client) {
	return !client.minimized;
}

function isActive(client) {
	return client === workspace.activeWindow;
}

function activate(client) {
	workspace.activeWindow = client;
	if (firstRun) {
		resizeBasedOnScreenArea(client, 90, 90);
		firstRun = false;
	}
}

function setupClient(client) {
	print("setupClient");
	client.onAllDesktops = true;
	client.skipTaskbar = true;
	client.skipSwitcher = true;
	client.skipPager = true;
	client.keepAbove = true;
	client.fullScreen = false;
	var previousScreen = client.output.name;
	//initial resize
	client.clientGeometryChanged.connect(function () {
		var currentScreen = client.output.name;
		if (previousScreen !== currentScreen) {
			resizeBasedOnScreenArea(client, heightPer, widthPer);
			previousScreen = client.output.name;
		}
	});
	printClient(client);
}

function printClient(client) {
	print("resourceName=" + client.resourceName.toString() +
		";normalWindow=" + client.normalWindow +
		";onAllDesktops=" + client.onAllDesktops +
		";skipTaskbar=" + client.skipTaskbar +
		";skipSwitcher=" + client.skipSwitcher +
		";skipPager=" + client.skipPager +
		";keepAbove=" + client.keepAbove +
		";fullScreen=" + client.fullScreen +
		"");
}

function getCursorScreen() {
	// Get current mouse position
	var cursorPos = workspace.cursorPos;
	var targetScreen = -1;
	// Check each screen's geometry to find where the cursor is
	for (var i = 0; i < workspace.screens.length; ++i) {
		var screenGeom = workspace.clientArea(KWin.ScreenArea, workspace.screens[i], workspace.currentDesktop);
		if (cursorPos.x >= screenGeom.x && cursorPos.x < screenGeom.x + screenGeom.width &&
			cursorPos.y >= screenGeom.y && cursorPos.y < screenGeom.y + screenGeom.height) {
			targetScreen = workspace.screens[i];
			break;
		}
	}
	return targetScreen;
}

function moveclientToScreen(client, targetScreen) {
	if (client && client.moveable) {
		// Move the window if target screen is valid and different from current
		if (targetScreen !== -1 && targetScreen !== client.screen) {
			workspace.sendClientToScreen(client, targetScreen);
		}
	}
}

function resizeBasedOnScreenArea(client, widthPercent, heightPercent) {
	if (client && client.moveable) {
		// Get the available screen area for the client's monitor
		var area = workspace.clientArea(0, client);

		// Calculate new dimensions 
		var newWidth = area.width * (widthPercent / 100);
		var newHeight = area.height * (heightPercent / 100);

		// Center horizontally: Add area.x to offset from the left monitors
		var newX = area.x + ((area.width - newWidth) / 2);

		// Center vertically: Add area.y to offset from the top monitors
		// This fixes the issue on vertically stacked monitors
		var newY = area.y + ((area.height - newHeight) / 2);

		// Update the window geometry (centered)
		client.frameGeometry = {
			x: newX,
			y: newY,
			width: newWidth,
			height: newHeight
		};
	}
}

function show(client) {
	client.minimized = false;
}

function hide(client) {
	client.minimized = true;
}

function toggleAlacritty() {
	let alacritty = findAlacritty();
	if (alacritty) {
		moveclientToScreen(alacritty, getCursorScreen());
		if (isVisible(alacritty)) {
			if (isActive(alacritty)) {
				hide(alacritty);
			} else {
				activate(alacritty);
			}
		} else {
			show(alacritty);
			activate(alacritty);
		}
	}
}

function setupAlacritty(client) {
	if (isAlacritty(client)) {
		setupClient(client);
		printClient(client);
	}
}

function init() {
	let alacritty = findAlacritty();
	if (alacritty) {
		setupClient(alacritty);
	}

	workspace.windowAdded.connect(setupAlacritty);
	registerShortcut("Alacritty Toggle", "Toggle Alacritty open/closed.", "Meta+F12", toggleAlacritty);
}

init();