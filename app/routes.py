from flask import render_template
from app import app
from app.config import set_list, default_set
from app.static.scripts.py_scripts.get_set_json import get_abridged_cards


@app.route('/')
@app.route('/index')
def default():
    return display_cards(default_set)


@app.route('/<set_name>')
@app.route('/index')
def display_set(set_name):
    set_name = set_name.upper()
    if set_name not in set_list:
        return render_template('set_not_found.html')
    return display_cards(set_name)


def display_cards(set_name):
    cards = get_abridged_cards(set_name)

    return render_template(
        'show_cards.html',
        set_list=set_list,
        default_set=set_name,
        cards=cards
    )
