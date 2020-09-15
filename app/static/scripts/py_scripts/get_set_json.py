import json
import sys
[sys.path.append(i) for i in ['.', '..']]
from app import config
# from config import root_dir


def get_set_json(set_name):
    set_file = f'{config.root_dir}/app/static/json_card_files/{set_name}_cards.json'
    with open(set_file) as f:
        return json.load(f)


if __name__ == "__main__":
    print(get_set_json('ZNR'))
