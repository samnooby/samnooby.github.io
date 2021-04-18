window.addEventListener('load', function() {
$(document).ready(function () {
    var typing_animation = {
        width: '10em'
    }
    var respone_animation = {
        opacity: '1'
    }

    var cookie = decodeURIComponent(document.cookie)
    if (cookie == "") {
        $("#show-name").addClass("typed")
        $("#show-name").animate(typing_animation, 1700, () => {
            $("#info-date").animate(respone_animation, 200)
            $("#name").animate(respone_animation, 200)
            $("#portrait").animate(respone_animation, 600)
            $("#show-info").addClass("typed")
            $("#show-info").animate(typing_animation, 1700, () => {
                $("#info").animate(respone_animation, 200)
                $("#navigation-date").animate(respone_animation, 200, () => {
                    $("#show-navigation").addClass("typed")
                    $("#show-navigation").animate(typing_animation, 1700, () => {
                        $("#nav-menu").animate(respone_animation, 200)
                    })
                })
            })
        })
    } else if (cookie.split("=")[0] == "visited" && cookie.split("=")[1] == "true") {
        $("#show-name").addClass("typed")
        $("#show-name").animate(typing_animation, 1700)
        $("#portrait").animate(respone_animation, 600)
        $("#info-date").animate(respone_animation, 200)
        $("#name").animate(respone_animation, 200)
        $("#show-info").addClass("typed")
        $("#show-info").animate(typing_animation, 1700)
        $("#info").animate(respone_animation, 200)
        $("#navigation-date").animate(respone_animation, 200)
        $("#show-navigation").addClass("typed")
        $("#show-navigation").animate(typing_animation, 1700)
        $("#nav-menu").animate(respone_animation, 200)
    }






    var expire_time = new Date()
    expire_time.setTime(expire_time.getTime() + (30 * 60000))

    document.cookie = "visited=true; secure; expires=" + expire_time.toUTCString()
    console.log("Loaded home page javascript")
})
});
