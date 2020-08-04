import random
import json
import pickle
import tflearn
import tensorflow
import numpy as np
import nltk
from nltk.stem.lancaster import LancasterStemmer
from flask import Flask, render_template, request
from flask import jsonify
stemmer = LancasterStemmer()
from sklearn.preprocessing import StandardScaler
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

#FOR COMPANY

with open("intents_C.json") as file:
    data = json.load(file)
tensorflow.reset_default_graph()
net = tflearn.input_data(shape=[None, 69 ])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 7, activation="softmax")
net = tflearn.regression(net)
model = tflearn.DNN(net)
model.load("modelc.tflearn")
words, labels, training, output = pickle.load(open('data6.pickle', 'rb'))

# FOR  JOBSEEKER
with open("intents_J.json") as file1:
    dataj= json.load(file1)
tensorflow.reset_default_graph()
netJ = tflearn.input_data(shape=[None, 72 ])
netJ = tflearn.fully_connected(netJ, 8)
netJ = tflearn.fully_connected(netJ, 8)
netJ = tflearn.fully_connected(netJ, 9, activation="softmax")
netJ = tflearn.regression(netJ)
modelJ = tflearn.DNN(netJ)
modelJ.load("modelj.tflearn")
wordsJ, labelsJ, trainingJ, outputJ = pickle.load(open('data5.pickle', 'rb'))

def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(str(s))
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1

    return np.array(bag)

@app.route('/', methods=['GET'])
def Home():
    return render_template('index.html')

standard_to = StandardScaler()

'''@app.route('/category', methods=['POST'])
def category():
    cat_val=request.form
    for key in cat_val.keys():
        data3 = key
    data_waste = json.loads(data3)
    
    return render_template('index.html')
print(Flag_cat)'''

@app.route('/predict', methods=['POST'])
def predict():
    chat = request.form
    for key in chat.keys():
        data1 = key
    data_dic = json.loads(data1)
    print(data_dic['lastmsg'])
    print(data_dic['flag'])
    Flag_cat=data_dic['flag']
    print(Flag_cat,type(Flag_cat))
    print(Flag_cat[0]=='COMP')
    if(Flag_cat[0]=='COMP'):
        results = model.predict([bag_of_words(chat, words)])

        results_index = np.argmax(results)
        tag = labels[results_index]
        #print(tag)
        print(np.max(results))
        if (np.max(results) <= 0.67):
            for tg in data["intents"]:
                if tg['tag'] == 'unrelated':
                    responses_resp = tg['responses']
                    resp_dict = {'response': random.choice(responses_resp)}
        else:
            for tg in data["intents"]:
                if tg['tag'] == tag:
                    responses_resp = tg['responses']
                    resp_dict = {'response': random.choice(responses_resp)}
    else:

        results = modelJ.predict([bag_of_words(chat, wordsJ)])

        results_index = np.argmax(results)
        tag = labelsJ[results_index]
        # print(tag)
        print(np.max(results))
        if (np.max(results) <= 0.67):
            for tg in dataj["intents"]:
                if tg['tag'] == 'unrelated':
                    responses_resp = tg['responses']
                    resp_dict = {'response': random.choice(responses_resp)}
        else:
            for tg in dataj["intents"]:
                if tg['tag'] == tag:
                    responses_resp = tg['responses']
                    resp_dict = {'response': random.choice(responses_resp)}


    print(random.choice(responses_resp))
    resp = jsonify(resp_dict)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    print(resp)
    #Work.logger.error('reached')
    #print(resp)
    return resp
    #return random.choice(responses)



if __name__ == "__main__":
    app.run(debug=True)