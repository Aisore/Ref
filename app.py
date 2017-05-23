#coding=utf-8
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/")
def hello():
    return render_template("index.html")

@app.route('/background_process')
def background_process(): 
	try:
		lang = request.args.get('proglang', 0, type=str)
		data = [i.split(', ') for i in lang.split(', \n')[:-1]]
		count = 0
		with open("static/data/nodes.csv", 'w') as f:
			f.write("source,target,type,label,id\n")
			
		for vals in data[1:]:
			for ind, val in enumerate(vals[1:]):
				with open("static/data/nodes.csv", 'a') as f:
					f.write(str(vals[0]) + ',' + str(data[0][ind+1]) + ',' + "licensing" + ',' + str(val) + ',' + str(count) + '\n')
					count += 1


		
	except Exception as e:
		return str(e)


if __name__ == "__main__":
    app.run()
