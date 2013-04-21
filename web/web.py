import logging
import tornado.web

import utils
from orz import orz

class testDataHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("test_data.html")

    def post(self):
        if not orz.data:
            orz.updateData()
        path = self.get_argument('datapath')
        action = self.get_argument('action')
        if action == 'getList':
            self.write(dict(dataList=utils.getMatchedDataFiles(path, orz.data)))
        elif action == 'getNext':
            self.write(dict(otherData=utils.getNextDataFiles(path, orz.data)))

class testProblemHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("test_problem.html")

    def post(self):
        if not orz.data:
            orz.updateData()
        name = self.get_argument("name")
        filename = self.get_argument("filename")
        try:
            checker = int(self.get_argument("checker"))
        except:
            checker = 0
        if not 1 <= checker <= 3:
            return
        extra = self.get_argument("extra")
        addition = self.get_arguments("addition")
        orz.addProblem(name, filename, checker, extra, addition)
        self.write('Done')
