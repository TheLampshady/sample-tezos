import json
import requests


THUMBNAIL = "https://tezostaquito.io/img/favicon.png"
SYM = "TUT"
FILENAME = "../image.jpeg"

META_NAME="TUT-metadata"


class PinataClient:
    # Pinata Endpoints
    url_test = "https://api.pinata.cloud/data/testAuthentication"
    url_file = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    url_json = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

    def __init__(self, api_key, secret_api_key, creator):
        self.api_key = api_key
        self.secret_api_key = secret_api_key
        self.creator = creator



    @property
    def headers(self):
        return {
            "pinata_api_key": self.api_key,
            "pinata_secret_api_key": self.secret_api_key,
        }

    @staticmethod
    def validate_metadata(metadata: dict):
        if "name" in metadata:
            if not isinstance(metadata["name"], str):
                raise ValueError('metadata name must be of type string')

        if "keyvalues" in metadata:
            if not isinstance(metadata["keyvalues"], dict):
                raise ValueError('metadata keyvalues must be of type dict')

            if len(metadata["keyvalues"]) > 9:
                raise ValueError('No more than 10 keyvalues can be provided for metadata entries')
            for key, value in metadata["keyvalues"].items():
                if not isinstance(value, (str, bool, int, float, complex)):
                    raise ValueError('Metadata keyvalue values must be strings, booleans, or numbers')

    @staticmethod
    def validate_file_response(resp: dict) -> bool:
        return resp.get("IpfsHash") and resp.get("PinSize", 0) > 0

    def file_metadata(self, title: str, description: str) -> str:
        """
        Creates the metadata for the file IPFS upload. Must be serialized JSON
        :param title: title of file
        :param description: a keyvalue for the metadata
        :return: str
        """
        title_clean = title.replace(" ", "-")
        key_values = dict(description=description)
        metadata = dict(name=title_clean, keyvalues=key_values)
        self.validate_metadata(metadata)
        return json.dumps(metadata)

    def test_pinata(self) -> bool:
        """ Hits the Pinata test API"""
        resp = requests.get(self.url_test, headers=self.headers)
        print(resp.content)
        return resp.status_code == 200

    def pin_file_to_ipfs(self, title: str, description: str = "", file_name: str = FILENAME) -> str:
        """
        Uploads the file to the Pinata image service
        :param title: Name of file
        :param description: Metadata key value
        :param file_name: Name of local file to open
        :return: str - the ipfs hash of the file
        """
        options = dict(pinataMetadata=self.file_metadata(title, description))
        files = {'file': open(file_name,'rb')}
        resp = requests.post(self.url_file, files=files, headers=self.headers, data=options)
        if not self.validate_file_response(resp.json()):
            raise ConnectionError("file was not pinned")
        return resp.json()['IpfsHash']

    def pin_json_to_ipfs(self, title: str, description: str = "", ipfs_hash: str = "") -> str:
        """
        Uploads the file to the Pinata image service
        :param title: Name of file
        :param description: Metadata key value
        :param ipfs_hash: hash for the file system on pinata
        :return: str - the ipfs hash of the json
        """
        image_url = f"ipfs://${ipfs_hash}"
        pinata_content = dict(
            name=title,
            description=description,
            symbol=SYM,
            artifactUri=image_url,
            displayUri=image_url,
            creators=[self.creator],
            decimals=0,
            thumbnailUri=THUMBNAIL,
            is_transferable=True,
            shouldPreferSymbol=False
        )
        data = dict(
            pinataContent=json.dumps(pinata_content),
            pinataMetadata=json.dumps(dict(name=META_NAME))
        )
        resp = requests.post(self.url_json, headers=self.headers, data=data)
        if not self.validate_file_response(resp.json()):
            raise ConnectionError("json was not pinned")
        return resp.json()['IpfsHash']
