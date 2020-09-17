import json
import re
import sys
[sys.path.append(i) for i in ['.', '..']]
from app import config


def get_set_json(set_name):
    set_file = f'{config.root_dir}/app/static/json_card_files/{set_name}_cards.json'
    with open(set_file) as f:
        return json.load(f)

def get_abridged_cards(set_name):
    cards = get_set_json(set_name)['cards']

    cards_abridged = {}
    for card in cards:
        card_dic = {}
        card_text = {}
        if 'card_faces' in card and len(card['card_faces']) > 0:
            card_text = card['card_faces'][0]['oracle_text']
            card_dic['image_url'] = card['card_faces'][0]['image_uris']['normal']
            card_dic['colors'] = card['card_faces'][0]['colors']
        else:
            card_text = card['oracle_text']
            card_dic['image_url'] = card['image_uris']['normal']
            card_dic['colors'] = card['colors']

        attributes = [
            'id',
            'name',
            'type_line',
            'rarity',
            # 'colors',
            'cmc'
        ]

        for attr in attributes:
            card_dic[attr] = card[attr]

        card_text = re.sub(r'\n', ' ', card_text)
        card_text = re.sub(r'[^A-Za-z0-9\/\.,\-+:\* ]', '', card_text)
        card_dic['card_text'] = card_text

        cards_abridged[card['id']] = card_dic

    return cards_abridged


if __name__ == "__main__":
    print(get_set_json('ZNR'))
