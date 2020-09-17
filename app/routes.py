from flask import render_template
import json
from app import app
from app.config import set_list, default_set
from app.static.scripts.py_scripts.get_set_json import get_set_json

import re
import unicodedata


def remove_control_characters(s):
    return "".join(ch for ch in s if unicodedata.category(ch)[0] != "C")


@app.route('/')
@app.route('/index')
def default():
    cards = get_set_json(default_set)['cards']
    # test_dic = {'jack': 'cool'}

    card_text = {}

    cards_abridged = {}
    for card in cards:
        if 'card_faces' in card and len(card['card_faces']) > 0:
            continue
        card_dic = {}
        attributes = [
            'id',
            'name',
            'type_line',
            'rarity',
            'colors',
            'cmc'
        ]
        for attr in attributes:
            card_dic[attr] = card[attr]
        card_text = card['oracle_text']
        card_text = re.sub(r'\n', ' ', card_text)
        card_text = re.sub(r'[^A-Za-z0-9\/\.,\-+:\* ]', '', card_text)
        card_dic['card_text'] = card_text

        cards_abridged[card['id']] = card_dic

    return render_template(
            'test.html',
            set_list=set_list,
            default_set=default_set,
            cards_json=cards_abridged,
            cards=cards
        )


# @app.route('/<set_name>')
# @app.route('/index')
# def display_cards(set_name):
    # return render_template()
