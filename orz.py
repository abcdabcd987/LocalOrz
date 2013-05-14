import utils
import sqlite3
import logging


class Orz:
    def __init__(self):
        self.config = dict(dbpath="/LocalOrz.db", datapath="/data", srcpath="/src")
        self.db = None
        self.data = None
        self.problem = None
        self.contest = None

    def initDatabase(self, create=False):
        self.db = sqlite3.connect(self.config['root'] + self.config['dbpath'])
        if create:
            utils.initDatabase(self.db)

    def updateContest(self):
        self.contest = utils.getContestMetas()
        if not self.contest:
            utils.addContestMeta('compiler.cc', 'g++ %(src)s.cc -o %(src)s -Wall -Wextra')
            utils.addContestMeta('compiler.cpp', 'g++ %(src)s.cpp -o %(src)s -Wall -Wextra')
            utils.addContestMeta('compiler.c', 'gcc %(src)s.c -lm -o %(src)s -Wall -Wextra')
            utils.addContestMeta('compiler.pas', 'fpc %(src)s.cpp -o%(src)s -vewh -Tlinux')
            utils.addContestMeta('title', 'test-' + utils.getDate())
            self.contest = utils.getContestMetas()

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
            for inputs, output in zip(zip(*nextInputs), utils.getNextDataFiles(output, orz.data)):
                paths = [('output', output)]
                for path in inputs:
                    paths.append(('input', path))
                cases.append(dict(metas=(pid, time, memory, point), paths=paths))
        else:
            paths = [('output', output)]
            for path in inputs:
                paths.append(('input', path))
            cases.append(dict(metas=(pid, time, memory, point), paths=paths))
        utils.addTestcase(self.db, cases)
        return cases

orz = Orz()
