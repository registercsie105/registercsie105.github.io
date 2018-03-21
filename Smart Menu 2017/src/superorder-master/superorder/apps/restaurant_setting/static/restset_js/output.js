var mypanel_colors = ["info", "warning", "danger", "success"];
var mypanel_colorsLen = mypanel_colors.length;

var json;
var fsrc = "";
var shoppingitems = [];

var HudingnewList =
    {
        "action": "new",
        "food":
            [
            ]
    }

var HudingeditList =
    {
        "action": "edit",
        "food":
            [
            ]
    }

var HudingdelList =
    {
        "action": "delete",
        "food":
            [
            ]
    }

// --------------------------------


var TSnewList =
    {
        "action": "new",
        "food":
            [
            ]
    }

var TSeditList =
    {
        "action": "edit",
        "food":
            [
            ]
    }

var TSdelList =
    {
        "action": "delete",
        "food":
            [
            ]
    }

mysmoothTouchScroll();

function mysmoothTouchScroll() {
    $("#touchScroller").smoothTouchScroll();
}

function readURL(input) {
    var limitSize = 10485760;
    var CanUpload = true;
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        if (!(input.files[0].type == "image/jpeg" ||
            input.files[0].type == "image/png" ||
            input.files[0].type == "image/gif")) {
            alert("上傳的圖片格式必須是jpg/png/gif :D");
            CanUpload = false;
        }

        if (input.files[0].size > limitSize) {
            alert("上傳的圖片大小必須<=10MB");
            CanUpload = false;
        }

        reader.onload = function (e) {
            fsrc = e.target.result;
            $('#img_prev').attr('src', e.target.result);
        };

        if (CanUpload) reader.readAsDataURL(input.files[0]);
    }
    else {
        //IE下
        var docObj = document.getElementById('uploader');
        docObj.select();

        //解决IE9下document.selection拒絕
        docObj.blur();
        var imgSrc = document.selection.createRange().text;
        var localImagId = document.getElementById("IEImag");
        $('#IEImag').width(200).height(200); //必须設置初始大小

        //圖片異常
        try {
            localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
        }
        catch (e) {
            alert("您上傳的圖片格式不正確，請重新選擇!");
            return false;
        }
        $('#img_prev').hide();
        document.selection.empty();
    }
}

function uploadImage(name, price, src, intro, top10) {
    // top10 不用 ' '

    var myhtml =
        '<input id="myname" type="text" class="form-control" placeholder="菜名... " value="' + name + '" required>' +

        // '<div class="row alignleft">' +
        '<input id="myprice" type="number" class="customTextbox alignleft" ' +
        'placeholder="價錢... " value="' + price + '" required>' +
        // '</div>' +

        // '<div class="alignright">' +
        addStar(top10) +
        // '</div>' +

        '<br>' +
        '<img id="img_prev" src="' + src + '" width="50%">' +
        '<br>' +

        '<div class="monkeyb-cust-file">' +
        '<input type="file" id="uploader" onchange="readURL(this);">' +
        '   <span>選擇照片</span>' +
        '</div>' +
        '<br><br>' +

        '<textarea class="form-control" rows="5" id="myintro">' +
        intro +
        '</textarea>';


    return myhtml;
}

function add3buttons(hudingID, tsID, imageID, name, price, src, intro, top10, category) {
    var myhtml =
        '<br><br>' +
        '<span class="myCorfirmButton" onclick="myConfirm(' +
        hudingID + "," + tsID + ",'" + imageID + "','" +
        name + "'," + price + ",'" + src + "','" +
        intro + "'," + top10 + ",'" + category + "'" +
        ');">' +
        '修改</span>' +
        '<span class="myDeleteButton" onclick="myDelete(' +
        hudingID + "," + tsID + ",'" + imageID + "'" +
        ');">刪除</span>' +
        '<span class="myCancelButton" onclick="myCancel();">取消</span>';


    return myhtml;
}

