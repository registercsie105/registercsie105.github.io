var mypanel_colors = ["info", "warning", "danger", "success"];
var mypanel_colorsLen = mypanel_colors.length;
var mycategoryArray = [];
var mycategoriesLen = [];

var shoppingitems = [];
var forhuding = [];
var myimageslist = [];


$(window).on('load', function () {
    var mycategories = $("#categories");
    var mybody = $("body");

    var Top10count = 0;

    $.getJSON(foodsJsonPath, function (data) {
        $.each(data, function (i, item) {
            var mylistText = data[i]["category"];
            var mycategoryIndex = mycategoryArray.indexOf(mylistText);
            var mycategoryID = "category" + mycategoryIndex;

            // 如果這個category還沒新增過 就把他新增進去
            if (mycategoryIndex == -1) {
                mycategoryIndex = mycategoryArray.length;
                mycategoryArray.push(mylistText);
                mycategoriesLen.push(0);
                mycategoryID = "category" + mycategoryIndex;

                mycategories.append(makeList(mycategoryIndex, mylistText, true, true)); //新增一個li到Source的ui底下
                mybody.append(makeCategory(mycategoryIndex, mylistText)); //新增一個div到Source的body底下
            }

            // 圖片資訊
            var myimageIndex = mycategoriesLen[mycategoryIndex];

            var myimageID = mycategoryID + "_" + "image" + myimageIndex;
            var myname = data[i]["name"];
            var myprice = data[i]["price"];
            var mysrc = "/media/" + data[i]["src"];
            var myintro = data[i]["intro"];
            var mytop10 = data[i]["top10"];
            var myhudingID = data[i]["id"];
            var mycategory = data[i]["category"];

            // 放圖片下去
            var category = $("#" + mycategoryID);

            category.append(makeImage(myhudingID, myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory)); //新增圖片到某個分類


            // 如果這圖片是top10 還要append top10
            if (mytop10 == true) {
                if (Top10count % 3 == 0) {
                    $(".carousel-inner").append(makeCarousel(parseInt(Top10count / 3)));
                }

                $("#carousel-inner" + parseInt(Top10count / 3)).append(maketop10(myhudingID, myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory)); //新增圖片到某個分類
                Top10count++;
            }

            mycategoriesLen[mycategoryIndex]++;

            // image setting
            ImagesSetting(myimageID, mysrc);
            myimageslist.push({ "imageID": myimageID, "src": mysrc });
        });

        // 這裡會等到json都做完 才會開始做～

    }).done(function () {

    });
});

function makeCarousel(num) {
    var active = '';
    if (num == 0) active = "active";

    var myhtml =
        '<div class="item ' + active + '">' +
        '<center id="carousel-inner' + num + '">' +

        '</center>' +
        '</div>';

    return myhtml;
}

function makeList(num, listText) {
    var listID = "list" + num;
    var panelID = "panel" + num;

    var myhtml =
        '<li id="' + listID + '">' +
        '<a href="#' + panelID + '">' + listText +
        '</a>' +
        '</li>';

    return myhtml;
}

function makeCategory(num, listText) {
    var categoryID = "category" + num;
    var categoryTitleID = "categoryTitle" + num;
    var panelID = "panel" + num;

    var myhtml =
        '<div id="' + panelID + '"' +
        'class="panel panel-' + mypanel_colors[num % mypanel_colorsLen] + '">' +
        '<div class="panel-heading">' +
        '<div class="row">' +
        '<div class="alignleft">' +
        '<strong class="panel-title" id="' + categoryTitleID + '">' + listText + '</strong>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div id ="' + categoryID + '" class="panel-body color-' + mypanel_colors[num % mypanel_colorsLen] + '">' +

        '</div>' +
        '</div>';


    return myhtml;
}

