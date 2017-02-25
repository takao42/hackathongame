from flask import Flask,render_template, request,json

app = Flask(__name__)

@app.route('/')
def game():
    return render_template('index.html')

@app.route('/signUp')
def signUp():
    return render_template('signUp.html')

@app.route('/gameState', methods=['POST'])
def gameState():
    print(request.values)
    #return json.dumps({'status':'OK','players':players,'positions':positions});
    return 1;

if __name__=="__main__":
    app.run()
    