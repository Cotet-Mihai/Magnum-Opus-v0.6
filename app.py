from flask import Flask
from dotenv import load_dotenv
import os


# Load the variables from the .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)