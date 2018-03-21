var tsjson;
var buyTimeoutHandle, bellTimeoutHandle;
$(window).on('load', function () {
    // 名稱 單價 份數 總價
    $.getJSON(idFoodsJsonPath, function (data) {
        tsjson = data;
    }).done(function () {
        updateBellList();
        updateBuyList();
    });
});

function updateBellList(){
    $.getJSON("/staff/bells.json", function (data) {
        $("#mybellList").empty();
        $("#mybellList").html('<h3 class="text-center">服務鈴列表</h3><br>');
        $.each(data, function (i, item) {
            var mytableId = item.tableId;
            var mytableNum = item.tableNum;
            $("#mybellList").append(makeBell(mytableNum, mytableId));
        });
    }).always(function () {
        bellTimeoutHandle = setTimeout(updateBellList, 5000);
    });
}

function updateBuyList(){
    $.getJSON("/staff/orders.json", function (data) {
        $("#mybuyList").empty();
        $("#mybuyList").html('<h3 class="text-center">訂單列表</h3><br>');
        $.each(data, function (i, item) {
            var mytableId = item.tableId;
            var mytableNum = item.tableNum;
            var myorders = item.order;

            $("#mybuyList").append(maketable(mytableNum, mytableId));

            $.each(myorders, function (index, order) {
                var myorderID = order.id;
                var myfood = tsjson[myorderID];
                var myname = myfood.name;
                var mycount = order.count;
                var myscount = order.scount;

                $("#mytable" + mytableId).append(makeElement(mytableId, myorderID, myname, mycount, myscount));
            });

        });
    }).done(function () {
        // $("#mybuylist").append(maketotal(mytotalprice));
    }).always(function () {
        buyTimeoutHandle = setTimeout(updateBuyList, 10000);
    });
}

function maketable(tableNum, tableId) {
    var myhtml =
        '<div class="tabletitle">' +
        '<span class="btn btn-black disableClick form-setting form-control text-center">' + tableNum + "桌" + '</span>' +
        '</div>' +
        '<table class="table table-striped" id="' + "mytable" + tableId + '">' +
        '<thead>' +
        '<tr>' +
        '<th class="text-center" width="40%">名稱</th>' +
        '<th class="text-center" width="15%">份數</th>' +
        '<th class="text-center servecount" width="15%">待上</th>' +
        '<th class="text-center" width="30%">設定</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="mytablebody">' +

        '</tbody>' +
        '</table>';

    return myhtml;
}

function delfromList(tableId, orderID, delbutton) {
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
            editOrder(tableId, orderID, -1);
        }, function (dismiss) {
            if (dismiss === 'cancel') {

            }
        });
}

function makeElement(tableId, orderID, name, count, scount) {
    var myhtml =
        '<tr class="text-center">' +
        '<td class="scrolltd">' + name + '</td>' +
        '<td>' + count + '</td>';

    if (scount == 0)
        myhtml += '<td class="overcount">' + scount + '</td>';
    else
        myhtml += '<td class="servecount">' + scount + '</td>';

    myhtml +=
        '<td>' +
        '<span class="btn btn-success btn-xs" ' +
        'onclick="calculate(' + tableId + ','
        + orderID + ',' + count + ',' +
        "this" + "," + "true" + ');">＋' +
        '</span>' +

        '<span class="btn btn-warning btn-xs" ' +
        'onclick="calculate(' + tableId + ','
        + orderID + ',' + count + ',' +
        "this" + "," + "false" + ');">－' +
        '</span>' +

        '<span class="btn btn-danger btn-xs" ' +
        'onclick="delfromList(' + tableId + ','
        + orderID + ',' + "this" + ');">Ｘ' +
        '</span>' +
        '</td>' +
        '</tr>';

    return myhtml;
}

function calculate(tableId, orderID, count, setting, addorminus) {
    var scount = setting.parentElement.previousElementSibling;

    var num = scount.innerText;
    num = parseInt(num);

    if (addorminus == true) {
        if (num < count) {
            num += 1;

            editOrder(tableId, orderID, num);
        }
    }
    else {
        if (num > 0) {
            num -= 1;

            editOrder(tableId, orderID, num);
        }
    }
}

function delBell(bell,tableId) {
    swal(
        {
            title: '確定刪除？',
            text: '按下確定服務鈴將會被刪除...',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f0ad4e',
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
        }).then(function () {
            bell.replaceWith('');
            var waiterJson = {
                "action": "deleteBell",
                "tableId": tableId
            };
            $.ajax({
                url: "/staff/editOrder",
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                headers: { "X-CSRFToken": Cookies.get('csrftoken') },
                data: JSON.stringify(waiterJson),
                dataType: 'text',
                success: function (result) {
                    if (result === "success") {
                        clearTimeout(bellTimeoutHandle);
                        updateBellList();
                    }else{
                        someError();
                    }
                },
                error: function (result) {
                    someError();
                }
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {

            }
        });
}


function makeBell(tableNum, tableId) {
    var myhtml =
        '<button class="bellbutton btn btn-danger" onclick="delBell(this,' + tableId +');">' +
        + tableNum +
        '</button>';

    return myhtml;
}


function editOrder(tableId, foodID, scount) {
    var waiterJson = {
        "action": "editOrder",
        "tableId": tableId,
        "order": {
            "id": foodID,
            "scount": scount
        }
    };
    $.ajax({
        url: "/staff/editOrder",
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        headers: { "X-CSRFToken": Cookies.get('csrftoken') },
        data: JSON.stringify(waiterJson),
        dataType: 'text',
        success: function (result) {
            if (result === "success") {
                clearTimeout(buyTimeoutHandle);
                updateBuyList();
            }else{
                someError();
            }
        },
        error: function (result) {
            someError();
        }
    });
}

function someError() {
    swal('發生錯誤',
        '發生錯誤請再試一次！',
        'error').then(function () {
            location.reload();
        });
}