function myConfirm(hudingID, tsID, imageID, name, price, src, intro, top10, category) {
    var fname = $("#myname").val();
    var fprice = $("#myprice").val();
    var fintro = $("#myintro").val();
    var ftop10 = false;

    var fcategoryID = imageID.split("_")[0];
    var fnum = fcategoryID.replace("category", "");
    var fcategoryTitleID = "categoryTitle" + fnum;
    var fcategory = $("#" + fcategoryTitleID)[0].innerHTML;

    if ($(".star")[1].getAttribute("id") == "fullstar") {
        ftop10 = true;
    }

    if (fname.length > 0 && fprice.length > 0 && fintro.length > 0) {
        //如果有更新圖片
        if (fsrc.length > 0) {
            //更改圖片
            $("#" + imageID).replaceWith(makeImage(hudingID, tsID, imageID, fname, fprice, fsrc, fintro, ftop10, fcategory));
            $("." + imageID).replaceWith(maketop10(hudingID, tsID, imageID, fname, fprice, fsrc, fintro, ftop10, fcategory));

            //如果之前沒有放到top10就放過去
            if (top10 == false && ftop10 == true) {
                $(".scrollableArea").append(maketop10(hudingID, tsID, imageID, fname, fprice, fsrc, fintro, ftop10, fcategory));
                mysmoothTouchScroll();
            }
            //如果之前放在top10 就移除
            else if (top10 == true && ftop10 == false) {
                $("." + imageID).replaceWith('');
            }

            if (tsID >= 0) {
                TSeditListedit(tsID, fname, fprice, fsrc, fintro, ftop10, fcategory);
                // console.log(TSeditList);
            }
            else {
                TSnewListadd(imageID, fname, fprice, fsrc, fintro, ftop10, fcategory);
                // console.log(TSnewList);
            }

            if (hudingID >= 0) {
                HudingeditListedit(hudingID, fname, fprice, fsrc, fintro, ftop10, fcategory);
                // console.log(HudingeditList);
            }
            else {
                HudingnewListadd(imageID, fname, fprice, fsrc, fintro, ftop10, fcategory);
                // console.log(HudingnewList);
            }

            ImagesSetting(imageID, fsrc);
            fsrc = "";
        }
        //沒更新圖片的話，就只要把其他資訊改一改就好惹
        else {
            $("#" + imageID).replaceWith(makeImage(hudingID, tsID, imageID, fname, fprice, src, fintro, ftop10, fcategory));
            $("." + imageID).replaceWith(maketop10(hudingID, tsID, imageID, fname, fprice, src, fintro, ftop10, fcategory));

            if (top10 == false && ftop10 == true) {
                $(".scrollableArea").append(maketop10(hudingID, tsID, imageID, fname, fprice, src, fintro, ftop10, fcategory));
                mysmoothTouchScroll();
            }
            else if (top10 == true && ftop10 == false) {
                $("." + imageID).replaceWith('');
            }


            if (tsID >= 0) {
                TSeditListedit(tsID, fname, fprice, src, fintro, ftop10, fcategory);
                // console.log(TSeditList);
            }
            else {
                TSnewListadd(imageID, fname, fprice, src, fintro, ftop10, fcategory);
                // console.log(TSnewList);
            }

            if (hudingID >= 0) {
                HudingeditListedit(hudingID, fname, fprice, src, fintro, ftop10, fcategory);
                // console.log(HudingeditList);
            }
            else {
                HudingnewListadd(imageID, fname, fprice, src, fintro, ftop10, fcategory);
                // console.log(HudingnewList);
            }

            ImagesSetting(imageID, src);
        }
    }
    swal.close();
}

