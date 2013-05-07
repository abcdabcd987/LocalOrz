from core import const
from core.data import *
from core.result import *
from core.contest import *

#contest = Contest('Contest in 2013 May 5th', '../test')
#contest.new()
#
#personResult = PersonResult()
#personResult.loadFromFile(r'test/result.xml')
#person = Person('abcdabcd987', personResult)
#
#prob = Problem('Test Problem', 'test', ['test.in'], 'test.out', const.NORMAL_JUDGE)
#case = Testcase(['test1.in'], 'test1.out', 1000, 256000, 10)
#prob.appendTestcase(case)
#for i in range(1, 10):
#    prob.appendNextTestcase()
#contest.appendProblem(prob)
#
#prob = Problem('Water Problem', 'water', ['water.in', 'dict.txt'], 'water.out', const.NORMAL_JUDGE)
#case = Testcase(['water.in1', 'dict1.txt'], 'water.ou1', 4000, 640000, 5)
#prob.appendTestcase(case)
#for i in range(1, 20):
#    prob.appendNextTestcase()
#contest.appendProblem(prob)
#
#gcc = Compiler('GNU C Complier', 'gcc %s.c -o %s', '%s', 'c')
#
#contest.appendPerson(person)
#contest.appendCompiler(gcc)
#person.name='wahaha'
#contest.appendPerson(person)
#
#print(contest)
#
#
#print('=============Save To File Test:')
##contest.saveToFile(r'test/dataconf.xml')
#contest.save()
#print(r"Done, see <test/dataconf.xml>")

#print('=============Load From File Test:')
#contest.title = ''
#contest.problem = list()
#contest.compiler = list()
#contest.loadFromFile(r'test/dataconf.xml')
#contest = Contest('Contest in 2013 May 5th', '../test')
#contest.open()
#contest.refreshPerson()
#print(contest)

contest = Contest('Contest in 2013 May 7th', '../test')
contest.open()
contest.refreshPerson()
prob = Problem('Splay', 'splay', ['splay.in'], 'splay.out', const.NORMAL_JUDGE)
prob.appendTestcase(Testcase(['splay/splay1.in'], 'splay/splay1.out', 4000, 256000, 10))
prob.autoAppendTestcase(os.path.join(contest.path, 'data'))
contest.appendProblem(prob)
contest.appendCompiler(Compiler('GNU C++ Complier', 'g++ %s.cpp -o %s', '%s', 'cpp'))
contest.save()
print(contest)
