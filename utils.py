import re
import os
import sqlite3
import logging

config = dict(dbpath="/LocalOrz.db", datapath="/data", srcpath="/src")
reLastNumber = re.compile(r'(\d+)(?!.*\d)')

def initDatabase(Path):
    conn = sqlite3.connect(Path)
    cur = conn.cursor();
    cur.execute('CREATE TABLE problems (id INTEGER PRIMARY KEY, name TEXT, filename TEXT)')
    cur.execute('CREATE TABLE problem_metas (id INTEGER PRIMARY KEY, pid INT, type TEXT, value TEXT)')
    cur.execute('CREATE TABLE testdata (id INTEGER PRIMARY KEY, pid INT, type TEXT, path TEXT, time INT, memory INT, point INT)')
    cur.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, score INT)')
    cur.execute('CREATE TABLE submits (id INTEGER PRIMARY KEY, pid INT, uid INT, status TEXT, score INT, memory INT, time INT, lang TEXT, length INT, timestamp INT, compileinfo TEXT)')
    cur.execute('CREATE TABLE testcase (id INTEGER PRIMARY KEY, tid INT, status INT, point INT, judgeinfo TEXT)')
    cur.execute('CREATE TABLE contest (name TEXT, score INT)')

    conn.commit()
    cur.close()

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
