import os
import tornado.web
import pprint

from utils import config

class testDataHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "text/plain")
        datapath = config['root'] + config['datapath']
        for dirpath, dirnames, filenames in os.walk(datapath):
            for filename in filenames:
                self.write(os.path.join(dirpath, filename).replace(datapath, '') + "\n")
        #self.write(pprint.pprint([x for x in os.walk(config['root'] + config['datapath'])]))
        #self.render("test_data.html")
