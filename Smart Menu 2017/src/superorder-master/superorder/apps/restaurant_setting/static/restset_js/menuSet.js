var mypanel_colors = ["info", "warning", "danger", "success"];
var mypanel_colorsLen = mypanel_colors.length;
var mycategoryArray = [];
var mycategoriesLen = [];
var mypublictsID = 0;

$(window).on('load', function () {
    // source 小寫
    // edit --> demo
    // A.html的+my

    // categories = 右上角
    var mycategories = $("#Source").contents().find("#categories");
    var mybody = $("#Source").contents().find("body");

    var democategories = $("#Edited").contents().find("#categories");
    var demobody = $("#Edited").contents().find("body");

    $.getJSON("/lib/resturent_foods.json", function (data) {
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

                democategories.append(makeListDemo(mycategoryIndex, mylistText));
                demobody.append(makeCategoryDemo(mycategoryIndex, mylistText));
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
            var category = $("#Source").contents().find("#" + mycategoryID);
            var democategory = $("#Edited").contents().find("#" + mycategoryID);

            category.append(makeImage(myhudingID, mypublictsID, myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory)); //新增圖片到某個分類
            democategory.append(makeImageDemo(myhudingID, mypublictsID, myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory));

            // 如果這圖片是top10 還要append top10
            if (mytop10 == true) {
                $("#Source").contents().find(".scrollableArea").append(maketop10(myhudingID, mypublictsID, myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory)); //新增圖片到某個分類
                $("#Edited").contents().find(".scrollableArea").append(maketop10Demo(myhudingID, mypublictsID, myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory)); //新增圖片到某個分類
            }

            mycategoriesLen[mycategoryIndex]++;
            mypublictsID++;

            // image
            // ImagesSetting(myimageID,mysrc);
            document.getElementById("Source").contentWindow.ImagesSetting(myimageID, mysrc);
            document.getElementById("Edited").contentWindow.ImagesSetting(myimageID, mysrc);
        });


        // 這裡會等到json都做完 才會開始做～
        var myaddbutton =
            '<button id="addCategoryTextButton" class="btn btn-success form-control" ' +
            'onclick="addListTextbox();">新增餐點分類</button>';
        mycategories.append(myaddbutton);

        $("#Source").contents().find(".navbar li a").css({ "display": "inline-block", "width": "calc(100% - 90px)" });
        document.getElementById("Source").contentWindow.mysmoothTouchScroll();
        document.getElementById("Edited").contentWindow.mysmoothTouchScroll();

    }).done(function () {

    });
});

function showReadme() {
    var myhtml =
        '<div class="readme">' +
        "<li>左邊畫面為" + '<strong class="text-info">編輯</strong>' +
        "、右邊畫面為" + '<strong class="text-danger">顯示</strong>' + "。" +
        '</li>' +
        '<li><strong class="text-info">編輯</strong>' + "完成後，" +
        "點擊" + '<strong class="text-warning">預覽</strong>' + "按鈕" +
        "，" + '<strong class="text-danger">顯示</strong>' + "就會更新您的修改。" +
        '</li>' +
        '<li>' +
        '<strong class="text-info">編輯</strong>' + "中的食物分類，底下如果沒有食物，" +
        '<strong class="text-danger">顯示</strong>' + "就不會出現該食物分類。" +
        '</li>' +
        '<li>' +
        '<strong class="text-danger">顯示</strong>' +
        "並不提供「購物車」功能，實際頁面才會提供。" +
        '</li>' +
        '<li>' +
        "如果確定不會變更了，請按" +
        '<strong class="text-success">儲存</strong>' + "按鈕。" +
        '</li>' +
        '</div>';

    return myhtml;
}

function setCookie(cname, cvalue, exdays, path) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
}

firstReadme();
function firstReadme() {
    var read = Cookies.get('isRead');
    if (!read) {
        readme()
    }
}

function readme() {
    swal({
        title: '操作說明',
        html: showReadme(),
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: '我瞭解了！！！'
    }).then(function () {
        setCookie("isRead", "true", 356, "/setting/menu/");
    });
}


function clearTSJson() {
    document.getElementById("Source").contentWindow.TSnewList =
        {
            "action": "new",
            "food":
                [
                ]
        }

    document.getElementById("Source").contentWindow.TSeditList =
        {
            "action": "edit",
            "food":
                [
                ]
        }

    document.getElementById("Source").contentWindow.TSdelList =
        {
            "action": "delete",
            "food":
                [
                ]
        }
}

