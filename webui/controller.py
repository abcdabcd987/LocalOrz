from time import sleep
import tornado.web
import threading
import copy

import core
from core import const
from core.data import *
from core.result import *
from core.contest import *
from core import orz
from core import judge

class MessageBuffer:
    def __init__(self):
        self.waiters = set()
        self.cache = []
    def wait(self, callback):
        global mutex
        mutex.acquire()
        self.waiters.add(callback)
        mutex.release()
    def cancel(self, callback):
        global mutex
        mutex.acquire()
        self.waiters.remove(callback)
        mutex.release()
    def send(self, message):
        global mutex
        mutex.acquire()
        for callback in self.waiters:
            callback(dict(message=message))
        self.waiters = set()
        mutex.release()
        sleep(0.1)

message_buffer = MessageBuffer()
mutex = threading.Lock()

def cbCopy(msg):
    if msg == 'Start':
        message_buffer.send('    Copy source file & addition files...')
    else:
        message_buffer.send(msg + "\n")
def cbCompile(msg):
    if msg == 'Start':
        message_buffer.send('    Compile...')
    else:
        message_buffer.send(msg + "\n")
def cbTestcase(result, msg):
    global testcaseNO
    if msg == 'Start':
        testcaseNO += 1
        message_buffer.send('    [Testcase %d]' % testcaseNO)
    else:
        message_buffer.send(repr(result) + "\n")
def judgeAll():
    for person in orz.person:
        person.result.clear()
        for problem in orz.problem:
            result = ProblemResult(const.UNKNOWN, problem.title, '', '')
            for compiler in orz.compiler:
                if os.path.exists(os.path.join(orz.path, 'src', person.name, problem.filename + '.' + compiler.extension)):
                    global testcaseNO
                    testcaseNO = 0
                    message_buffer.send("============================Judging %s's %s===============================\n" % (person.name, problem.filename + '.' + compiler.extension))
                    result = judge.judge(orz.path, problem, person.name, compiler, cbCopy, cbCompile, cbTestcase)
                    break
            message_buffer.send("Status=%s | Filename: %s | Total Time: %dms | Score: %d\n\n" % (result.status, result.filename, result.time, result.score))
            person.result.append(result)
        person.result.saveToFile(os.path.join(orz.path, 'src', person.name, 'result.xml'))
    message_buffer.send(dict(message="!!RefreshPeople"))
def judgeProblem(personid, problemid):
    person = orz.person[personid]
    problem = orz.problem[problemid]
    result = ProblemResult(const.UNKNOWN, problem.title, '', '')
    for compiler in orz.compiler:
        if os.path.exists(os.path.join(orz.path, 'src', person.name, problem.filename + '.' + compiler.extension)):
            global testcaseNO
            testcaseNO = 0
            message_buffer.send("============================Judging %s's %s===============================\n" % (person.name, problem.filename + '.' + compiler.extension))
            result = judge.judge(orz.path, problem, person.name, compiler, cbCopy, cbCompile, cbTestcase)
            break
    message_buffer.send("Status=%s | Filename: %s | Total Time: %dms | Score: %d\n\n" % (result.status, result.filename, result.time, result.score))
    person.result.update(problemid, result)
    person.result.saveToFile(os.path.join(orz.path, 'src', person.name, 'result.xml'))
    message_buffer.send(dict(message="!!RefreshPeople"))
    message_buffer.send(dict(message="!!RefreshPerson", problemid=problemid, personid=personid))

class testAjaxHandler(tornado.web.RequestHandler):
    def post(self):
        global orz
        action = self.get_argument('action')
        if action == 'getProblems':
            problemList = []
            for index, problem in enumerate(orz.problem):
                problemList.append(dict(id=index, name=problem.title))
            self.write(dict(problemList=problemList))
        elif action == 'getDataFiles':
            path = self.get_argument('datapath', '')
            data = utils.getDataFiles(os.path.join(orz.path, 'data'))
            self.write(dict(dataList=utils.getMatchedDataFiles(path, data)))
        elif action == 'addTestcase':
            pid = int(self.get_argument('pid'))
            inputs = self.get_arguments('inputs[]')
            output = self.get_argument('output')
            point = self.get_argument('score')
            time = self.get_argument('time')
            memory = self.get_argument('memory')
            orz.problem[pid].appendTestcase(Testcase(inputs, output, time, memory, point))
            orz.save()
            self.write(dict(current=repr(orz)))
        elif action == 'addOtherTestcase':
            pid = int(self.get_argument('pid'))
            orz.problem[pid].autoAppendTestcase(os.path.join(orz.path, 'data'))
            orz.save()
            self.write(dict(current=repr(orz)))
        elif action == 'getPeople':
            orz.refreshPerson()
            res = []
            for index, person in enumerate(orz.person):
                res.append(dict(id=index, name=person.name, score=person.result.score, time=person.result.time))
            self.write(dict(people=res))
        elif action == 'getPersonResult':
            personid = int(self.get_argument('personid'))
            problem = []
            for prob in orz.person[personid].result:
                testcase = []
                for case in prob.result:
                    testcase.append(dict(status=case.status, score=case.score, time=case.time, memory=case.memory, exitcode=case.exitcode, detail=case.detail))
                problem.append(dict(status=prob.status, title=prob.title, filename=prob.filename, detail=prob.detail, time=prob.time, score=prob.score, testcase=testcase))
            self.write(dict(problem=problem, personid=personid))
        elif action == 'judgeAll':
            threading.Thread(target=judgeAll).start()
            self.write(dict(status='Got'))
        elif action == 'judgeProblem':
            personid = self.get_argument('personid')
            problemid = self.get_argument('problemid')
            threading.Thread(target=lambda: judgeProblem(int(personid), int(problemid))).start()
            self.write(dict(status='Got'))

class testContestHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('test_contest.html', contest=repr(orz))
    def post(self, action):
        global orz
        if action == 'new':
            path = self.get_argument('path')
            title = self.get_argument('title')
            orz = Contest(title, path)
            orz.new()
        elif action == 'open':
            path = self.get_argument('path')
            orz = Contest('', path)
            orz.open()
        elif action == 'addcompiler':
            title = self.get_argument('title')
            command = self.get_argument('command')
            executable = self.get_argument('executable')
            extension = self.get_argument('extension')
            orz.appendCompiler(Compiler(title, command, executable, extension))
            orz.save()
        elif action == 'addproblem':
            title = self.get_argument('title')
            filename = self.get_argument('filename')
            inputs = self.get_arguments('inputs[]')
            output = self.get_argument('output')
            checker = self.get_argument('checker')
            checkerArg = self.get_argument('checkerArg')
            addition = self.get_arguments('addition[]')
            orz.appendProblem(Problem(title, filename, inputs, output, checker, checkerArg, addition))
            orz.save()

        self.redirect('/test/contest')

class testPersonHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('test_person.html')

class testJudgeHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('test_judge.html')
    @tornado.web.asynchronous
    def post(self):
        message_buffer.wait(self.on_new_message)
    def on_new_message(self, message):
        if self.request.connection.stream.closed():
            return
        self.finish(message)
    def on_connection_close(self):
        message_buffer.cancel(self.on_new_message)

class testIndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('test_index.html', version=const.VERSION)

