import os
import copy
import logging
from xml.etree import ElementTree as ET

from core import const
from core.data import *
from core.result import *

class Person:
    def __init__(self, name, personResult):
        if not isinstance(name, str): raise TypeError('Person.__init__: name is not a string')
        if not isinstance(personResult, PersonResult): raise TypeError('Person.__init__: personResult is not a PersonResult')
        self.name = name
        self.result = personResult
    def __repr__(self):
        return 'name=%s|%s' % (repr(self.name), repr(self.result))

class Compiler:
    def __init__(self, title, command, executable, extension):
        if not isinstance(title, str): raise TypeError('Compiler.__init__: title is not a string')
        if not isinstance(command, str): raise TypeError('Compiler.__init__: command is not a string')
        if not isinstance(executable, str): raise TypeError('Compiler.__init__: executable is not a string')
        if not isinstance(extension, str): raise TypeError('Compiler.__init__: extension is not a string')
        self.title = title
        self.command = command
        self.executable = executable
        self.extension = extension
    def __repr__(self):
        return 'title=%s|command=%s|executable=%s|extension=%s' % (repr(self.title), repr(self.command), repr(self.executable), repr(self.extension))

class Contest:
    def __init__(self, title, path):
        if not isinstance(title, str): raise TypeError('Contest.__init__: title is not a string')
        if not isinstance(path, str): raise TypeError('Contest.__init__: path is not a string')
        self.opened = False
        self.title = title
        self.path = os.path.realpath(path)
        self.compiler = list()
        self.problem = list()
        self.person = list()
    def __repr__(self):
        res = 'title=%s|path=%s|compiler=[\n' % (repr(self.title), repr(self.path))
        for compiler in self.compiler:
            res += '    ' + repr(compiler) + '\n'
        res += ']|problem=[\n'
        for problem in self.problem:
            lines = repr(problem).split('\n')
            for line in lines:
                res += '    ' + line + '\n'
        res += ']|person=[\n'
        for person in self.person:
            lines = repr(person).split('\n')
            for line in lines:
                res += '    ' + line + '\n'
        res += ']'
        return res
    def appendCompiler(self, compiler):
        self.compiler.append(copy.deepcopy(compiler))
    def appendProblem(self, problem):
        self.problem.append(copy.deepcopy(problem))
    def appendPerson(self, person):
        self.person.append(copy.deepcopy(person))
    def saveToFile(self, filename):
        orz = ET.Element("orz", {'version': const.VERSION, 'title': self.title})
        problems = ET.Element('problems')
        for problem in self.problem:
            prob = ET.Element('problem', {'title': problem.title, 'filename': problem.filename, 'inputs': '|'.join(problem.inputs), 'output': problem.output, 'checker': problem.checker, 'checkerArg': str(problem.checkerArg), 'addition': '|'.join(problem.addition)})
            for testcase in problem.testcase:
                case = ET.Element('testcase', {'inputs': '|'.join(testcase.inputs), 'output': testcase.output, 'timeLimit': str(testcase.timeLimit), 'memoryLimit': str(testcase.memoryLimit), 'score': str(testcase.score)})
                prob.append(case)
            problems.append(prob)
        compilers = ET.Element('compilers')
        for compiler in self.compiler:
            cpl = ET.Element('compiler', {'title': compiler.title, 'command': compiler.command, 'executable': compiler.executable, 'extension': compiler.extension})
            compilers.append(cpl)
        orz.append(problems)
        orz.append(compilers)
        contest = ET.ElementTree(orz)
        contest.write(filename, encoding='utf-8', xml_declaration=True)
    def loadFromFile(self, filename):
        try:
            orz = ET.ElementTree(file=filename).getroot()
            contest = Contest(orz.get('title'), self.path)
            for prob in orz.find('problems'):
                problem = Problem(prob.get('title'), prob.get('filename'), prob.get('inputs').split('|'), prob.get('output'), prob.get('checker'), prob.get('checkerArg'), list() if prob.get('addition').strip() == '' else prob.get('addition').split('|'))
                for case in prob:
                    testcase = Testcase(case.get('inputs').split('|'), case.get('output'), case.get('timeLimit'), case.get('memoryLimit'), case.get('score'))
                    problem.appendTestcase(testcase)
                contest.appendProblem(problem)
            for compiler in orz.find('compilers'):
                compiler = Compiler(compiler.get('title'), compiler.get('command'), compiler.get('executable'), compiler.get('extension'))
                contest.appendCompiler(compiler)
            self.problem = contest.problem
            self.compiler = contest.compiler
            self.title = contest.title
        except Exception as e:
            logging.warning("File [%s] cannot be prased. Expection: %s" % (filename, repr(e)))
            return
    def open(self):
        try:
            self.loadFromFile(os.path.join(self.path, 'data', 'dataconf.xml'))
            if not os.path.exists(os.path.join(self.path, 'src')):
                os.mkdir(os.path.join(self.path, 'src'))
            with open(os.path.join(self.path, '.LocalOrz'), 'w') as f:
                print(const.VERSION, file=f)
            self.opened = True
            self.refreshPerson()
            return True
        except:
            self.opened = False
            return False
    def new(self):
        try:
            if not os.path.exists(self.path):
                os.mkdir(self.path)
            if not os.path.exists(os.path.join(self.path, 'data')):
                os.mkdir(os.path.join(self.path, 'data'))
            if not os.path.exists(os.path.join(self.path, 'src')):
                os.mkdir(os.path.join(self.path, 'src'))
            self.save()
            self.open()
        except:
            logging.critical('Cannot create contest.')
    def save(self):
        self.saveToFile(os.path.join(self.path, 'data', 'dataconf.xml'))
        with open(os.path.join(self.path, '.LocalOrz'), 'w') as f:
            print(const.VERSION, file=f)
    def refreshPerson(self):
        self.person = []
        for name in os.listdir(os.path.join(self.path, 'src')):
            if os.path.isdir(os.path.join(self.path, 'src', name)):
                result = PersonResult()
                result.loadFromFile(os.path.join(self.path, 'src', name, 'result.xml'))
                person = Person(name, result)
                self.adjustPerson(person)
                self.appendPerson(person)
    def adjustPerson(self, person):
        st, ed = len(person.result.result), len(self.problem)
        for pid in range(st, ed):
            problem = self.problem[pid]
            person.result.append(ProblemResult(const.UNKNOWN, problem.title, '', ''))

