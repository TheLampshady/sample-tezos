#!/usr/bin/env python
import os
import sys
from dotenv import load_dotenv

load_dotenv()


# Metadata
TITLE = "My NFT Title"
DESCRIPTION = "This is my short description."


def run():
    """ Executes the main program"""
    api_key = os.getenv('PINATA_API_KEY')
    secret_api_key = os.getenv('PINATA_SECRET_KEY')
    creator = os.getenv('WALLET_PUBLIC')

    client = PinataClient(api_key, secret_api_key, creator)

    if not client.test_pinata():
        return
    ipfs_file_hash = client.pin_file_to_ipfs(TITLE, DESCRIPTION)
    ipfs_json_hash = client.pin_json_to_ipfs(TITLE, DESCRIPTION, ipfs_file_hash)
    return ipfs_json_hash


if __name__ == "__main__":
    # from main import *
    os.chdir(sys.path[0])
    print(run())
