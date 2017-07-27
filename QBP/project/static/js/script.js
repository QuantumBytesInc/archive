$(document).ready(function(){

  //global
  var global = {};
  global.scrollToTop = function(time){
    $("html, body").animate({ scrollTop: 0 }, time);
  }

  // mobile navigation button
  $("#mobile_navi_button").click(function(){
    $("#mobile_navi").stop(0,1).slideToggle(400);
  });

  
  function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken') );
          }
      }
  });

  // click form submit
  $("form .submit-btn").click(function(e){
    $("form .submit-btn").addClass("pending");
    $.ajax({
      method : "POST",
      url : "/send_request/",
      data : {
        name : $("form input.name").val(),
        email : $("form input.email").val(),
        message : $("form textarea.message").val()
      }
    }).done(function(e){
      $(".form_notification").hide();
      switch(e){
        case "success" : 
          $(".form_wrapper").hide();
          $(".form_success").show();
        break;
        case "invalid" : 
          $(".form_error_email").show();
        break;
      }
    }).fail(function(e){
        $(".form_notification").hide();
        $(".form_error_technical").show();
    }).always(function(e){
      $("form .submit-btn").removeClass("pending");
    });
  });
  
  //contact form
  $(".suprform input[type='text'], .suprform textarea").each(function(){
    if($(this).val()) $(this).parents(".line").addClass("active");
  });

  // text input
  $("input, textarea").focus(function(){
    $(this).parents(".line").addClass("active");
  });
  $("input, textarea").focusout(function(){
    if(!$(this).val()) $(this).parents(".line").removeClass ("active");
  });

  // scroll navigation
  (function(){
    var animation1 = false;
    //
    $(window).scroll(function(){
      var scrollTop = $(window).scrollTop();
      var headerHeight = 90;
      var limit_1 = headerHeight;
      if(scrollTop > limit_1) {
        if(!animation1){
          animation1 = true;
          $("#header").css("top", "-70px");
          $("#header").stop(0,1).animate({"top":0}, 300, function(){});
        }
        $(".roa_main").addClass("fixed_header");
      }
      else {
        animation1 = false;
        $(".roa_main").removeClass("fixed_header");
      }
      /*$("#navi ul li:first-child a").css("position","fixed");
      $("#navi ul li:first-child a").text(scrollTop);*/
    });
  })();

  // teamdetail
  (function assignTeamColors(){
    var colors = [
      "rgba(95, 16, 22, 0.682353)",
      "rgba(204, 41, 40, 0.682353)",
      "rgba(210, 99, 44, 0.682353)",
      "rgba(199, 32, 85, 0.682353)",
      "rgba(92, 181, 48, 0.682353)",
      "rgba(44, 155, 236, 0.682353)",
      "rgba(37, 12, 134, 0.682353)",
      "rgba(177, 27, 157, 0.682353)",
      "rgba(74, 156, 134, 0.682353)",
      "rgba(120, 83, 152, 0.682353)",
      "rgba(144, 136, 28, 0.682353)",
      "rgba(51, 154, 9, 0.682353)"
    ];
    //
    $(".roa_content .team_member").each(function(i){
      var color = colors[i];
      $(this).attr("color", color);
      $(this).find(".overlay .icon").css("background", color);
    });
  })();//end func
  $(".roa_content .team_member").click(function(){
    global.scrollToTop(100);
    var name = $(this).find(".name").text();
    var imgname = $(this).find(".team_img").attr("src");
    var role = $(this).attr("role");
    var description = $(this).attr("description") || "";
    var color = $(this).attr("color");
    $(".roa_content .team_detail").removeClass("hide");
    $(".roa_content .team_detail .name").text(name);
    $(".roa_content .team_detail .description").text(description);
    $(".roa_content .team_detail .img_wrap > img").attr("src", imgname);
    $(".roa_content .team_detail .color_circle .title").html(role);
    $(".roa_content .team_detail .color_circle .title").css("color", color);
    $(".roa_content .team_detail .color_circle").css("border", "2px solid "+color);
    $(".roa_content .team").addClass("hide");
    (function alignRoleText(){
      $(".roa_content .team_detail .color_circle .title").css("opacity", "0");
      window.setTimeout(function(){
        var title = $(".roa_content .team_detail .color_circle .title");
        var w = $(title).width();
        var h = $(title).height();
        var cw = 118;
        var ch = 110;
        $(title).css("opacity", "1");
        $(title).css("left", cw-w/2);
        $(title).css("top", ch-h/2);
      },500);
    })();
  });
  $(".roa_content .team_detail .overview_btn").click(function(){
    $(".roa_content .team").removeClass("hide");
    $(".roa_content .team_detail").addClass("hide");
  });
});
