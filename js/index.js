var DEBUG_FLAG = 1

///debugPrint prints the debug message if program is run in debugmode
function debugPrint(message) {
    if (DEBUG_FLAG == 1) {
        console.log(message)
    }
}

//setUpNavMenu sets up the click listener for the mobile navigation menu
function setUpNavMenu() {
    const mobile_nav_menu = document.getElementById("mobile-nav-menu")
    const nav_icon = document.getElementById("nav-icon")
    mobile_nav_menu.style.visibility = "hidden"

    //Opens the navigation menu if it is clicked
    nav_icon.onclick = function () {
        const current_visibility = mobile_nav_menu.style.visibility.toString()
        mobile_nav_menu.style.visibility = (current_visibility == "hidden") ? "visible":"hidden"
        debugPrint("Nav menu made " + mobile_nav_menu.style.visibility.toString())
    }
}

setUpNavMenu()