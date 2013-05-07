import tornado.web

import core
from core import const
from core.data import *
from core.result import *
from core.contest import *
from core.judge import judge
from core import orz

class testAjaxHandler(tornado.web.RequestHandler):
    def post(self):
        action = self.get_argument('action')
        if action == 'getProblems':
            self.write(dict(problemList=orz.problem))
        elif action == 'getDataFiles':
            path = self.get_argument('datapath', '')
            data = utils.getDataFiles(os.path.join(orz.path, 'data'))
            self.write(dict(dataList=utils.getMatchedDataFiles(path, data)))

class testContestHandler(tornado.web.RequestHandler):
    def get(self):
        core.contest = None
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
