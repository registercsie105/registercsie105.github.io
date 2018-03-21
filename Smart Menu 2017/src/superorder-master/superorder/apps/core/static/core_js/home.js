// wow
new WOW().init();


// ajax load resturent
$(document).ready(function()
{
    $.getJSON("/lib/resturent_name.json",function(data){
        $.each(data, function(i, item) {
            if(i%3 === 0){
                $("#partner_list").append("<div class=\"row wow fadeIn\">\n</div></br>\n");
            }
            var r = "";
            r += "<a href='/r/" + item.url + "' >";
            r += "<div class=\"col-xs-4 text-center imgframe\">\n";
            r += "<h4>" + item.name + "</h4>";
            if(item.logo){
                r += "<img src=\"/media/" + item.logo + "\">\n";
            }else{
                r += "<img src=\"/static/core_img/no-logo.jpg\">\n";
            }
            r += "</div></a>\n";
            $("#partner_list > div:last").append(r);
            setImages();
        });
    });
});

$(document).ready(function () {
    $(window).resize(function (){
        setImages();
    });
});

function setInnerImage(img, fixedmin){
    var naturalWidth = img.naturalWidth;
    var naturalHeight = img.naturalHeight;

    if (naturalHeight > naturalWidth) {
        img.style.width = 'auto';
        img.style.height = fixedmin + 'px';
    }
    else {
        img.style.width = fixedmin + 'px';
        img.style.height = 'auto';

        var currentHeight = img.height;
        var diff = (fixedmin - currentHeight) / 2;
        img.style.paddingTop = diff + 'px';
    }
}

function setImages(){
    var mydiv = $(".imgframe");
    var divWidth = mydiv.width() + 40;
    var h4height = $(".imgframe > h4").height();
    var fixedmin = divWidth - 40 - h4height - 10;
    $(mydiv).css({ "height": divWidth + "px" });

    var imgs = $(".imgframe > img");

    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].complete) {
            setInnerImage(imgs[i], fixedmin)
        }else{
            imgs[i].onload = function () {
                setInnerImage(this, fixedmin);
            }
        }
    }
}

// footer
$(document).ready(function()
{
    $('[data-toggle="tooltip"]').tooltip();
    $(".navbar a, footer a[href='#home']").on('click', function(event)
    {
        if (this.hash !== "")
        {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 900, function(){
            window.location.hash = hash;
            });
        }
    });
});