function myDelete(hudingID, tsID, imageID) {
    swal.close();

    swal(
        {
            title: '確認刪除嗎？',
            text: "刪除後的圖片無法恢復！",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f0ad4e',
            confirmButtonText: '確定',
            cancelButtonText: '取消'
        }).then(function () {
            $("#" + imageID).replaceWith('');
            $("." + imageID).replaceWith('');

            if (tsID >= 0) {
                TSeditListdel(tsID);
                // console.log(TSeditList);
            }
            else {
                TSnewListdel(imageID);
                // console.log(TSnewList);
            }

            if (hudingID >= 0) {
                HudingeditListdel(hudingID);
                // console.log(HudingeditList);
            }
            else {
                HudingnewListdel(imageID);
                // console.log(HudingnewList);
            }

            swal
                (
                '成功刪除',
                '圖片已經被移除了！',
                'success'
                )
        }, function (dismiss) {
            if (dismiss === 'cancel') {

            }
        });
}

function myCancel() {
    swal.close();
}


// alert box (add / edit /show)

function addAlert(num) {
    // I = initial
    // f = function
    var Iname = "";
    var Iprice = "";
    var Isrc = "/static/restset_img/nothing_here.png";
    var Iintro = "";
    var Itop10 = false;

    swal(
        {
            title: '新增餐點',
            html: uploadImage(Iname, Iprice, Isrc, Iintro, Itop10)

        }).then(function () {
            var fcategoryID = "category" + num;
            var fcategoryTitleID = "categoryTitle" + num;
            var fcategoryLen = $("#" + fcategoryID)[0].children.length;
            var fimageLastID;
            var fimagenum = 0; //如果啥都沒 就從0開始
            var fcategory = $("#" + fcategoryTitleID)[0].innerHTML;

            if (fcategoryLen > 0) {
                fimageLastID = $("#" + fcategoryID + " > div:last").attr('id');
                fimagenum = parseInt(fimageLastID.replace(fcategoryID + "_" + "image", ""));
                fimagenum += 1;
            }

            var fimageID = fcategoryID + "_" + "image" + fimagenum;

            var fname = $("#myname").val();
            var fprice = $("#myprice").val();
            var fintro = $("#myintro").val();
            var ftop10 = false;

            if ($(".star")[1].getAttribute("id") == "fullstar") {
                ftop10 = true;
            }

            if (fname.length > 0 && fprice.length > 0 &&
                fintro.length > 0 && fsrc.length > 0) {

                $("#" + fcategoryID).append(makeImage(-1, -1, fimageID, fname, fprice, fsrc, fintro, ftop10, fcategory)); //新增圖片到某個分類

                if (ftop10 == true) {
                    $(".scrollableArea").append(maketop10(-1, -1, fimageID, fname, fprice, fsrc, fintro, ftop10, fcategory));
                    mysmoothTouchScroll();
                }

                // json
                TSnewListadd(fimageID, fname, fprice, fsrc, fintro, ftop10, fcategory);

                HudingnewListadd(fimageID, fname, fprice, fsrc, fintro, ftop10, fcategory);


                ImagesSetting(fimageID, fsrc);
                fsrc = "";
            }
        })
}

function editAlert(hudingID, tsID, imageID, name, price, src, intro, top10, category) {
    // name 是原本資料的
    // fname 是改之後的

    swal(
        {
            title: '編輯餐點',
            showConfirmButton: false,
            html: uploadImage(name, price, src, intro, top10) +
                add3buttons(hudingID, tsID, imageID, name, price, src, intro, top10, category)

        }).then(function () {
            // code都在add3buttons的onclick事件裡
        },
        function (dismiss) {
            if (dismiss === 'cancel') {

            }
        });
}

