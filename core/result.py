import copy
import logging
from xml.etree import ElementTree as ET

from core import const

class TestcaseResult:
    def __init__(self, status, score, time, memory, exitcode, detail):
        if status not in const.TESTCASE_STATUS: raise ValueError('TestcaseResult.__init__: status is invalid')
        if detail is None: raise ValueError('TestcaseResult.__init__: detail is None')
        self.status = status
        self.score = int(score)
        self.time = int(time)
        self.memory = int(memory)
        self.exitcode = int(exitcode)
        self.detail = detail
    def __repr__(self):
        return 'status=%s|score=%s|time=%sms|memory=%sKB|exitcode=%s|detail=%s' % (repr(self.status), repr(self.score), repr(self.time), repr(self.memory), repr(self.exitcode), repr(self.detail))

class ProblemResult:
    def __init__(self, status, title, filename, detail):
        if status not in const.PROBLEM_STATUS: raise ValueError('ProblemResult.__init__: status is invalid')
        if title is None: raise ValueError('ProblemResult.__init__: title is invalid')
        if filename is None: raise ValueError('ProblemResult.__init__: filename is invalid')
        if detail is None: raise ValueError('ProblemResult.__init__: detail is invalid')
        self.status = status
        self.title = title
        self.filename = filename
        self.detail = detail
        self.result = []
        self.time = self.score = 0
    def __repr__(self):
        res = "status=%s|title=%s|filename=%s|detail=%s|time=%s|score=%s|result=\n[\n" % (repr(self.status), repr(self.title), repr(self.filename), repr(self.detail), repr(self.time), repr(self.score))
        for testcase in self.result:
            res += '    ' + repr(testcase) + '\n'
        res += ']'
        return res
    def append(self, testcaseResult):
        self.result.append(copy.deepcopy(testcaseResult))
        if testcaseResult.status in [const.ACCEPTED, const.PARTLY_ACCEPTED]:
            self.time += testcaseResult.time
            self.score += testcaseResult.score

class PersonResult:
    def __init__(self, judgetime=0):
        self.judgetime = int(judgetime)
        self.result = []
        self.score = self.time = 0
    def __getitem__(self, key):
        return self.result[key]
    def __setitem__(self, key, value):
        self.result[key] = value
    def __repr__(self):
        res = 'judgetime=%s|score=%s|time=%s|result={\n\n' % (repr(self.judgetime), repr(self.score), repr(self.time))
        for problem in self.result:
            lines = repr(problem).split('\n')
            for line in lines:
                res += '    ' + line + '\n'
            res += '\n'
        res += '}'
        return res
    def clear(self):
        self.time = self.score = 0
    def append(self, problemResult):
        self.result.append(copy.deepcopy(problemResult))
        self.time += problemResult.time
        self.score += problemResult.score
    def update(self, probid, problemResult):
        self.time -= problemResult.time
        self.score -= problemResult.score
        self.result.result[probid] = copy.deepcopy(problemResult)
        self.time += problemResult.time
        self.score += problemResult.score
    def saveToFile(self, filename):
        orz = ET.Element("orz", {'version': const.VERSION, 'judgetime': str(self.judgetime)})
        for problem in self.result:
            prob = ET.Element('problem', {'title': problem.title, 'filename': problem.filename, 'status': problem.status, 'detail': problem.detail})
            for testcase in problem.result:
                case = ET.Element('testcase', {'status': testcase.status, 'score': str(testcase.score), 'exitcode': str(testcase.exitcode), 'time': str(testcase.time), 'memory': str(testcase.memory), 'detail': testcase.detail})
                prob.append(case)
            orz.append(prob)
        person = ET.ElementTree(orz)
        person.write(filename, encoding='utf-8', xml_declaration=True)
    def loadFromFile(self, filename):
        try:
            person = ET.ElementTree(file=filename)
            orz = person.getroot()
            result = PersonResult(orz.get('judgetime'))
            for prob in orz:
                problem = ProblemResult(prob.get('status'), prob.get('title'), prob.get('filename'), prob.get('detail'))
                for case in prob:
                    testcase = TestcaseResult(case.get('status'), case.get('score'), case.get('time'), case.get('memory'), case.get('exitcode'), case.get('detail'))
                    problem.append(testcase)
                result.append(problem)
            self.result = result.result
            self.score = result.score
            self.time = result.time
        except Exception as e:
            logging.warning("File [%s] cannot be prased. Ignore this file. Expection: %s" % (filename, repr(e)))
            return

