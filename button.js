function buildFromString(htmlString) {
    var dummy = document.createElement('div')
    dummy.innerHTML = htmlString
    return dummy.firstChild
};

delete_button_code = '<button id=\"button\" class=\"style-scope yt-icon-button custom-delete-button\" aria-label=\"Action menu\" style=\"width: var(--yt-icon-width);height: var(--yt-icon-height);fill: white;\"><svg viewBox=\"0 0 24 24\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\" style=\"pointer-events: none; display: block; width: 100%; height: 100%; fill: #ffffff;\" class=\"style-scope yt-icon\"><g class=\"style-scope yt-icon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\" class=\"style-scope yt-icon\"></path></g></svg></button>'
has_playlist = false;

previousLocation = document.location;

// Grab objects.
menu_buttons = document.querySelectorAll('.ytd-playlist-panel-video-renderer button.style-scope.yt-icon-button[aria-label="Action menu"]');
button_hitboxes = [];
delete_button = document.getElementsByClassName('style-scope ytd-menu-popup-renderer')[2];
function locateElementsOfInterest() {
    menu_buttons = document.querySelectorAll('.ytd-playlist-panel-video-renderer button.style-scope.yt-icon-button[aria-label="Action menu"]');
    console.log(menu_buttons.length + ' menu buttons detected')
    if (menu_buttons.length === 0) {
        has_playlist = false;
        console.warn('Playlist is empty!');
        setTimeout(locateElementsOfInterest, 500)
        return;
    } else {
        has_playlist = true;
    }
    button_hitboxes = [];
    for (var button of menu_buttons) {
        var hitbox = button.parentElement;
        button_hitboxes.push(hitbox);
    }
    console.log('Activiating dropdown to reveal delete button');
    menu_buttons[0].click();
    menu_buttons[0].click();
    delete_button = document.getElementsByClassName('style-scope ytd-menu-popup-renderer')[2];
    if (delete_button === undefined) {
        console.error('No delete button found! Retrying...')
        setTimeout(locateElementsOfInterest, 500)
    } else {
        console.log('Delete button located');
        editList();
    }
};

function removeExtraButtons() {
    to_remove = document.getElementsByClassName('custom-delete-button');
    whoopsies = 0;
    while (to_remove.length > 0) {
        whoopsies += 1;
        to_remove[0].remove();
        if (whoopsies>100) {
            console.error('Deletion timed out! Something is wrong with your code, idiot')
            break;
        }
    }
    console.log(document.getElementsByClassName('custom-delete-button'));
};

function deleteItem2() {
    delete_button = document.getElementsByClassName('style-scope ytd-menu-popup-renderer')[2];
    console.info('Clicking the delete button');
    delete_button.click();
    console.log('Reloading page modifiers...');
    removeExtraButtons();
    locateElementsOfInterest();
    console.log('Done!');
}


function deleteItem(event) {
    el = event.target;
    index = parseInt(el.getAttribute('index'));
    console.info('Delete button pressed, index='+index);
    console.info('Selecting the correct menu; waiting');
    menu_buttons[index].click();
    setTimeout(deleteItem2, 1);
};

function editList() {
    if (!has_playlist) {return false;}
    console.log('editMenu: disabling menu button rendering')
    for (var button of menu_buttons) {
        button.style.display = 'none';
    }
    console.log('editMenu: disabling clicking on menu button')
    index = 0
    for (var button of button_hitboxes) {
        button.style.display = 'none';
        console.log('editMenu: locating button container');
        button_container = button.parentElement;
        console.log('editMenu: adding delete button');
        button_container.append(buildFromString(delete_button_code));
        newDeleteButton = button_container.lastChild;
        newDeleteButton.setAttribute('index', index)
        newDeleteButton.addEventListener('click', deleteItem)
        index += 1
    }
};

function checkForURLChanges() {
    if (previousLocation !== document.location) {
        // Reload required.
        console.info('Page changed!');
        removeExtraButtons();
        locateElementsOfInterest();
    }
    previousLocation = document.location;
    setTimeout(checkForURLChanges, 500);
};

locateElementsOfInterest();
checkForURLChanges();
