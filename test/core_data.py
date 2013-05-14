from core import const
from core.data import *

prob = Problem('Test Problem', 'test', ['test.in'], 'test.out', const.NORMAL_JUDGE)
case = Testcase(['test1.in'], 'test1.out', 1000, 256000, 10)
prob.appendTestcase(case)
for i in range(1, 10):
    prob.appendNextTestcase()
print(prob)
