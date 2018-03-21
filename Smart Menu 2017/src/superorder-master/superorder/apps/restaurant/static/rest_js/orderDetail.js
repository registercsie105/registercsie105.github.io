
var tsjson;
$(window).on('load', function () {

    // 名稱 單價 份數 總價
    $.getJSON(idFoodsJsonPath, function (data) {
        tsjson = data;
    }).done(function () {
        updateBuyList()
    });

});

function updateBuyList() {
    var mytotalprice = 0;
    $.getJSON("./orderDetail.json", function (data) {
        $("#mytablebody").empty();
        $("#totalPrice").empty();
        $.each(data, function (i, item) {
            var myfood = tsjson[item.id];
            var myname = myfood.name;
            var myprice = myfood.price;
            var mycount = item.count;
            var myscount = item.scount;
            var mytprice = parseFloat(myfood.price) * item.count;
            mytotalprice += mytprice;

            $("#mytablebody").append(maketable(myname, myprice, mycount, myscount, mytprice));
        });
    }).done(function () {
        $("#totalPrice").append(maketotal(mytotalprice));
    }).always(function () {
        setTimeout(updateBuyList, 5000);
    });
}

function maketotal(totalprice) {
    var myhtml =
        '<hr>' +
        '<strong class="totalfont pull-right">' +
        '總共 : ' + totalprice + '元' +
        '</strong>';

    return myhtml;
}


function maketable(name, price, count, scount, tprice) {
    var myhtml =
        '<tr class="text-center">' +
        '<td class="scrolltd">' + name + '</td>' +
        '<td>' + price + '</td>' +
        '<td>' + count + '</td>' +
        '<td class="servecount">' + scount + '</td>' +
        '<td>' + tprice + '</td>' +
        '</tr>'

    return myhtml;
}
