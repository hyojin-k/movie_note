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
    getChart();
    $('#actors').html('');
    $('#movie_list1').html('');
    $('#movie_list2').html('');
    getActor();
});

function writeComplete() {
    let date = $('#post_date').val();
    let title = $('#post_title').val();
    let url = $('#post_url').val();
    let comment = $('#post_comment').val();

    if (date == '') {
        alert('날짜를 입력해주세요');
        return;
    } else if (title == '') {
        alert('제목을 입력해주세요');
        return;
    } else if (url == '') {
        alert('url을 입력해주세요');
        return;
    } else if (comment == '') {
        alert('리뷰를 입력해주세요');
        return;
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

                for (let i = 0; i < reviews.length; i++) {
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
                                        <a href="#" onclick="deleteReview()" id="delete_btn" class="delete">
                                            <span class="material-icons">
                                                clear
                                            </span>
                                        </a>
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

function drawChart() {
    $.ajax({
        type: "GET",
        url: "/genre",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let genre = response['genre'];

                var data = google.visualization.arrayToDataTable([
                    ['Movie', 'Movie Genre'],
                    [genre[0]._id, genre[0].count],
                    [genre[1]._id, genre[1].count],
                    [genre[2]._id, genre[2].count],
                    [genre[3]._id, genre[3].count],
                    [genre[4]._id, genre[4].count]
                ]);

                var options = {
                    title: '',
                    pieHole: 0.4,
                };

                var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                chart.draw(data, options);


                let top_genre = response['top_genre']

                let genre1 = top_genre[0];
                let genre2 = top_genre[1];
                let genre3 = top_genre[2];

                let tempHtml = `<li>${genre1}</li>
                                <li>${genre2}</li>
                                <li>${genre3}</li>`

                $('#movie_list1').append(tempHtml);

            }
        }
    })
}


function getChart() {
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(drawChart);

}

//배우

function getActor() {

    $.ajax({
        type: "GET",
        url: "/actor",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let actor = response['actor'];
                let movies1 = response['movie1'];


                let image_fir = actor[0]['_id']['image'];
                let actor_fir = actor[0]['_id']['actor'];
                let image_sec = actor[1]['_id']['image'];
                let actor_sec = actor[1]['_id']['actor'];
                let image_trd = actor[2]['_id']['image'];
                let actor_trd = actor[2]['_id']['actor'];


                let movie1_1 = movies1[0];
                let movie1_2 = movies1[1];
                let movie1_3 = movies1[2];


                let tempHtml = `<button class="actor_btn">
                                    <img class="actor_img"
                                         src="${image_fir}"
                                         alt="">
                                    <p class="actor_name">${actor_fir}</p>
                                </button>
                                <button class="actor_btn">
                                    <img class="actor_img"
                                         src="${image_sec}"
                                         alt="">
                                    <p class="actor_name">${actor_sec}</p>
                                </button>
                                <button class="actor_btn">
                                    <img class="actor_img"
                                         src="${image_trd}"
                                         alt="">
                                    <p class="actor_name">${actor_trd}</p>
                                </button>`


                let listHtml1 = `<li>${movie1_1}</li>
                                <li>${movie1_2}</li>
                                <li>${movie1_3}</li>`


                $('#actors').append(tempHtml);

                $('#movie_list2').append(listHtml1);
            }
        }
    })

}