#!/usr/bin/env python2
import os
import sys
import logging
import tornado.ioloop
import tornado.web
import tornado.autoreload
from tornado.options import define, options


import utils
from web import web
from orz import orz

uri = [
    (r'/test/data', web.testDataHandler),
    (r'/test/problem', web.testProblemHandler),
]

define("root", default=".", type=str, help="The path to the contest")
define("port", default=10086, type=int, help="The web server's port")
#logging.getLogger("tornado").setLevel(logging.CRITICAL)

if __name__ == '__main__':
    tornado.options.parse_command_line()
    logging.info('System Startup')
    orz.config['root'] = os.path.realpath(options.root)
    orz.config['port'] = options.port
    logging.info('The path to contest detected: ' + orz.config['root'])

    if not os.access(orz.config['root'], os.F_OK):
        os.mkdir(orz.config['root'])
        logging.warning(orz.config['root'] + " doesn't exist. Created. ^_^")
    if not os.access(orz.config['root'], os.R_OK | os.W_OK | os.X_OK):
        logging.error(orz.config['root'] + " is supposed to have mask drx. Exit.")
        sys.exit(2)

    if not os.access(orz.config['root'] + orz.config['dbpath'], os.F_OK):
        logging.warning("Database doesn't exist. Created. ^_^")
        orz.initDatabase(create=True)
    else:
        orz.initDatabase()
    if not os.access(orz.config['root'] + orz.config['datapath'], os.F_OK):
        os.mkdir(orz.config['root'] + orz.config['datapath'])
        logging.warning(orz.config['root'] + orz.config['datapath'] + " doesn't exist. Created. ^_^")
    if not os.access(orz.config['root'] + orz.config['srcpath'], os.F_OK):
        os.mkdir(orz.config['root'] + orz.config['srcpath'])
        logging.warning(orz.config['root'] + orz.config['srcpath'] + " doesn't exist. Created. ^_^")
    
    application = tornado.web.Application(
        uri,
        template_path=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'web/template'),
        static_path=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'web/static')
    )
    application.listen(orz.config['port'])
    ioloop = tornado.ioloop.IOLoop.instance()
    tornado.autoreload.start(ioloop)
    ioloop.start()
    #tornado.ioloop.IOLoop.instance().start()
