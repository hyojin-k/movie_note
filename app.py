from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
client = MongoClient('localhost', 27017)

# client = MongoClient('mongodb://test:test@52.78.113.103', 27017)
db = client.myproject

# HTML 화면 보여주기
@app.route('/')
def home():
    return render_template('index.html')

# 리뷰 작성
@app.route('/review', methods=['POST'])
def write_review():

    date_receive = request.form['date_give']
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']

    # 스크래핑
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    # meta 스크래핑
    og_image = soup.select_one('meta[property="og:image"]')
    og_title = soup.select_one('meta[property="og:title"]')

    url_poster = og_image['content']
    url_title = og_title['content']

    # 세부정보 스크래핑

    # content > div.article > div.mv_info_area > div.mv_info > dl > dd:nth-child(2) > p > span:nth-child(1)
    # content > div.article > div.mv_info_area > div.mv_info > dl > dd:nth-child(2) > p > span:nth-child(1) > a:nth-child(1)

    # content > div.article > div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(2) > a.thumb_people > img
    # content > div.article > div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(3) > a.thumb_people > img

    infos = soup.select('#content > div.article')

    for info in infos:
        genre = info.select_one('div.mv_info_area > div.mv_info > dl > dd:nth-child(2) > p > span:nth-child(1)').text.split(',')[0].strip()
        image_fir = info.select_one('div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(2) > a.thumb_people > img')['src']
        actor_fir = info.select_one('div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(2) > a.thumb_people > img')['alt']
        image_sec = info.select_one('div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(3) > a.thumb_people > img')['src']
        actor_sec = info.select_one('div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(3) > a.thumb_people > img')['alt']
        image_trd = info.select_one('div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(4) > a.thumb_people > img')['src']
        actor_trd = info.select_one('div.section_group.section_group_frst > div:nth-child(2) > div > ul > li:nth-child(4) > a.thumb_people > img')['alt']

        doc = {
            'date': date_receive,
            'url': url_receive,
            'poster' : url_poster,
            'title': url_title,
            'genre': genre,
            'actors' : [
                {
                    'actor': actor_fir,
                    'image': image_fir
                 },
                {
                    'actor': actor_sec,
                    'image': image_sec
                },
                {
                    'actor': actor_trd,
                    'image': image_trd
                }
            ],
            'comment': comment_receive
        }

        db.reviews.insert_one(doc)

    return jsonify({'result': 'success', 'msg': '리뷰가 저장되었습니다.'})


@app.route('/review', methods=['GET'])
def get_review():
    reviews = list(db.reviews.find({},{'_id':False}))

    return jsonify({'result': 'success', 'reviews': reviews })


# 리뷰 지우기



# 차트

@app.route('/genre', methods=['GET'])
def count_genre():
    genre = list(db.reviews.aggregate([
        {'$group':{'_id':'$genre', 'count':{'$sum':1}}},
        {'$sort': {'count': -1}},
        {'$limit':5}
    ]))

    # data = {'Movie' : 'Movie Genre', genre[0]['_id'] : genre[0]['count'], genre[1]['_id'] : genre[1]['count'], genre[2]['_id'] : genre[2]['count'], genre[3]['_id'] : genre[3]['count'], genre[4]['_id'] : genre[4]['count'] }
    # print(data)

    genre_list = list(db.reviews.find({'genre':{'$in':[genre[0]["_id"]]}}))
    print(genre_list)

    top_genre = []
    for genres in genre_list:
        print(genres['title'])
        top_genre.append(genres['title'])

    return jsonify({'result': 'success', 'genre': genre, 'top_genre': top_genre})

#

# 배우

@app.route('/actor', methods=['GET'])
def count_actor():
    actor = list(db.reviews.aggregate([

        {'$unwind':{'path':'$actors'}},
        {'$group':{'_id':'$actors', 'count':{'$sum':1}}},
        {'$sort':{'count':-1}},
        {'$limit':3}

    ]))
    # print(actor)


    movie_list1 = list(db.reviews.find({'actors.actor':{'$in':[actor[0]["_id"]["actor"]]}}))

    top_movie1 = []
    for movies1 in movie_list1:
        print(movies1['title'])
        top_movie1.append(movies1['title'])

    # print(movie_list)

    return jsonify({'result': 'success', 'actor': actor, 'movie1': top_movie1})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
