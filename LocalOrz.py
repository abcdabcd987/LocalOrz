#!/usr/bin/env python2
import tornado.ioloop
import tornado.web
import os
import sys
import utils
from utils import config

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "text/plain")
        self.write(repr(utils.config))

application = tornado.web.Application([
    (r'/', MainHandler),
])

if __name__ == '__main__':
    utils.ConsoleOutput('System Startup')
    if len(sys.argv) < 2:
        utils.ConsoleOutput("Doesn't provide the path to contest. Nothing to do. Exit.", 'Error')
        sys.exit(1)
    config['root'] = os.path.realpath(sys.argv[1])
    config['port'] = 10086 if len(sys.argv) == 2 else int(sys.argv[2])
    config['dbpath'] = '/LocalOrz.db'
    utils.ConsoleOutput('The path to contest detected: ' + config['root'])

    if not os.access(config['root'], os.F_OK):
        os.mkdir(config['root'])
        utils.ConsoleOutput(config['root'] + " doesn't exist. Created. ^_^")
    if not os.access(config['root'], os.R_OK | os.W_OK | os.X_OK):
        utils.ConsoleOutput(config['root'] + " is supposed to have mask drx. Exit.", 'Error')
        sys.exit(2)
    os.chdir(config['root'])

    if not os.access(config['root'] + config['dbpath'], os.F_OK):
        utils.InitDatabase(config['root'] + config['dbpath'])
        utils.ConsoleOutput("Database doesn't exist. Created. ^_^")
    
    utils.ConsoleOutput('Open web server on port %d' % config['port'])
    application.listen(config['port'])
    tornado.ioloop.IOLoop.instance().start()
