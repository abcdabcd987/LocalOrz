import re
import os
import logging
from pprint import pprint

reLastNumber = re.compile(r'(\d+)(?!.*\d)')

def isFileExist(path):
    return os.access(path, os.F_OK)

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

def initDatabase(conn):
    cur = conn.cursor()
    cur.execute('CREATE TABLE problems (id INTEGER PRIMARY KEY, name TEXT, filename TEXT, checker TEXT)')
    cur.execute('CREATE TABLE problem_metas (id INTEGER PRIMARY KEY, pid INT, type TEXT, value TEXT)')
    cur.execute('CREATE TABLE testdata (id INTEGER PRIMARY KEY, pid INT, type TEXT, path TEXT, time INT, memory INT, point INT)')
    cur.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, score INT)')
    cur.execute('CREATE TABLE submits (id INTEGER PRIMARY KEY, pid INT, uid INT, status TEXT, score INT, memory INT, time INT, lang TEXT, length INT, timestamp INT, compileinfo TEXT)')
    cur.execute('CREATE TABLE testcase (id INTEGER PRIMARY KEY, tid INT, status TEXT, point INT, judgeinfo TEXT)')
    cur.execute('CREATE TABLE contest (name TEXT, score INT)')

    conn.commit()
    cur.close()

def addProblem(conn, name, filename, checker, extra, additions):
    cur = conn.cursor()
    cur.execute('INSERT INTO problems (name, filename, checker) VALUES (?, ?, ?)', (name, filename, checker))
    pid = cur.lastrowid
    if checker != 'standard':
        cur.execute('INSERT INTO problem_metas (pid, type, value) VALUES (?, ?, ?)', (pid, 'checkerExtra', extra))
    for addition in additions:
        cur.execute('INSERT INTO problem_metas (pid, type, value) VALUES (?, ?, ?)', (pid, 'additionFile', addition))
    conn.commit()
    cur.close()

def getProblems(conn):
    res = list()
    cur = conn.cursor()
    cur.execute('SELECT id, name, filename, checker FROM problems')
    for pid, name, filename, checker in cur.fetchall():
        prob = dict(id=pid, name=name, filename=filename, checker=checker, additions=list())
        cur.execute('SELECT type, value FROM problem_metas WHERE pid = ?', (pid,))
        for metaType, metaValue in cur.fetchall():
            if metaType == 'checkerExtra':
                prob['extra'] = int(metaValue) if checker == 2 else metaValue
            elif metaType == 'additionFile':
                prob['additions'].append(metaValue)
            else:
                logging.warning('Unknown problem meta: (%s, %s)' % (metaType, metaValue))
        res.append(prob)
    return res

def addTestcase(conn, cases):
    cur = conn.cursor()
    for pid, ctype, path, time, memory, point in cases:
        cur.execute('INSERT INTO testdata (pid, type, path, time, memory, point) VALUES (?, ?, ?, ?, ?, ?)', (int(pid), ctype, path, int(time), int(memory), int(point)))
    conn.commit()
    cur.close()
