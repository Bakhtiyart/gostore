$( document ).ready(function() {
    
    $('#menu .hamburger').click(function(){
        if($(this).hasClass('is-active')){
            $(this).removeClass('is-active');
        }
        else{
            $(this).addClass('is-active');
        }
    });
});