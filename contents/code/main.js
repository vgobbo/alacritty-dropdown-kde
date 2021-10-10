function isAlacritty(client) {
	return client && !client.deleted && client.normalWindow && client.resourceName.toString() === "alacritty";
}

function findAlacritty() {
	let clients = workspace.clientList();
	return clients.find(client => isAlacritty(client)) || null;
}

function isVisible(client) {
	return !client.minimized;
}

function activate(client) {
	workspace.activeClient = client;
}

function setupClient(client) {
	print("setupClient");
	client.onAllDesktops = true;
	client.skipTaskbar = true;
	client.skipSwitcher = true;
	client.skipPager = true;
	client.keepAbove = true;
	// client.setMaximize(true, true);
	client.fullScreen = true;
}

function toggleClient(client) {
	print("toggleClient");
	client.minimized = !client.minimized;
}

function toggleAlacritty() {
	print("toggleAlacritty");
	let alacritty = findAlacritty();
	if ( alacritty ) {
		toggleClient(alacritty);
		if ( isVisible(alacritty) ) {
			activate(alacritty);
		}
	}
}

function setupAlacritty(client) {
	print("setupAlacritty");
	if ( isAlacritty(client) ) {
		setupClient(client);
	}
}

function init() {
	let alacritty = findAlacritty();
	if ( alacritty ) {
		setupClient(alacritty);
	}

	workspace.clientAdded.connect(setupAlacritty);
	registerShortcut("Alacritty Toggle", "Toggle Alacritty open/closed.", "Meta+F12", toggleAlacritty);
}

init();