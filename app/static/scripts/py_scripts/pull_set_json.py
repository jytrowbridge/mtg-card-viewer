import json
import os
import requests
import sys
[sys.path.append(i) for i in ['.', '..']]
from app import config


def pull_set_json(set_name, out_dir):
    """Create json file of all cards in a given MTG Set.

    Arguments:
        set_name -- the official three-letter set abbreviation (e.g. 'M21')
    Out file will have name <set_name>_cards.json
    """

    cards = []
    url = f'https://api.scryfall.com/cards/search?order=cmc&q=set%3A{set_name}'

    while True:
        response = requests.get(url)
        resp_json = response.json()
        cards += resp_json['data']
        if resp_json['has_more']:
            url = resp_json['next_page']
        else:
            break

    out_json = {'cards': cards}
    # file_name = f'{out_dir}/{set_name}_cards.json'
    file_name = get_file_name(out_dir, set_name)
    with open(file_name, 'w') as f:
        json.dump(out_json, f, indent=2)


def get_file_name(out_dir, set_name):
    return f'{out_dir}/{set_name}_cards.json'


if __name__ == "__main__":
    out_dir = config.root_dir + '/app/static/json_card_files'

    for set_name in config.set_list:
        file_name = get_file_name(out_dir, set_name)
        if os.path.exists(file_name):
            print(f'File for set {set_name} already exists. Skipping')
            continue
        print(f'Creating file for set {set_name}')
        pull_set_json(set_name, out_dir=out_dir)
