import logging
import tornado.web

import utils
from utils import config

class testDataHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("test_data.html")
        #self.set_header("Content-Type", "text/plain")
        #datapath = config['root'] + config['datapath']
        #for dirpath, dirnames, filenames in os.walk(datapath):
        #    for filename in filenames:
        #        path = os.path.join(dirpath, filename).replace(datapath, '')
        #        self.write(path + " => " + repr(utils.getNextFile(path)) + "\n")

    def post(self):
        if 'data' not in config:
            config['data'] = utils.getDataFiles(config['root'] + config['datapath'])
        path = self.get_argument('datapath')
        action = self.get_argument('action')
        if action == 'getList':
            self.write(dict(dataList=utils.getMatchedDataFiles(path, config['data'])))
        elif action == 'getNext':
            self.write(dict(otherData=utils.getNextDataFiles(path, config['data'])))