function makeImage(hudingID, imageID, name, price, src, intro, top10, category) {
    var mynum = parseInt(imageID.split("_")[0].replace("category", ""));

    var myhtml =
        '<div class="col-xs-4 text-center border-' +
        mypanel_colors[mynum % mypanel_colorsLen] + '"' +
        ' hudingid=' + hudingID +
        ' id="' + imageID + '">' +
        '<a onclick="' +
        'showAlert(' + hudingID + ",'" + imageID + "','" + name + "','" + price + "','" + src + "','" +
        intro + "'," + top10 + ');">' +
        '<img src="' + src + '" width="100%">' +
        '</a>' +
        '</div>';

    return myhtml;
}

function maketop10(hudingID, imageID, name, price, src, intro, top10, category) {
    var myhtml =
        '<a class="' + imageID + '"' +
        ' hudingid=' + hudingID +
        ' onclick="' +
        'showAlert(' + hudingID + ",'" + imageID + "','" + name + "','" + price + "','" + src + "','" +
        intro + "'," + top10 + ');">' +
        '<img src="' + src + '" class="img-circle Stories"/>' +
        '</a>';

    return myhtml;
}

function showStar(top10) {
    var myhtml = '';

    if (top10) {
        myhtml = '<span id="fullstar" class="glyphicon glyphicon-star showstar alignright"></span>';
    }
    else {
        myhtml = '<span id="emptystar" class="glyphicon glyphicon-star-empty showstar"></span>';
    }

    return myhtml;
}

function showImage(name, price, src, intro, top10) {
    var myhtml =
        '<div class="panel panel-info">' +
        '<div class="mypanel-heading">' +
        '<strong class="alignleft">' + name + '</strong>';

    if (top10) {
        myhtml += showStar(top10);
    }

    myhtml +=
        '<strong class="text-danger alignmid">' + price + '</strong>' +
        '</div>' +

        '<div class="panel-body">' +
        '<img id="img_prev" src="' + src + '" width="100%">' +
        '</div>' +

        '<div class="panel-body">' +
        '<article class="myarticle">' + intro +
        '</article>' +
        '</div>' +

        '</div>';

    return myhtml;
}

function showAlert(hudingID, imageID, name, price, src, intro, top10) {
    // 如果沒放過購物車
    if (myjsonSearch(hudingID) == -1) {
        swal(
            {
                title: '',
                html: showImage(name, price, src, intro, top10),
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#f0ad4e',
                confirmButtonText: '放購物車',
                cancelButtonText: '取消',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger'
            }).then(function () {
                swal(
                    {
                        title: '需購買的數量',
                        input: 'text',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#f0ad4e',
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        confirmButtonClass: 'btn btn-success',
                        cancelButtonClass: 'btn btn-danger'
                    }).then(function (result) {
                        var mycount = parseInt(result); // 如果是奇怪的字 parseInt 之後會變成 NaN

                        // 如果有. 代表是小數 就滾
                        // 不是奇怪的字 也不是小數 也沒有<=0 的 才能成功！
                        if (mycount <= 0 || isNaN(mycount) || result.indexOf(".") >= 0) {
                            swal
                                (
                                '數量錯誤！',
                                '請輸入大於0的整數！',
                                'error'
                                )
                        }
                        else {
                            var tprice = price * mycount;
                            shoppingitems.push({ "name": name, "price": price, "count": mycount, "tprice": tprice, "hudingID": hudingID });
                        }
                    });
            });
    }
    else {
        swal(
            {
                title: '',
                html: showImage(name, price, src, intro, top10),
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonColor: '#d9534f',
                confirmButtonText: '移出購物車',
                cancelButtonColor: '#f0ad4e',
                cancelButtonText: '取消'
                // cancelButtonClass: 'btn btn-danger'
            }).then(function () {
                var myindex = myjsonSearch(hudingID);
                shoppingitems.splice(myindex, 1);
            },
            function (dismiss) {
                if (dismiss === 'cancel') {
                }
            });
    }

}


// shopping cart
function myjsonSearch(hudingID) {
    for (var i = 0; i < shoppingitems.length; i++) {
        if (shoppingitems[i].hudingID == hudingID) {
            return i;
        }
    }

    return -1;
}

