LocalOrz
========

A simple local judge system for Linux, in order to take place of Cena.

Using [Tornado](https://github.com/facebook/tornado) as web framework.

Installation
------------

A example for Ubuntu:

    $ sudo apt-get update
    $ sudo apt-get install -y gcc g++ fpc
    $ sudo apt-get install -y git python3
    
    $ git clone https://github.com/facebook/tornado.git
    $ cd tornado
    $ python3 setup.py build
    $ sudo python3 setup.py install
    
    $ cd ~
    $ git clone https://github.com/abcdabcd987/LocalOrz.git
    $ cd LocalOrz/core
    $ gcc judge_client.c -o judge_client -O2
    $ g++ normal_judge.cc -o normal_judge -O2

Usage
-----

    $ ~/LocalOrz/LocalOrz.py
      
Then, open <http://localhost:10086> in browser.

Special Judge
-------------

    argv[1]: Full score
    argv[2]: Standard Answer
    argv[3]: Competitor Answer
    
    Judge Information  =>  stdout
    Score              =>  __score.txt

See `core/normal_judge.cc` for detail.
