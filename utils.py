import re
import os
import string
import random
import logging
import datetime

reLastNumber = re.compile(r'(\d+)(?!.*\d)')

def getToday():
    return datetime.date.today().strftime('%Y%m%d')

def getRandomString():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(8))

def isFileExist(path):
    return os.access(path, os.F_OK)

def getNextTestcase(path):
    nextpath = reLastNumber.sub(lambda match: str(int(match.group(1))+1), path)
    return None if path == nextpath else nextpath

def getDataFiles(datapath):
    res = []
    datapath += '/'
    for dirpath, dirnames, filenames in os.walk(datapath):
        for filename in filenames:
            res.append(os.path.join(dirpath, filename).replace(datapath, ''))
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
    cur.execute('CREATE TABLE testcases (id INTEGER PRIMARY KEY, pid INT, time INT, memory INT, point INT)')
    cur.execute('CREATE TABLE testcase_paths (id INTERGER PRIMARY KEY, tid INT, type TEXT, path TEXT)')
    cur.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, score INT)')
    cur.execute('CREATE TABLE submits (id INTEGER PRIMARY KEY, pid INT, uid INT, status TEXT, score INT, memory INT, time INT, lang TEXT, length INT, timestamp INT, compileinfo TEXT)')
    cur.execute('CREATE TABLE result (id INTEGER PRIMARY KEY, tid INT, status TEXT, point INT, judgeinfo TEXT)')
    cur.execute('CREATE TABLE contest_metas (type TEXT, value TEXT)')

    conn.commit()
    cur.close()

def addContestMeta(conn, metaType, metaValue):
    cur = conn.cursor()
    cur.execute('INSERT INTO contest_metas (type, value) VALUES (?, ?)', (metaType, metaValue))
    conn.commit()
    cur.close()

def getContestMetas(conn):
    cur = conn.cursor()
    cur.execute('SELECT * FROM contest_metas')
    res = dict()
    for metaType, metaValue in cur.fetchall():
        res[metaType] = metaValue
    return res

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
    cur.close()
    return res

def addTestcase(conn, cases):
    cur = conn.cursor()
    for testcase in cases:
        cur.execute('INSERT INTO testcases (pid, time, memory, point) VALUES (?, ?, ?, ?)', (int(testcase['metas'][0]), int(testcase['metas'][1]), int(testcase['metas'][2]), int(testcase['metas'][3])))
        tid = cur.lastrowid
        for pathType, path in testcase['paths']:
            cur.execute('INSERT INTO testcase_paths (tid, type, path) VALUES (?, ?, ?)', (tid, pathType, path))
    conn.commit()
    cur.close()

def getTestcases(conn, pid):
    res = list()
    cur = conn.cursor()
    cur.execute('SELECT id, time, memory, point FROM testcases WHERE pid = ? ORDER BY id ASC', (int(pid),))
    for tid, time, memory, point in cur.fetchall():
        cur.execute('SELECT type, path FROM testcase_paths WHERE tid = ?', (tid,))
        testcase = dict(time=time, memory=memory, point=point, inputs=list(), output=None)
        for pathType, path in cur.fetchall():
            if pathType == 'output':
                testcase['output'] = path
            elif pathType == 'input':
                testcase['inputs'].append(path)
            else:
                logging.warning('Unknown testcase_path type: ' + pathType)
        res.append(testcase)
    return res
