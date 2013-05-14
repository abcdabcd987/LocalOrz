from core import const
from core import judge
from core.data import *
from core.result import *
from core.contest import *

contest = Contest('', '../test')
contest.open()
contest.refreshPerson()
def cbCopy(msg):
    if msg == 'Start':
        print('    Copy source file & addition files...', end='')
    else:
        print(msg)
def cbCompile(msg):
    if msg == 'Start':
        print('    Compile...', end='')
    else:
        print(msg)
def cbTestcase(result, msg):
    global testcaseNO
    if msg == 'Start':
        testcaseNO += 1
        print('    [Testcase %d]' % testcaseNO, end='')
    else:
        print(result)
for person in contest.person:
    for problem in contest.problem:
        for compiler in contest.compiler:
            if os.path.exists(os.path.join(contest.path, 'src', person.name, problem.filename + '.' + compiler.extension)):
                global testcaseNO
                testcaseNO = 0
                print("============================Judging %s's %s===============================" % (person.name, problem.filename + '.' + compiler.extension))
                result = judge.judge(contest.path, problem, person.name, compiler, cbCopy, cbCompile, cbTestcase)
                print(result)
                break
