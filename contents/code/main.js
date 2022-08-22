/*
# vim:tabstop=4:shiftwidth=4:noexpandtab
*/

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

function isActive(client) {
	return client === workspace.activeClient;
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

function show(client) {
	client.minimized = false;
}

function hide(client) {
	client.minimized = true;
}

function toggleAlacritty() {
	let alacritty = findAlacritty();
	if ( alacritty ) {
		if ( isVisible(alacritty) ) {
			if ( isActive(alacritty) ) {
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
	if ( isAlacritty(client) ) {
		setupClient(client);
		printClient(client);
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

