import os
import sys
import logging
import tornado.ioloop
import tornado.web
import tornado.autoreload
from tornado.options import define, options


import core
import utils
from webui import controller

uri = [
    (r'/test/contest', controller.testContestHandler),
    (r'/test/contest/+(.*)', controller.testContestHandler),
    (r'/test/ajax', controller.testAjaxHandler),
    (r'/test/person', controller.testPersonHandler),
    (r'/test/judge', controller.testJudgeHandler),
    (r'/', controller.testIndexHandler),
]

#logging.getLogger("tornado").setLevel(logging.CRITICAL)

def run():
    tornado.options.parse_command_line()
    
    application = tornado.web.Application(
        uri,
        template_path=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'template'),
        static_path=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static')
    )
    application.listen(10086)
    ioloop = tornado.ioloop.IOLoop.instance()
    tornado.autoreload.start(ioloop)
    ioloop.start()
    #tornado.ioloop.IOLoop.instance().start()

