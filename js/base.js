//setUpNavMenu sets up the click listener for the mobile navigation menu
function setUpNavMenu() {
    const mobile_nav_menu = document.getElementById("mobile-nav-menu")
    const nav_icon = document.getElementById("nav-icon")
    mobile_nav_menu.style.visibility = "hidden"

    //Opens the navigation menu if it is clicked
    nav_icon.onclick = function () {
        const current_visibility = mobile_nav_menu.style.visibility.toString()
        mobile_nav_menu.style.visibility = (current_visibility == "hidden") ? "visible":"hidden"
        setTimeout(() => {
            mobile_nav_menu.style.visibility = "hidden"
        }, 5000);
    }
}

window.addEventListener('load', function() {
    $(document).ready(function () {
        
        setUpNavMenu()
        var today = new Date()
        $(".command-date").text(today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear())
        
        console.log("Loaded base javascript")
    })
    });    