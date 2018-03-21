import uuid
import os
from django.utils.html import escape

def getRandomFileName(path, ext):
    """return random filename """
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join(path, filename)

# html escape query depend on escapeList
def QueryEscape(query, escapeList):
    """
        query : list->dict
        escapeList : dict keys
    """
    q = list(query)
    for i in range(len(q)):
        for j in escapeList:
            k = q[i].get(j)
            if k:
                q[i][j] = escape(k)
    return q