function showAlert(imageID, name, price, src, intro, top10) {
    if (shoppingitems.indexOf(name + "," + price) < 0) {
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
                // buttonsStyling: false
            }).then(function () {
                swal(
                    {
                        title: '需購買的數量',
                        input: 'text',
                        // html: showImage(name,price,src,intro,top10),
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#f0ad4e',
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        confirmButtonClass: 'btn btn-success',
                        cancelButtonClass: 'btn btn-danger'
                    }).then(function (result) {
                        var count = parseInt(result); // 如果是奇怪的字 parseInt 之後會變成 NaN

                        // 如果有. 代表是小數 就滾
                        // 不是奇怪的字 也不是小數 也沒有<=0 的 才能成功！
                        if (count <= 0 || isNaN(count) || result.indexOf(".") >= 0) {
                            swal
                                (
                                '數量錯誤！',
                                '請輸入 > 0的整數！',
                                'error'
                                )
                        }
                        else {
                            var shoppingitemsLen = shoppingitems.length;
                            shoppingitems.push(name + "," + price);
                        }
                    });

            });
    }
    else {
        swal(
            {
                title: '熱門美食',
                html: showImage(name, price, src, intro, top10),
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonColor: '#d9534f',
                confirmButtonText: '移出購物車',
                cancelButtonColor: '#f0ad4e',
                cancelButtonText: '取消'
                // cancelButtonClass: 'btn btn-danger'
            }).then(function () {
                var myindex = shoppingitems.indexOf(name + "," + price);
                shoppingitems.splice(myindex, 1);
            },
            function (dismiss) {
                if (dismiss === 'cancel') {

                }
            });
    }
}

// 關於top10的星星

function changeStar(star) {
    var fstarid = star.getAttribute("id");

    if (fstarid == "emptystar") {
        $("#" + fstarid).replaceWith(addStar(true));
    }
    else {
        $("#" + fstarid).replaceWith(addStar(false));
    }
}