function newListOP(imageID, name, price, src, intro, top10, category) {
    var myfood = $("#Source").contents().find("#" + imageID);
    myfood.replaceWith(makeImage(-1, mypublictsID, imageID, name, price, src, intro, top10, category));

    var myfoodtop10 = $("#Source").contents().find("." + imageID);
    myfoodtop10.replaceWith(maketop10(-1, mypublictsID, imageID, name, price, src, intro, top10, category));

    var mycategoryID = imageID.split("_")[0];
    var mynum = mycategoryID.replace("category", "");
    var mylistID = "list" + mynum;
    var mylist = $("#Source").contents().find("#" + mylistID);
    mylist.replaceWith(makeList(mynum, category, true, true));
    $("#Source").contents().find(".navbar li a").css({ "display": "inline-block", "width": "calc(100% - 90px)" });
}

function newListOPDemo(imageID, name, price, src, intro, top10, category) {
    var mycategoryID = imageID.split("_")[0];

    var democategories = $("#Edited").contents().find("#categories");
    var demobody = $("#Edited").contents().find("body");

    var demonum = parseInt(mycategoryID.replace("category", ""));
    var categoriesLen = $("#Edited").contents().find("#categories").children().length;

    var notinCategories = true;

    // 如果categoriesLen == 0 就不會跑底下的for
    for (var i = 0; i < categoriesLen; i++) {
        var mylistID = democategories[0].children[i].getAttribute("id");
        var listText = $("#Edited").contents().find("#" + mylistID).text();

        if (listText == category)
            notinCategories = false;
    }

    // add category
    if (notinCategories) //如果本來沒有這個category
    {
        $("#Edited").contents().find("#categories").append(makeListDemo(demonum, category));
        $("#Edited").contents().find("body").append(makeCategoryDemo(demonum, category));
    }


    // add Image
    var democategory = $("#Edited").contents().find("#" + mycategoryID);
    democategory.append(makeImageDemo(-1, mypublictsID, imageID, name, price, src, intro, top10, category));

    // add top10
    if (top10 == true) {
        // console.log(-1, mypublictsID, imageID, name, price, src, intro, top10, category);
        $("#Edited").contents().find(".scrollableArea").append(maketop10Demo(-1, mypublictsID, imageID, name, price, src, intro, top10, category)); //新增圖片到某個分類
    }
}

function sortResults(mylist, prop, asc) {
    mylist = mylist.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}

function delListOPDemo(tsID) {
    var myfood = $("#Edited").contents().find("[tsID=" + tsID + "]");
    var myimageID = myfood.attr("imageID");
    myfood.replaceWith('');

    var mycategoryID = myimageID.split("_")[0];
    var mycategory = $("#Edited").contents().find("#" + mycategoryID);
    if (mycategory[0].children.length == 0) {
        var mynum = mycategoryID.replace("category", "");
        var mylistID = "list" + mynum;
        var mylist = $("#Edited").contents().find("#" + mylistID);
        mylist.replaceWith('');

        mycategory.parent().replaceWith('');
    }
}

function editListOPDemo(tsID, name, price, src, intro, top10, category) {
    var myfood = $("#Edited").contents().find("[tsID=" + tsID + "]");
    var myhudingID = myfood.attr("hudingID");
    var myimageID = myfood.attr("imageID");
    var oldtop10 = myfood.attr("top10") == "true";

    // 只是為了拿num
    var mycategoryID = myimageID.split("_")[0];
    var mynum = mycategoryID.replace("category", "");

    // change list
    var mylistID = "list" + mynum;
    var mylist = $("#Edited").contents().find("#" + mylistID);
    mylist.replaceWith(makeListDemo(mynum, category));

    // change category title
    var mycategoryTitleID = "categoryTitle" + mynum;
    var mycategoryTitle = $("#Edited").contents().find("#" + mycategoryTitleID);
    mycategoryTitle[0].innerHTML = category;

    // make Image (hudingID 跟 imageID 有 my)
    $("#Edited").contents().find("#" + myimageID).replaceWith(makeImageDemo(myhudingID, tsID, myimageID, name, price, src, intro, top10, category));


    // make top10 (hudingID 跟 imageID 有 my)
    if (oldtop10 == false && top10 == true) {
        // hudingID 跟 imageID 有 my
        $("#Edited").contents().find(".scrollableArea").append(maketop10Demo(-1, tsID, myimageID, name, price, src, intro, top10, category)); //新增圖片到某個分類
        document.getElementById("Edited").contentWindow.mysmoothTouchScroll();
    }
    else if (oldtop10 == true && top10 == false) {
        $("#Edited").contents().find("." + myimageID).replaceWith('');
    }

}

