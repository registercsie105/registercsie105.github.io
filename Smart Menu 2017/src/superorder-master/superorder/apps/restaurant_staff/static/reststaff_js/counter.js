var tsjson;
$(window).on('load', function () {
    // 名稱 單價 份數 總價
    $.getJSON(idFoodsJsonPath, function (data) {
        tsjson = data;
    }).done(function () {
        updateBuyList();
    });
});


function updateBuyList(){
    $.getJSON("/staff/orders.json", function (data) {
        $("#mybuyList").empty();
        $("#mybuyList").html('<h3 class="text-center">訂單列表</h3><br>');
        $.each(data, function (i, item) {
            var mytableId = item.tableId;
            var mytableNum = item.tableNum;
            var myorders = item.order;
            var mytotalprice = 0;

            $("#mybuyList").append(maketable(mytableNum, mytableId));

            $.each(myorders, function (index, order) {
                var myfood = tsjson[order.id];
                var myname = myfood.name;
                var myprice = myfood.price;
                var mycount = order.count;
                var mytprice = parseFloat(myprice) * mycount;
                mytotalprice += mytprice;

                $("#mytable" + mytableId).append(makeElement(myname, myprice, mycount, mytprice));
            });

            $("#total" + mytableId).text(mytotalprice + "元");
        });
    }).always(function () {
        setTimeout(updateBuyList, 10000);
    });
}

function maketable(tableNum, tableId) {
    var myhtml =
        '<div>' +
        '<div class="tabletitle">' +
        '<span class="btn btn-black disableClick form-setting form-control text-center">' + tableNum + "桌" + '</span>' +
        '<span id="' + "total" + tableId + '" ' +
        'class="btn btn-green disableClick text-center">' + "" + '</span>' +
        '<span class="btn btn-danger" ' +
        'onclick="delList(this,' + tableId + ');">Ｘ' +
        '</span>' +
        '</div>' +
        '<table class="table table-striped" id="' + "mytable" + tableId + '">' +
        '<thead>' +
        '<tr>' +
        '<th class="text-center" width="40%">名稱</th>' +
        '<th class="text-center" width="20%">單價</th>' +
        '<th class="text-center" width="20%">份數</th>' +
        '<th class="text-center" width="20%">總價</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="mytablebody">' +

        '</tbody>' +
        '</table>' +
        '</div>';

    return myhtml;
}

// submit按下去後，不重新整理的魔法 >3<
$('#QRcodeMakerForm').submit(function () {
    makeQRcode();
    return false;
});


function makeQRcode() {
    var peopleNum = $("#peopleNum").val();
    var tableNum = $("#tableNum").val();
    if (peopleNum.length == 0 || tableNum.length == 0) {
    }
    else {
        $.ajax({
            url: '/staff/QrcodeUrl.json',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            headers: { "X-CSRFToken": Cookies.get('csrftoken') },
            data: JSON.stringify({ 'peopleNum': peopleNum, 'tableNum': tableNum}),
            dataType: 'text',
            success: function (result) {
                orderURL = result;
                $("#QRcodeImg").attr({ "src": orderURL + ".qr" });
                $("#orderURL").text("第" + tableNum + "桌: " + orderURL);
            },
            error: function (result) {
                alert("ERROR");
            }
        });
    }
}

function makeElement(name, price, count, tprice) {

    var myhtml =
        '<tr class="text-center">' +
        '<td class="scrolltd">' + name + '</td>' +
        '<td>' + price + '</td>' +
        '<td>' + count + '</td>' +
        '<td>' + tprice + '</td>' +
        '</tr>';

    return myhtml;
}

function delList(delbutton, tableId) {
    swal(
        {
            title: '確定刪除？',
            text: '按下確定此訂單將會被刪除...',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f0ad4e',
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
        }).then(function () {
            var counterJson = {
                "action": "deleteOrder",
                "tableId": tableId
            };
            sendEditJson(counterJson, delbutton)
        }, function (dismiss) {
            if (dismiss === 'cancel') {

            }
        });
}

function sendEditJson(data, delbutton){
    $.ajax({
        url: "/staff/editOrder",
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        headers: { "X-CSRFToken": Cookies.get('csrftoken') },
        data: JSON.stringify(data),
        dataType: 'text',
        success: function (result) {
            if (result === "success") {
                delbutton.parentElement.parentElement.replaceWith('');
            }else{
                someError();
            }
        },
        error: function (result) {
            someError();
        }
    });
    return 0;
}

function someError(){
    swal('發生錯誤',
        '發生錯誤請再試一次！',
        'error').then(function () {
            location.reload();
        });
}