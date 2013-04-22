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
        if create:
            utils.initDatabase(self.db)

    def updateData(self):
        self.data = utils.getDataFiles(self.config['root'] + self.config['datapath'])

    def updateProblem(self):
        self.problem = utils.getProblems(self.db)

    def addProblem(self, name, filename, checker, extra, additions):
        utils.addProblem(self.db, name, filename, checker, extra, additions)
        self.updateProblem()

    def addTestcase(self, pid, inputs, output, point, time, memory, other):
        cases = []
        if other:
            nextInputs = [utils.getNextDataFiles(path, orz.data) for path in inputs]
            for inputs in zip(*nextInputs):
                for path in inputs:
                    cases.append((pid, 'input', path, time, memory, point))
            for path in utils.getNextDataFiles(output, orz.data):
                cases.append((pid, 'output', path, time, memory, point))
        else:
            cases.append((pid, 'output', output, time, memory, point))
            for path in inputs:
                cases.append((pid, 'input', path, time, memory, point))
        utils.addTestcase(self.db, cases)
        return cases

orz = Orz()
