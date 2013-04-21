import re
import os
import logging

reLastNumber = re.compile(r'(\d+)(?!.*\d)')

def getNextDataFile(path):
    nextpath = reLastNumber.sub(lambda match: str(int(match.group(1))+1), path)
    return None if path == nextpath else nextpath

def getDataFiles(datapath):
    res = []
    for dirpath, dirnames, filenames in os.walk(datapath):
        for filename in filenames:
            res.append(os.path.join(dirpath, filename).replace(datapath, '').decode('utf-8'))
    return res

def getMatchedDataFiles(path, data):
    res = []
    for filepath in data:
        if path in filepath:
            res.append(filepath)
    return res

def getNextDataFiles(path, data):
    res = []
    while True:
        path = getNextDataFile(path)
        if not path or path not in data:
            break
        res.append(path)
    return res

