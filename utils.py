import sqlite3
import logging

config = dict(dbpath="/LocalOrz.db", datapath="/data", srcpath="/src")

def InitDatabase(Path):
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