function showItems() {
    var myhtml =
        '<table class="table table-bordered">' +
        '<thead>' +
        '<tr>' +
        '<th class="text-center width="">名稱</th>' +
        '<th class="text-center" width="">價錢</th>' +
        '<th class="text-center" width="">份數</th>' +
        '<th class="text-center" width="36%">設定</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    for (var i = 0; i < shoppingitems.length; i++) {
        var itemName = shoppingitems[i].name;
        var itemPrice = shoppingitems[i].price;
        var itemCount = shoppingitems[i].count;
        var itemtPrice = itemPrice * itemCount;

        var itemhudingID = shoppingitems[i].hudingID;
        var itemtPriceID = "itemtPrice" + itemhudingID;
        var itemCountID = "itemCount" + itemhudingID;

        myhtml +=
            '<tr>' +
            '<td class="scrolltd">' + itemName + '</td>' +
            '<td id="' + itemtPriceID + '">' + itemtPrice + '</td>' +
            '<td id="' + itemCountID + '">' + itemCount + '</td>' +
            '<td>' +
            '<span class="btn btn-success btn-xs" ' +
            'onclick="calculate(' + itemhudingID + "," + "true" + ');">＋' +
            '</span>' +

            '<span class="btn btn-warning btn-xs" ' +
            'onclick="calculate(' + itemhudingID + "," + "false" + ');">－' +
            '</span>' +

            '<span class="btn btn-danger btn-xs" ' +
            'onclick="delfromShoppingcart(' + itemhudingID + ',this' + ');">Ｘ' +
            '</span>' +

            '</td>' +
            '</tr>';
    }

    myhtml +=
        '</tbody>' +
        '</table>';

    return myhtml;
}


function calculate(hudingID, addorminus) // true = add , false = minus
{
    var index = myjsonSearch(hudingID);

    var itemName = shoppingitems[index].name;
    var itemPrice = parseFloat(shoppingitems[index].price);
    var itemCount = shoppingitems[index].count;
    var itemtPrice = itemPrice * itemCount;

    var itemHudingID = shoppingitems[index].hudingID;
    var itemtPriceID = "itemtPrice" + itemHudingID;
    var itemCountID = "itemCount" + itemHudingID;

    if (addorminus == true) {
        itemCount += 1;
        itemtPrice = itemPrice * itemCount;
        $("#" + itemCountID).text(itemCount);
        $("#" + itemtPriceID).text(itemtPrice);

        shoppingitems[index] = { "name": itemName, "price": itemPrice, "count": itemCount, "tprice": itemtPrice, "hudingID": itemHudingID };
    }
    else {
        if (itemCount > 0) {
            itemCount -= 1;
            itemtPrice = itemPrice * itemCount;
            $("#" + itemCountID).text(itemCount);
            $("#" + itemtPriceID).text(itemtPrice);

            shoppingitems[index] = { "name": itemName, "price": itemPrice, "count": itemCount, "tprice": itemtPrice, "hudingID": itemHudingID };
        }
    }
}

function delfromShoppingcart(hudingID, me) {
    swal(
        {
            title: '確定刪除？',
            text: '按下確定此餐點將會被刪除...',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f0ad4e',
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
        }).then(function () {
            var index = myjsonSearch(hudingID);
            shoppingitems.splice(index, 1);
            me.parentElement.parentElement.innerHTML = "";
        }, function (dismiss) {
            if (dismiss === 'cancel') {

            }
        });
}


function showResult() {
    var mytotal = 0;

    var myhtml =
        '<table class="table table-bordered">' +
        '<thead>' +
        '<tr>' +
        '<th class="text-center">餐點名稱</th>' +
        '<th class="text-center">價錢</th>' +
        '<th class="text-center">份數</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>';

    for (var i = 0; i < shoppingitems.length; i++) {
        var itemName = shoppingitems[i].name;
        var itemCount = shoppingitems[i].count;
        var itemtPrice = shoppingitems[i].tprice;

        mytotal += itemtPrice;

        myhtml +=
            '<tr>' +
            '<td class="scrolltd">' + itemName + '</td>' +
            '<td>' + itemtPrice + '</td>' +
            '<td>' + itemCount + '</td>' +
            '</tr>';
    }

    myhtml +=
        '</tbody>' +
        '</table>';

    myhtml += '<br><hr>';
    myhtml += '<strong>總共 ' + parseInt(mytotal) + '</strong>';


    return myhtml;
}

