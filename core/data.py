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
    def __init__(self, title, filename, inputs, output, checker, checkerArg=None, addition=list()):
        if not isinstance(title, str): raise TypeError('Problem.__init__: title is not a string')
        if not isinstance(filename, str): raise TypeError('Problem.__init__: filename is not a string')
        if not isinstance(inputs, list): raise TypeError('Problem.__init__: inputs is not a list')
        if not isinstance(output, str): raise TypeError('Problem.__init__: output is not a string')
        if not isinstance(addition, list): raise TypeError('Problem.__init__: addition is not a list')
        if checker not in const.CHECKER: raise TypeError('Problem.__init__: checker is invalid')
        if checker != const.NORMAL_JUDGE and checkerArg is None: raise TypeError('Problem.__init__: checkerArg is None')
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
    def appendNextTestcase(self):
        if not self.testcase:
            return
        last = self.testcase[-1]
        inputs = [utils.getNextTestcase(path) for path in last.inputs]
        output = utils.getNextTestcase(last.output)
        testcase = Testcase(inputs, output, last.timeLimit, last.memoryLimit, last.score)
        self.testcase.append(testcase)

