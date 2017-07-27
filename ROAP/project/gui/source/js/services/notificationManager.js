function NotificationManager($rootScope, $timeout) {

    return {
        showNotification: showNotification
    };

    /*
     @function showNotification
     Displays a notification in the MainController using the $rootScope.
     */
    function showNotification(msg, type, lifetime) {


        var notificationEl = $(".notification_wrapper .notification");
        if (type == "success") {
            notificationEl.removeClass("error");
        }
        else {
            notificationEl.addClass("error");
        }

        notificationEl.html(msg)
        $("html, body").animate({scrollTop: 0}, 200);
        $(".notification_wrapper").fadeIn();
        setTimeout(function () {
            $(".notification_wrapper").fadeOut();
        }, 3000);
        /* $("html, body").animate({ scrollTop: 0 }, 200);
         $timeout(function(){
         $(".notification_wrapper .notification").animate({"top": "-45px"}, 400, function(){
         $rootScope.showNotification = false;
         $rootScope.$digest();
         $(".notification_wrapper .notification").css("top", "-4px");
         });
         }, lifetime);*/
    }

}
