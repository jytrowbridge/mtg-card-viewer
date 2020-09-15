from app import app
from app.config import set_list, default_set
from app.static.scripts.py_scripts.get_set_json import get_set_json

@app.route('/')
# @app.route('/index')
def index():
    set_data = get_set_json(default_set)
    return set_data['cards'][0]


# @app.route('/<set_name>')
# @app.route('/index')
# def display_cards(set_name):
    # return render_template()