function SetValue() {

    var TSnewList = document.getElementById("Source").contentWindow.TSnewList;
    var TSeditList = document.getElementById("Source").contentWindow.TSeditList;
    var TSdelList = document.getElementById("Source").contentWindow.TSdelList;

    // console.log(TSnewList, TSeditList, TSdelList);

    var TSnewListFood = TSnewList.food;
    var TSeditListFood = TSeditList.food;
    var TSdelListFood = TSdelList.food;

    sortResults(TSnewListFood, 'imageID', true);

    for (var i = 0; i < TSdelListFood.length; i++) {
        var mytsID = TSdelListFood[i].tsID;
        delListOPDemo(mytsID);
    }

    for (var i = 0; i < TSeditListFood.length; i++) {
        var mytsID = TSeditListFood[i].tsID;
        var myname = TSeditListFood[i].name;
        var myprice = TSeditListFood[i].price;
        var mysrc = TSeditListFood[i].src;
        var myintro = TSeditListFood[i].intro;
        var mytop10 = TSeditListFood[i].top10;
        var mycategory = TSeditListFood[i].category;

        editListOPDemo(mytsID, myname, myprice, mysrc, myintro, mytop10, mycategory);

        // ImagesSetting(myimageID,mysrc);

        document.getElementById("Source").contentWindow.ImagesSetting(myimageID, mysrc);
        document.getElementById("Edited").contentWindow.ImagesSetting(myimageID, mysrc);
    }

    for (var i = 0; i < TSnewListFood.length; i++) {
        var myimageID = TSnewListFood[i].imageID;
        var myname = TSnewListFood[i].name;
        var myprice = TSnewListFood[i].price;
        var mysrc = TSnewListFood[i].src;
        var myintro = TSnewListFood[i].intro;
        var mytop10 = TSnewListFood[i].top10;
        var mycategory = TSnewListFood[i].category;

        // Source
        newListOP(myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory);

        // Demo
        newListOPDemo(myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory);

        mypublictsID++;

        // ImagesSetting(myimageID,mysrc);

        document.getElementById("Source").contentWindow.ImagesSetting(myimageID, mysrc);
        document.getElementById("Edited").contentWindow.ImagesSetting(myimageID, mysrc);
    }


    document.getElementById("Edited").contentWindow.mysmoothTouchScroll();

    clearTSJson();
}

function makeListDemo(num, listText) {
    var listID = "list" + num;
    var categoryID = "category" + num;

    var myhtml =
        '<li id="' + listID + '">' +
        '<a href="#' + categoryID + '">' + listText +
        '</a>' +
        '</li>';

    return myhtml;
}

function makeCategoryDemo(num, listText) {
    var categoryID = "category" + num;
    var categoryTitleID = "categoryTitle" + num;

    var myhtml =
        '<div class="panel panel-' + mypanel_colors[num % mypanel_colorsLen] + '">' +
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

function makeImageDemo(hudingID, tsID, imageID, name, price, src, intro, top10, category) {
    var mynum = parseInt(imageID.split("_")[0].replace("category", ""));

    var myhtml =
        '<div class="col-xs-4 text-center border-' +
        mypanel_colors[mynum % mypanel_colorsLen] + '"' +
        ' hudingID = ' + hudingID +
        ' tsID = ' + tsID +
        ' imageID = "' + imageID + '"' +
        ' name = "' + name + '"' +
        ' price = "' + price + '"' +
        ' src = "' + src + '"' +
        ' intro = "' + intro + '"' +
        ' top10 = ' + top10 +
        ' category = "' + category + '"' +
        ' id="' + imageID + '">' +
        '<a onclick="' +
        'showAlert(' + "'" + imageID + "','" + name + "','" + price + "','" + src + "','" +
        intro + "'," + top10 + ');">' +
        '<img src="' + src + '" >' +
        '</a>' +
        '</div>';

    return myhtml;
}

function maketop10Demo(hudingID, tsID, imageID, name, price, src, intro, top10, category) {
    var myhtml =
        '<a class="' + imageID + '"' +
        ' hudingID = ' + hudingID +
        ' tsID = ' + tsID +
        ' imageID = "' + imageID + '"' +
        ' name = "' + name + '"' +
        ' price = "' + price + '"' +
        ' src = "' + src + '"' +
        ' intro = "' + intro + '"' +
        ' top10 = ' + top10 +
        ' category = "' + category + '"' +
        ' onclick="' +
        'showAlert(' + "'" + imageID + "','" + name + "','" + price + "','" + src + "','" +
        intro + "'," + top10 + ');">' +
        '<img src="' + src + '" class="img-circle Stories"/>' +
        '</a>';

    return myhtml;
}


function SaveValue() {
    var HudingnewList = document.getElementById("Source").contentWindow.HudingnewList;
    var HudingeditList = document.getElementById("Source").contentWindow.HudingeditList;
    var HudingdelList = document.getElementById("Source").contentWindow.HudingdelList;

    var Hudingjson = [];
    Hudingjson.push(HudingnewList, HudingeditList, HudingdelList);
    // console.log(Hudingjson);

    $.ajax({
        url: '/setting/menu/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        headers: { "X-CSRFToken": Cookies.get('csrftoken') },
        data: JSON.stringify(Hudingjson),
        dataType: 'text',
        success: function (result) {
            location.reload();
        },
        error: function (result) {
            alert("ERROR");
            location.reload();
        }
    });
}