function sendOrderData(data){
    $.ajax({
        url: window.location.pathname + "setOrder",
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        headers: { "X-CSRFToken": Cookies.get('csrftoken') },
        data: JSON.stringify(data),
        dataType: 'text',
        success: function (result) {
            if (result === "success") {
                swal('點餐成功',
                    '點餐成功',
                    'success').then(function () {
                        window.onbeforeunload = null;
                        window.location.href = "./orderDetail";
                    })
            } else if (result === "ordered") {
                swal('已經完成點餐',
                    '已經點過餐了，此為預覽頁面！',
                    'warning')
            } else {
                swal('發生錯誤',
                    '發生不可預期錯誤，請直接召喚服務人員！',
                    'error')
            }
        },
        error: function (result) {
            swal('發生錯誤',
                '發生不可預期錯誤，請直接召喚服務人員！',
                'error')
        }
    });
}


function shoppingcart() {
    swal(
        {
            title: '購物車',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f0ad4e',
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            html: showItems()
        }).then(function () {
            swal(
                {
                    title: '確認餐點',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#f0ad4e',
                    confirmButtonText: '點餐',
                    cancelButtonText: '取消',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    html: showResult()

                }).then(function () {
                    forhuding = [];
                    // the json which is for huding
                    for (var i = 0; i < shoppingitems.length; i++) {
                        forhuding.push({ "id": shoppingitems[i].hudingID, "count": shoppingitems[i].count });
                    }
                    if (forhuding.length < 1) {
                        swal('請先選擇餐點',
                            '餐點為空的，請先選擇餐點再進行點餐！',
                            'warning')
                    }else{
                        sendOrderData(forhuding);
                    }
                }, function (dismiss) {
                    if (dismiss === 'cancel') {

                    }
                });

        }, function (dismiss) {
            if (dismiss === 'cancel') {

            }
        });
}

// Image Setting

// setting again if the size of window is changed
$(document).ready(function () {
    $(window).resize(function () {
        for (var i = 0; i < myimageslist.length; i++) {
            ImagesSetting(myimageslist[i].imageID, myimageslist[i].src);
        }
    });
});

function ImageSetting(imageID, naturalWidth, naturalHeight) {
    var mydiv = "#" + imageID;
    var mylink = mydiv + " > a ";
    var myimage = mydiv + " > a > img";

    var fixedmin = $(mydiv).width();

    $(mydiv).css({ "height": fixedmin + "px" });
    $(mylink).css({ "display": "block", "width": fixedmin + "px" });
    $(mylink).css({ "display": "block", "height": fixedmin + "px" });

    var naturalWidth = $(myimage)[0].naturalWidth;
    var naturalHeight = $(myimage)[0].naturalHeight;

    if (naturalHeight > naturalWidth) {
        $(myimage).css('width', 'auto');
        $(myimage).css('height', (fixedmin - 4) + 'px');
    }
    else {
        $(myimage).css('width', (fixedmin - 4) + 'px');
        $(myimage).css('height', 'auto');
        var currentHeight = $(myimage).height();
        var diff = (fixedmin - currentHeight) / 2;
        $(myimage).css('padding-top', diff + 'px');
    }

}

function ImagesSetting(myimageID, mysrc) {
    var img = $("#" + myimageID + " > a > img")[0];
    img.src = mysrc;
    img.onload = function () {
        var naturalWidth = this.naturalWidth;
        var naturalHeight = this.naturalHeight;

        ImageSetting(myimageID, naturalWidth, naturalHeight);
    }
}

function showOrderDetail(){
    window.location.href = "./orderDetail";
}