from superorder.utilities.utilities import getRandomFileName

def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    return getRandomFileName('rest_food',ext)
