import json
import re
import sys
[sys.path.append(i) for i in ['.', '..']]
from app import config


def get_set_json(set_name):
    # Return JSON from file in json_card_files associated with given set_name.
    set_file = f'app/static/json_card_files/{set_name}_cards.json'
    with open(set_file) as f:
        return json.load(f)


def get_cmc(mana_cost):
    # Return cmc value given mana_cost in string form

    mana_cost = mana_cost[1:-1]  # remove opening and closing bracket
    mana_parts = mana_cost.split('}{')
    cmc = 0
    if mana_parts[0].isnumeric():
        cmc += int(mana_parts.pop(0))
    for mana_symbol in mana_parts:
        if mana_symbol != 'X':
            cmc += 1
    return cmc


def get_abridged_cards(set_name):
    # Return dictionary of cards with select attributes.
    # Accepts parameter <set_name>, which should have an associated file in the json_card_files directory.
    cards = get_set_json(set_name)['cards']

    cards_abridged = {}
    for card in cards:
        card_dic = {}
        card_text = {}
        if card['layout'] == 'modal_dfc':
            card_text = card['card_faces'][0]['oracle_text']
            card_dic['image_url'] = card['card_faces'][0]['image_uris']['normal']
            card_dic['colors'] = card['card_faces'][0]['colors']
            card_dic['cmc'] = [card['cmc']]
        elif card['layout'] == 'split' or card['layout'] == 'adventure':
            # the cmc value is broken; it combines the cmc's of the two sides
            # The images also do not contain the full text for split cards
            card_text = []
            cmc = []
            for card_face in card['card_faces']:
                card_text.append(card_face['oracle_text'])
                cmc.append(get_cmc(card_face['mana_cost']))
            card_text = ','.join(card_text)
            card_dic['cmc'] = cmc
            card_dic['image_url'] = card['image_uris']['normal']
            card_dic['colors'] = card['colors']
        else:
            card_text = card['oracle_text']
            card_dic['image_url'] = card['image_uris']['normal']
            card_dic['colors'] = card['colors']
            card_dic['cmc'] = [card['cmc']]

        attributes = [
            'id',
            'name',
            'type_line',
            'rarity',
            # 'colors',
            # 'cmc'
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
