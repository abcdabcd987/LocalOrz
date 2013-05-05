from core import const
from core.result import *

print('=============Class Test:')

person = PersonResult(1367743960)

cas1 = TestcaseResult(const.ACCEPTED, 10, 200, 20000, 0, '')
cas2 = TestcaseResult(const.PARTLY_ACCEPTED, 5, 200, 20000, 0, '''
------standard output------
8342761.94377
---------you output--------
8327167.18831
''')
cas3 = TestcaseResult(const.WRONG_ANSWER, 0, 200, 20000, 0, '')
title = 'TestProblem'
prob = ProblemResult(const.NORMAL, title, 'test.cc', '')
title = "I'm NOT familiar with Python"
prob.append(cas1)
prob.append(cas2)
prob.append(cas3)
person.append(prob)


cas1 = TestcaseResult(const.RUNTIME_ERROR, 0, 123, 12345, 0, '')
cas2 = TestcaseResult(const.SPECIAL_JUDGE_ERROR, 0, 456, 78910, 0, '')
prob = ProblemResult(const.NORMAL, 'Water', 'water.pas', '')
prob.append(cas1)
prob.append(cas2)
prob.append(cas3)
cas3.detail='Did you use Deepcopy?'
person.append(prob)
cas3.detail='Did you use Deepcopy?'

print(person)


print('=============Save To File Test:')
person.saveToFile(r'test\result.xml')
print(r"Done, see <test\result.xml>")


print('=============Load From File Test:')
person = PersonResult()
person.loadFromFile(r'test\result.xml')
print(person)
