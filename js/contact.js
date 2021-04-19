window.addEventListener('load', function() {
    $(document).ready(function () {
        var typing_animation = {
            width: '10em'
        }
        var respone_animation = {
            opacity: '1'
        }
    
        $("#contact-command").addClass("typed")
        $("#contact-command").animate(typing_animation, 1700, () => {
            $("#show-contact").animate(respone_animation, 200)
            $("#contact-form").animate(respone_animation, 200)
            $("#navigation-date").animate(respone_animation, 200)
            $("#show-navigation").animate(typing_animation, 1700, () => {
                $("#nav-menu").animate(respone_animation, 200)
            })
        })
    
        console.log("Loaded contact page javascript")
    })
    });    