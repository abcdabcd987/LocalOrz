import os
import sys
import time
import shutil
import tempfile

import utils
from orz import orz

def removeFiles(path):
    for root, dirs, files in os.walk(path, topdown=False):
        for name in files:
            os.remove(os.path.join(root, name))
        for name in dirs:
            os.rmdir(os.path.join(root, name))

def compile(cmd, args):
    os.system(cmd % args + ' 1> __compile_info.txt 2>&1')
    return (os.path.exists(args['src']), open('__compile_info.txt', 'r').read())

def diff(checker, standardOutput, playerOutput):
    exitcode = os.system('"%s" "%s" "%s" 1> __diff.txt 2>&1' % (checker, standardOutput, playerOutput))
    return (exitcode, open('__diff.txt', 'r').read())

def judge(problem, srcdir, srcname, testcases):
    cwd = os.getcwd()
    tmpdir = tempfile.mkdtemp(prefix='orz')
    os.chdir(tmpdir)
    realsrc = os.path.join(orz.config['root'] + srcdir, srcname)
    if not os.path.exists(realsrc):
        logging.debug(realsrc + " doesn't exist")
    extension = srcname.split('.')[-1]
    metaCompiler = 'compiler.' + extension
    if metaCompiler not in orz.contest:
        logging.debug(metaCompiler + " doesn't exist")
    destsrc = utils.getRandomString() + '.' + extension
    shutil.copyfile(realsrc, destsrc)
    (compileStatus, compileInfo) = compile(orz.contest[metaCompiler], dict(src=problem.filename))
    for testcase in testcases:
        shutil.rmtree(tmpdir)
########################################################3
        os.chdir('/home/cofun/tmp')
        RemoveFiles()
        lang = task['SubmitLanguage']
        spj = task['ProblemID'] if task['SpecialJudge'] else None
        fsource = open('__source.'+EXTENSION[lang], 'w')
        fsource.write(task['SubmitCode'])
        fsource.close()

        (compile_success, compile_info) = Compile(lang)
        if compile_info:
            print '%s  has compile info' % task['SubmitID']
            cur.execute('UPDATE Submit SET CompilerInfo=%s, JudgeTime=CURRENT_TIMESTAMP WHERE SubmitID=%s', (compile_info, task['SubmitID']))
        if not compile_success:
            print '%s  CE' % task['SubmitID']
            cur.execute('UPDATE Submit SET SubmitStatus=%s, JudgeTime=CURRENT_TIMESTAMP WHERE SubmitID=%s', (RESULT['CE'], task['SubmitID']))
            print '%s  -----------------------DONE------------------------' % task['SubmitID']
            continue

        basedir = '/home/cofun/data/%d/' % task['ProblemID']
        final = 'AC'
        tottime = 0
        avgmem = 0
        memcnt = 0
        totscored = 0
        for line in open(basedir + 'data.config'):
            config = line.strip().split('|')
            if not config:
                continue

            cur.execute('UPDATE Submit SET SubmitStatus=%s, JudgeTime=CURRENT_TIMESTAMP WHERE SubmitID=%s', (101+memcnt, task['SubmitID']))

            # config[0]:  input file
            # config[1]:  output file
            # config[2]:  time limit
            # config[3]:  memory limit
            # config[4]:  score
            shutil.copyfile(basedir+config[0], '/home/cofun/tmp/input.txt')
            os.system('/home/cofun/cofun_client '+config[2]+' '+config[3])

            # RunResult   %d  (0=>NORMAL, 1=>RE, 2=>TLE, 3=>MLE)
            # TimeUsed    %d  (MicroSecond)
            # MemoryUsed  %d  (KBytes)
            # Exitcode    %d  (Exitcode or Signal code)
            result = open('/home/cofun/tmp/__result.txt', 'r').read().strip().split(' ')
            diff = result[3]
            avgmem += int(result[2])
            memcnt += 1
            if int(result[1]) > int(config[2]):
                res = 'TLE'
                final = 'TLE'
            elif int(result[2]) > int(config[3]):
                res = 'MLE'
                final = 'MLE'
            elif result[0] == '1' or result[3] != '0':
                res = 'RE'
                final = 'RE'
            else:
                shutil.copyfile(basedir+config[1], '/home/cofun/tmp/answer.txt')
                (exitcode, diff) = GetDiff(spj, basedir+config[0])
                if exitcode:
                    res = 'WA'
                    final = 'WA'
                    #print diff
                else:
                    res = 'AC'
                    tottime += int(result[1])
            score = config[4] if res == 'AC' else '0'
            totscored += float(score)

            print '[%s]%s  on testcase [%s]  %3s  at %4dms  using %7dKBytes memory   with exitcode: %3d' % (time.strftime('%Y-%m-%d %X', time.localtime()), task['SubmitID'], config[0], res, int(result[1]), int(result[2]), int(result[3]))
            cur.execute('INSERT INTO Result (SubmitID, Result, RunTime, RunMemory, Score, Diff) VALUES (%s, %s, %s, %s, %s, %s)', (task['SubmitID'], RESULT[res], result[1], result[2], score, diff))
        cur.execute('UPDATE Submit SET SubmitStatus=%s, JudgeTime=CURRENT_TIMESTAMP, SubmitRunTime=%s, SubmitRunMemory=%s, SubmitScore=%s WHERE SubmitID=%s', (RESULT[final], str(tottime), str(avgmem//memcnt), totscored, task['SubmitID']))

        print '%s  -----------------------DONE------------------------' % task['SubmitID']
