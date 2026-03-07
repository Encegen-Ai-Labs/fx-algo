import uuid

def generate_license_key():
    return str(uuid.uuid4()).upper()