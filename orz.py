import utils
import sqlite3
import logging

class Orz(object):
    def __init__(self):
        self.config = dict(dbpath="/LocalOrz.db", datapath="/data", srcpath="/src")
        self.db = None
        self.data = None
        self.problem = None

    def initDatabase(self, create=False):
        self.db = sqlite3.connect(self.config['root'] + self.config['dbpath'])
        if not create:
            return
        cur = self.db.cursor()
        cur.execute('CREATE TABLE problems (id INTEGER PRIMARY KEY, name TEXT, filename TEXT, checker INT)')
        cur.execute('CREATE TABLE problem_metas (id INTEGER PRIMARY KEY, pid INT, type TEXT, value TEXT)')
        cur.execute('CREATE TABLE testdata (id INTEGER PRIMARY KEY, pid INT, type TEXT, path TEXT, time INT, memory INT, point INT)')
        cur.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, score INT)')
        cur.execute('CREATE TABLE submits (id INTEGER PRIMARY KEY, pid INT, uid INT, status TEXT, score INT, memory INT, time INT, lang TEXT, length INT, timestamp INT, compileinfo TEXT)')
        cur.execute('CREATE TABLE testcase (id INTEGER PRIMARY KEY, tid INT, status INT, point INT, judgeinfo TEXT)')
        cur.execute('CREATE TABLE contest (name TEXT, score INT)')

        self.db.commit()
        cur.close()

    def updateData(self):
        self.data = utils.getDataFiles(self.config['root'] + self.config['datapath'])

    def updateProblem(self):
        pass

    def addProblem(self, name, filename, checker, extra, additions):
        cur = self.db.cursor()
        cur.execute('INSERT INTO problems (name, filename, checker) VALUES (?, ?, ?)', (name, filename, checker))
        pid = cur.lastrowid
        if checker != 1:
            cur.execute('INSERT INTO problem_metas (pid, type, value) VALUES (?, ?, ?)', (pid, 'checkerExtra', extra))
        for addition in additions:
            cur.execute('INSERT INTO problem_metas (pid, type, value) VALUES (?, ?, ?)', (pid, 'additionFile', addition))
        self.db.commit()
        cur.close()

        self.problem = self.updateProblem()

orz = Orz()
