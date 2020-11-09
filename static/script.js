//리뷰 추가하기, 닫기 버튼
function writeBtn() {
    if ($('#write_wrap').css('display') == 'block') {
        $('#write_wrap').hide();
    } else {
        $('#write_wrap').show();
    }
}


//리뷰 작성 및 저장
$(document).ready(function () {
    $('#review_box').html('');
    getReview();
});

function writeComplete() {
    let date = $('#post_date').val();
    let title = $('#post_title').val();
    let url = $('#post_url').val();
    let comment = $('#post_comment').val();

    if (date == '') {
        alert('날짜를 입력해주세요');
        // return;
    } else if (title == '') {
        alert('제목을 입력해주세요');
        // return;
    } else if (url == '') {
        alert('url을 입력해주세요');
        // return;
    } else if (comment == '') {
        alert('리뷰를 입력해주세요');
        // return;
    } else {

        $.ajax({
            type: "POST",
            url: "/review",
            data: {date_give: date, url_give: url, comment_give: comment},
            success: function (response) {
                if (response["result"] == "success") {
                    alert(response["msg"]);
                    window.location.reload();
                }
            }
        })
    }
}

function getReview() {

    $.ajax({
        type: "GET",
        url: "/review",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let reviews = response['reviews'];

                for(let i=0; i<reviews.length; i++){
                    let poster = reviews[i]['poster'];
                    let date = reviews[i]['date'];
                    let title = reviews[i]['title'];
                    let comment = reviews[i]['comment'];

                    let tempHtml = `<div class="review clearfix">
                                        <img class="review_img"
                                             src="${poster}"
                                             alt="">
                                        <div class="review_wrap">
                                            <p class="review_date">${date}</p>
                                            <p class="review_title">${title}</p>
                                            <span class="line"></span>
                                            <p class="review_line">"${comment}"</p>
                                        </div>
                                        <button onclick="close()" id="delete_btn" class="delete">
                                            <span class="material-icons">
                                                clear
                                            </span>
                                        </button>
                                    </div>`

                    $('#review_box').append(tempHtml);
                }

            } else {
                alert("리뷰를 받아오지 못했습니다");
            }
        }
    })
}

function validateLength(obj) {
    let content = $(obj).val();
    if (content.length > 130) {
        alert("리뷰는 130자까지 기록할 수 있습니다.");
        $(obj).val(content.substring(0, content.length - 1));
    }
}

//리뷰 지우기


//차트
google.charts.load("current", {packages: ["corechart"]});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Movie', 'Movie Genre'],
        ['드라마', 11],
        ['코미디', 5],
        ['액션', 2],
        ['기타', 2]
    ]);

    var options = {
        title: '나의 영화 취향',
        pieHole: 0.5,
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
}