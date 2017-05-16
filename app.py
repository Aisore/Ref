from flask import Flask, jsonify, request, render_template


app = Flask(__name__)

@app.route("/")
def hello():
    return render_template("index.html")

@app.route('/background_process')
def background_process():
	try:
		lang = request.args.get('proglang', 0, type=str)
		if lang.lower() == 'python':
			return jsonify(result='You are wise')
		else:
			return jsonify(result='Try again.')
	except Exception as e:
		return str(e)


if __name__ == "__main__":
    app.run()
