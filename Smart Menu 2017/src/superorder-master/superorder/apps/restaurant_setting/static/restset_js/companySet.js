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