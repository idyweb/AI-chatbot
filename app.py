from flask import Flask, request, jsonify, render_template
from chatbot import predict_class, get_response, intents

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index_get():
    return render_template('base.html') 

@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get("message")
    intents_list = predict_class(text)
    response = get_response(intents_list, intents)
    message = {"answer":response}
    return jsonify(message)

if __name__ == '__main__':
    app.run(debug=True)