function addStar(top10) {
    var myhtml = '';

    if (top10) {
        myhtml = '<span id="fullstar" class="glyphicon glyphicon-star star" onclick="changeStar(this);"></span>';
    }
    else {
        myhtml = '<span id="emptystar" class="glyphicon glyphicon-star-empty star" onclick="changeStar(this);"></span>';
    }

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

//關於新增Image


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


// 關於List編輯 刪除
function addListTextbox() {
    var num = 0; //如果沒進去底下的if 代表說根本沒li 所以從0開始的異世界生活
    // 有一個是button 所以要-1
    var categoriesLen = $("#categories").children().length - 1;

    if (categoriesLen > 0) {
        var categoriesLastID = $("#categories > li:last").attr("ID");
        num = parseInt(categoriesLastID.replace("list", ""));
        num += 1;
    }

    $("#" + "addCategoryTextButton").before(makeListTextbox(num, 'new', false, false));
    $("body").append(makeCategory(num, ''));

    $(".navbar li a").css({ "display": "inline-block", "width": "calc(100% - 90px)" });
}

function makeListTextbox(num, new_or_edit, huding, ts) {
    var myhtml =
        '<li id="' + "list" + num + '">' +
        '<input type="text" ' +
        'class="form-control ' + new_or_edit + 'CategoryTextbox' +
        '" id="' + new_or_edit + 'CategoryTextbox' + num +
        '" placeholder="輸入餐點分類">';

    myhtml += makeOKDeleteButton(num, new_or_edit, huding, ts);

    myhtml += '</li>';

    return myhtml;
}

function editListOP(num, listText, flag, flagID, editListedit, newListadd) {
    var mycategoryID = "category" + num;
    var mycategoryLen = $("#" + mycategoryID)[0].children.length;

    for (var i = 0; i < mycategoryLen; i++) {
        var myfood = $("#" + mycategoryID)[0].children[i];
        var myimageID = myfood.getAttribute("imageID");
        var myname = myfood.getAttribute("name");
        var myprice = parseInt(myfood.getAttribute("price"));
        var mysrc = myfood.getAttribute("src");
        var myintro = myfood.getAttribute("intro");
        var mytop10 = myfood.getAttribute("top10") == "true";
        var mycategory = listText;

        if (flag == true) {
            var myflagID = parseInt(myfood.getAttribute(flagID));
            editListedit(myflagID, myname, myprice, mysrc, myintro, mytop10, mycategory);
        }
        else {
            newListadd(myimageID, myname, myprice, mysrc, myintro, mytop10, mycategory);
        }
    }
}

function OKItem(num, new_or_edit, huding, ts) {
    var mylistID = "list" + num;
    var mycategoryTitleID = "categoryTitle" + num;

    var myTextboxID = new_or_edit + "CategoryTextbox" + num;
    var mylistText = $("#" + myTextboxID).val();

    var notinCategories = true;
    var mycategoriesLen = $("#categories").children().length - 1;

    for (var i = 0; i < mycategoriesLen; i++) {

        var childlistID = $("#categories")[0].children[i].getAttribute("id");
        var childlistText = $("#" + childlistID).text().replace(/\s/g, '');

        if (childlistText == mylistText) {
            notinCategories = false;
            swal
                (
                '分類重複！',
                '請換一個分類名稱 :D',
                'error'
                )

            return;
        }
    }


    if (mylistText.length > 0 && notinCategories == true) {
        $("#" + mylistID).replaceWith(makeList(num, mylistText, huding, ts));
        $("#" + mycategoryTitleID)[0].innerHTML = mylistText;

        if (new_or_edit == 'edit') {
            editListOP(num, mylistText, huding, "hudingID", HudingeditListedit, HudingnewListadd);
            editListOP(num, mylistText, ts, "tsID", TSeditListedit, TSnewListadd);
        }
        else if (new_or_edit == 'new') {
            // do nothing now ...
        }
    }

    $(".navbar li a").css({ "display": "inline-block", "width": "calc(100% - 90px)" });
}

function EditItem(num, huding, ts) {
    var mylistID = "list" + num;

    $("#" + mylistID).replaceWith(makeListTextbox(num, 'edit', huding, ts));
}

function delListOP(num, flag, flagID, editListdel, newListdel) {
    var mycategoryID = "category" + num;
    var mycategoryLen = $("#" + mycategoryID)[0].children.length;

    for (var i = 0; i < mycategoryLen; i++) {
        var myfood = $("#" + mycategoryID)[0].children[i];
        var myimageID = myfood.getAttribute("imageID");

        if (flag == true) {
            var myflagID = parseInt(myfood.getAttribute(flagID));
            editListdel(myflagID);
        }
        else {
            newListdel(myimageID);
        }

        $("." + myimageID).replaceWith('');
    }
}

function DeleteItem(num, huding, ts) {
    // Demo
    delListOP(num, huding, "hudingID", HudingeditListdel, HudingnewListdel);
    delListOP(num, ts, "tsID", TSeditListdel, TSnewListdel);


    // Source
    var mylistID = "list" + num;
    var mycategoryID = "category" + num;

    $("#" + mylistID).replaceWith('');
    $("#" + mycategoryID).parent().replaceWith('');
}

function makeOKDeleteButton(num, new_or_edit, huding, ts) {
    var myhtml =
        '<button class="btn nothing"></button>' +
        '<button class="btn btn-danger pull-right"' +
        'onclick="DeleteItem(' + num + ',' + huding + ',' + ts + ');" >' +
        '   <span class="glyphicon glyphicon-trash"></span>' +
        '</button>' +
        '<button class="btn btn-success pull-right"' +
        'onclick="OKItem(' + num + ",'" + new_or_edit + "'," + huding + "," + ts + ');" >' +
        '   <span class="glyphicon glyphicon-ok"></span>' +
        '</button>';

    return myhtml;
}



// about output json

function HudingnewListsearch(imageID) {
    var HudingnewListfood = HudingnewList["food"];
    var HudingnewListfoodLen = HudingnewListfood.length;

    for (var i = 0; i < HudingnewListfoodLen; i++) {
        if (HudingnewListfood[i]["imageID"] == imageID) {
            return i;
        }
    }
    return -1;
}

function HudingnewListadd(imageID, name, price, src, intro, top10, category) {
    var HudingnewListfood = HudingnewList["food"];

    var element =
        {
            "imageID": imageID,
            "name": name,
            "price": price,
            "src": src,
            "intro": intro,
            "top10": top10,
            "category": category
        }

    var myindex = HudingnewListsearch(imageID);

    if (myindex >= 0) {
        HudingnewListfood[myindex] = element;
    }
    else {
        HudingnewListfood.push(element);
    }
}

function HudingnewListdel(imageID) {
    var HudingnewListfood = HudingnewList["food"];
    var myindex = HudingnewListsearch(imageID);
    HudingnewListfood.splice(myindex, 1);
}

function HudingeditListsearch(hudingID) {
    var HudingeditListfood = HudingeditList["food"];
    var HudingeditListfoodLen = HudingeditListfood.length;

    for (var i = 0; i < HudingeditListfoodLen; i++) {
        if (HudingeditListfood[i]["id"] == hudingID) {
            return i;
        }
    }
    return -1;
}

function HudingeditListedit(hudingID, name, price, src, intro, top10, category) {
    var HudingeditListfood = HudingeditList["food"];

    var element =
        {
            "id": hudingID,
            "name": name,
            "price": price,
            "src": src,
            "intro": intro,
            "top10": top10,
            "category": category
        }

    var myindex = HudingeditListsearch(hudingID);

    if (myindex >= 0) {
        HudingeditListfood[myindex] = element;
    }
    else {
        HudingeditListfood.push(element);
    }

}

function HudingeditListdel(hudingID) {
    var HudingdelListfood = HudingdelList["food"];
    var HudingeditListfood = HudingeditList["food"];

    var element =
        {
            "id": hudingID
        }

    HudingdelListfood.push(element);

    var myindex = HudingeditListsearch(hudingID);

    if (myindex >= 0) {
        HudingeditListfood.splice(myindex, 1);
    }
}


// 預覽 ------------------------------------------

function TSnewListsearch(imageID) {
    var TSnewListfood = TSnewList["food"];
    var TSnewListfoodLen = TSnewListfood.length;

    for (var i = 0; i < TSnewListfoodLen; i++) {
        if (TSnewListfood[i]["imageID"] == imageID) {
            return i;
        }
    }
    return -1;
}

function TSnewListadd(imageID, name, price, src, intro, top10, category) {
    var TSnewListfood = TSnewList["food"];

    var element =
        {
            "imageID": imageID,
            "name": name,
            "price": price,
            "src": src,
            "intro": intro,
            "top10": top10,
            "category": category
        }

    var myindex = TSnewListsearch(imageID);

    if (myindex >= 0) {
        TSnewListfood[myindex] = element;
    }
    else {
        TSnewListfood.push(element);
    }
}

function TSnewListdel(imageID) {
    var TSnewListfood = TSnewList["food"];
    var myindex = TSnewListsearch(imageID);
    TSnewListfood.splice(myindex, 1);
}

function TSeditListsearch(tsID) {
    var TSeditListfood = TSeditList["food"];
    var TSeditListfoodLen = TSeditListfood.length;

    for (var i = 0; i < TSeditListfoodLen; i++) {
        if (TSeditListfood[i]["tsID"] == tsID) {
            return i;
        }
    }
    return -1;
}

function TSeditListedit(tsID, name, price, src, intro, top10, category) {
    var TSeditListfood = TSeditList["food"];

    var element =
        {
            "tsID": tsID,
            "name": name,
            "price": price,
            "src": src,
            "intro": intro,
            "top10": top10,
            "category": category
        }

    var myindex = TSeditListsearch(tsID);

    if (myindex >= 0) {
        TSeditListfood[myindex] = element;
    }
    else {
        TSeditListfood.push(element);
    }

}

function TSeditListdel(tsID) {
    var TSdelListfood = TSdelList["food"];
    var TSeditListfood = TSeditList["food"];

    var element =
        {
            "tsID": tsID
        }

    TSdelListfood.push(element);

    var myindex = TSeditListsearch(tsID);

    if (myindex >= 0) {
        TSeditListfood.splice(myindex, 1);
    }
}

// Image Setting

function ImageSetting(imageID, naturalWidth, naturalHeight) {
    var fixedmin = 90;

    var mydiv = "#" + imageID;
    var mylink = mydiv + " > a ";
    var myimage = mydiv + " > a > img";

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