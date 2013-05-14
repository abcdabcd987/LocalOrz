import os
import copy

import utils
from core import const

class Testcase:
    def __init__(self, inputs, output, timeLimit, memoryLimit, score):
        if not isinstance(inputs, list): raise TypeError('Testcase.__init__: inputs is not a list')
        if not isinstance(output, str): raise TypeError('Testcase.__init__: output is not a string')
        self.inputs = copy.deepcopy(inputs)
        self.output = output
        self.timeLimit = int(timeLimit)
        self.memoryLimit = int(memoryLimit)
        self.score = int(score)
    def __repr__(self):
        return 'inputs=%s|output=%s|timeLimit=%s|memoryLimit=%s|score=%s' % (repr(self.inputs), repr(self.output), repr(self.timeLimit), repr(self.memoryLimit), repr(self.score))

class Problem:
    def __init__(self, title, filename, inputs, output, checker, checkerArg='', addition=list()):
        if not isinstance(title, str): raise TypeError('Problem.__init__: title is not a string')
        if not isinstance(filename, str): raise TypeError('Problem.__init__: filename is not a string')
        if not isinstance(inputs, list): raise TypeError('Problem.__init__: inputs is not a list')
        if not isinstance(output, str): raise TypeError('Problem.__init__: output is not a string')
        if not isinstance(addition, list): raise TypeError('Problem.__init__: addition is not a list')
        if checker not in const.CHECKER: raise TypeError('Problem.__init__: checker is invalid')
        if not isinstance(checkerArg, str): raise TypeError('Problem.__init__: checkerArg is not a string')
        self.title = title
        self.filename = filename
        self.inputs = copy.deepcopy(inputs)
        self.output = output
        self.checker = checker
        self.checkerArg = checkerArg
        self.addition = copy.deepcopy(addition)
        self.testcase = []
    def __repr__(self):
        res = 'title=%s|filename=%s|inputs=%s|output=%s|checker=%s|checkerArg=%s|addition=%s|testcase=[\n' % (repr(self.title), repr(self.filename), repr(self.inputs), repr(self.output), repr(self.checker), repr(self.checkerArg), repr(self.addition))
        for testcase in self.testcase:
            res += '    ' + repr(testcase) + '\n'
        res += ']'
        return res
    def appendTestcase(self, testcase):
        self.testcase.append(copy.deepcopy(testcase))
    def appendNextTestcase(self, prefix=None):
        if not self.testcase:
            return False
        last = self.testcase[-1]
        inputs = [utils.getNextTestcase(path) for path in last.inputs]
        output = utils.getNextTestcase(last.output)
        testcase = Testcase(inputs, output, last.timeLimit, last.memoryLimit, last.score)
        if prefix is not None:
            if not os.path.exists(os.path.join(prefix, output)):
                return False
            for path in inputs:
                if not os.path.exists(os.path.join(prefix, path)):
                    return False
        self.testcase.append(testcase)
        return True
    def autoAppendTestcase(self, prefix):
        cnt = 0
        while self.appendNextTestcase(prefix):
            cnt += 1
        return cnt

