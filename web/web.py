import logging
import tornado.web

import utils
from orz import orz

class testAjaxHandler(tornado.web.RequestHandler):
    def post(self):
        action = self.get_argument('action')
        if action == 'getProblems':
            self.write(dict(problemList=orz.problem))

        elif action == 'addProblem':
            name = self.get_argument("name")
            filename = self.get_argument("filename")
            checker = self.get_argument("checker")
            extra = self.get_argument("extra")
            addition = self.get_arguments("addition[]")
            if checker not in ['standard', 'float', 'special']:
                self.write(dict(status='failure. check: [checker]'))
                return
            orz.addProblem(name, filename, checker, extra, addition)
            self.write(dict(status='success'))

        elif action == 'getDataFiles':
            path = self.get_argument('datapath', '')
            self.write(dict(dataList=utils.getMatchedDataFiles(path, orz.data)))

        elif action == 'addTestcase' or action == 'addOtherTestcase':
            pid = self.get_argument('pid')
            inputs = self.get_arguments('inputs[]')
            output = self.get_argument('output')
            point = self.get_argument('score')
            time = self.get_argument('time')
            memory = self.get_argument('memory')
            testcaseList = orz.addTestcase(pid, inputs, output, point, time, memory, action == 'addOtherTestcase')
            self.write(dict(testcaseList=testcaseList))

class testProblemHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("test_problem.html")

class testTestcaseHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("test_testcase.html")
    
