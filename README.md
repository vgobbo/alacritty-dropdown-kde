# Alacritty Dropdown
Win script that adds drop-down feature to Alacritty.

*Works only on KDE.*

## Requirements
- KDE Plasma >= 5.22
- KDE Frameworks >= 5.85
- Qt >= 5.15
- Alacritty >= 0.8

Requirements are based on the version which I am running, so it might work on earlier versions of the afore mentioned components.

## Installing
- Clone somewhere and `cd` into:
```bash
git clone git@github.com:vgobbo/alacritty-dropdown-kde.git
cd alacritty-dropdown-kde
```

- Feel free you inspected the code, so nothing weird is being added to your computer ;D

- Install:
```bash
kpackagetool5 --type=KWin/Script -i .
```

If you are upgrading, use:
```bash
kpackagetool5 --type=KWin/Script -u .
```

- Enable by pressing `Alt+F2`, typing _KWin Scripts_ and selecting _Alacritty Drop-Down_ in the script list.

## Debugging
The preferred way is through `wm console`, according to KDE documentation. But it didn't work for me, so I relied on `journalctl` for debugging:
```bash
journalctl -f -t kwin_x11
```

Adapt it to Wayland if needed.
