// Service Bell
function servicebell() {
    $.ajax({
        url: "./callBell",
        type: 'GET',
        dataType: 'text',
        success: function (result) {
            if (result === "success") {
                swal('您點了服務鈴',
                    '服務人員將會盡快為您服務！',
                    'success')
            } else if (result === "called") {
                swal('已按過服務鈴',
                    '您已經按過服務鈴，請耐心等待或直接召喚服務人員！',
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