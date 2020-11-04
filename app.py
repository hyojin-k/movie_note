from pymongo import MongoClient

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.myproject

# HTML 화면 보여주기
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/review ', methods=['POST'])
def review():
    title_receive = request.form['title_give']

    return jsonify({'result': 'success', 'msg': 'post 작업'})



@app.route('/review ', methods=['GET'])
def review():
    title_receive = request.args.get('title_give')

    return jsonify({'result': 'success', 'msg': 'get작업' })


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
