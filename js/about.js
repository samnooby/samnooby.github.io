window.addEventListener('load', function() {
    $(document).ready(function () {
        var typing_animation = {
            width: '10em'
        }
        var respone_animation = {
            opacity: '1'
        }
    
        $("#about-command").addClass("typed")
        $("#about-command").animate(typing_animation, 1700, () => {
            $("#response").animate(respone_animation, 200)
            $("#portrait").animate(respone_animation, 200)
            $("#navigation-date").animate(respone_animation, 200)
            $("#show-navigation").animate(typing_animation, 1700, () => {
                $("#nav-menu").animate(respone_animation, 200)
            })
        })
    
        console.log("Loaded about page javascript")
    })
    });    