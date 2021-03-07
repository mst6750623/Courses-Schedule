from flask import Flask, request, jsonify, abort, redirect, url_for
import json
import pandas as pd
from flask_cors import *
import os
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flask import send_from_directory

UPLOAD_FOLDER = 'path/uploads/'
ALLOWED_EXTENSIONS = set(['xls', 'xlsx'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app, supports_credentials=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def home():
    return '<h1>Home</h1>'

# 只接受get方法访问
@app.route("/api/Upload", methods=["POST"])
def main():
    # 默认返回内容
    num = 0
    file1 = request.files['major_file']
    if file1 and allowed_file(file1.filename):
        print(file1.filename)
        #filename = secure_filename(file.filename)
        filename = file1.filename
        file1.save(app.config['UPLOAD_FOLDER']+filename)
        #file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        num = num + 1

    file2 = request.files['job_file']
    if file2 and allowed_file(file2.filename):
        print(file2.filename)
        #filename = secure_filename(file.filename)
        filename = file2.filename
        file2.save(app.config['UPLOAD_FOLDER']+filename)
        #file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        num = num + 1

    json_dict = {
        "status": "success",
        "file_nums": num
    }
    data = json.dumps(json_dict)
    return data, 200, {"ContentType": "application/json"}



@app.route('/api/Uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


if __name__ == "__main__":
    app.run(debug=True)

