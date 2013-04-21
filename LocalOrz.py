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
from utils import config

uri = [
    (r'/test/data', web.testDataHandler),
]

define("root", default=".", type=str, help="The path to the contest")
define("port", default=10086, type=int, help="The web server's port")
#logging.getLogger("tornado").setLevel(logging.CRITICAL)

if __name__ == '__main__':
    tornado.options.parse_command_line()
    logging.info('System Startup')
    config['root'] = os.path.realpath(options.root)
    config['port'] = options.port
    logging.info('The path to contest detected: ' + config['root'])

    if not os.access(config['root'], os.F_OK):
        os.mkdir(config['root'])
        logging.warning(config['root'] + " doesn't exist. Created. ^_^")
    if not os.access(config['root'], os.R_OK | os.W_OK | os.X_OK):
        logging.error(config['root'] + " is supposed to have mask drx. Exit.")
        sys.exit(2)

    if not os.access(config['root'] + config['dbpath'], os.F_OK):
        utils.initDatabase(config['root'] + config['dbpath'])
        logging.warning("Database doesn't exist. Created. ^_^")
    if not os.access(config['root'] + config['datapath'], os.F_OK):
        os.mkdir(config['root'] + config['datapath'])
        logging.warning(config['root'] + config['datapath'] + " doesn't exist. Created. ^_^")
    if not os.access(config['root'] + config['srcpath'], os.F_OK):
        os.mkdir(config['root'] + config['srcpath'])
        logging.warning(config['root'] + config['srcpath'] + " doesn't exist. Created. ^_^")
    
    application = tornado.web.Application(
        uri,
        template_path=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'web/template'),
        static_path=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'web/static')
    )
    application.listen(config['port'])
    ioloop = tornado.ioloop.IOLoop.instance()
    tornado.autoreload.start(ioloop)
    ioloop.start()
    #tornado.ioloop.IOLoop.instance().start()
