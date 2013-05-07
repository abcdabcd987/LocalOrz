import os
import sys
import time
import shutil
import logging
import tempfile

import utils
from core import const
from core.result import *

def compile(compiler, filename):
    try:
        os.system(compiler.command.replace('%s', filename) + ' 1> __compile_info.txt 2>&1')
        return (os.path.exists(compiler.executable.replace('%s', filename)), open('__compile_info.txt', 'r').read())
    except Exception as e:
        logging.warning('judge.compile: Unknown error. Exception: ' + repr(e))
        return (False, 'judge.compile: Unknown error. Exception: ' + repr(e))

def diff(checker, score, standardOutput, checkerArg):
    try:
        exitcode = os.system('"%s" %d "%s" %s 1> __diff.txt 2>&1' % (checker, score, standardOutput, checkerArg))
        return (exitcode == 0, open('__diff.txt', 'r').read(), int(open('__score.txt', 'r').read()))
    except Exception as e:
        logging.warning('judge.diff: Unknown error. Exception: ' + repr(e))
        return (False, 'judge.diff: Unknown error. Exception: ' + repr(e), 0)

def run(executable, timeLimit, memoryLimit):
    try:
        os.system('"%s" "%s" %d %d' % (const.JUDGE_CLIENT_PATH, executable, timeLimit, memoryLimit))
        timeUsed, memoryUsed, exitcode, *progStatus = open('__result.txt', 'r').read().strip().split(' ')
        return (int(timeUsed), int(memoryUsed), int(exitcode), ' '.join(progStatus))
    except Exception as e:
        logging.warning('judge.run: Unknown error. Exception: ' + repr(e))
        return (0, 0, 0, const.CORE_ERROR)

def clean():
    os.chdir(ocwd)
    shutil.rmtree(tmpdir)

def judge(contestPath, problem, personName, compiler, callbackCopy=None, callbackCompile=None, callbackTestcase=None):
    # Backup current working directory & Create result object
    global ocwd, tmpdir
    ocwd = os.getcwd()
    tmpdir = tempfile.mkdtemp(prefix='orz-')
    os.chdir(tmpdir)
    judgeResult = ProblemResult(const.CORE_ERROR, problem.title, problem.filename + '.' + compiler.extension, '')

    # Copy source file & addition files
    if callbackCopy:
        callbackCopy('Start')
    try:
        src = utils.getRandomString()
        shutil.copyfile(os.path.join(contestPath, 'src', personName, problem.filename + '.' + compiler.extension), src + '.' + compiler.extension)
    except:
        judgeResult.status = const.NO_SOURCE_FILE
        if callbackCopy:
            callbackCopy('No Source File')
        clean()
        return judgeResult

    try:
        for path in problem.addition:
            shutil.copyfile(os.path.join(contestPath, 'data', path), os.path.basename(path))
    except:
        judgeResult.status = const.NO_ADDITON_FILE
        if callbackCopy:
            callbackCopy('Failed when copying addition files')
        clean()
        return judgeResult
    if callbackCopy:
        callbackCopy('Done')

    # Compile
    if callbackCompile:
        callbackCompile('Start')
    compileSuccess, compileInfo = compile(compiler, src)
    judgeResult.detail = compileInfo
    if not compileSuccess:
        judgeResult.status = const.COMPILATION_ERROR
        clean()
        if callbackCompile:
            callbackCompile(const.COMPILATION_ERROR)
        return judgeResult
    if callbackCompile:
        callbackCompile('Done')

    judgeResult.status = const.NORMAL
    # Run each testcase
    for testcase in problem.testcase:
        testcaseResult = TestcaseResult(const.CORE_ERROR, 0, 0, 0, 0, '')
        if callbackTestcase:
            callbackTestcase(testcaseResult, 'Start')

        # Copy inputs
        try:
            for path, filename in zip(testcase.inputs, problem.inputs):
                shutil.copyfile(os.path.join(contestPath, 'data', path), filename)
        except:
            testcaseResult.status = const.NO_STANDARD_INPUT
            judgeResult.append(testcaseResult)
            if callbackTestcase:
                callbackTestcase(testcaseResult, const.NO_STANDARD_INPUT)
            continue

        # Run
        timeUsed, memoryUsed, exitcode, progStatus = run(compiler.executable.replace('%s', src), testcase.timeLimit, testcase.memoryLimit)
        testcaseResult.time = timeUsed
        testcaseResult.memory = memoryUsed
        testcaseResult.exitcode = exitcode
        if progStatus != const.NORMAL:
            testcaseResult.status = progStatus
            judgeResult.append(testcaseResult)
            if callbackTestcase:
                callbackTestcase(testcaseResult, progStatus)
            continue

        # Diff
        if problem.checker == const.NORMAL_JUDGE:
            diffSuccess, diffInfo, score = diff(const.NORMAL_JUDGE_PATH, testcase.score, os.path.join(contestPath, 'data', testcase.output), '"%s"' % problem.output)
        elif problem.checker == const.FLOAT_JUDGE:
            diffSuccess, diffInfo, score = diff(const.NORMAL_JUDGE_PATH, testcase.score, os.path.join(contestPath, 'data', testcase.output), '%s "%s"' % (problem.checkerArg, problem.output))
        else:
            diffSuccess, diffInfo, score = diff(const.NORMAL_JUDGE_PATH, testcase.score, os.path.join(contestPath, 'data', testcase.output), problem.checkerArg)
        if not diffSuccess:
            testcaseResult.status = const.CHECKER_ERROR
            judgeResult.append(testcaseResult)
            if callbackTestcase:
                callbackTestcase(testcaseResult, const.CHECKER_ERROR)
            continue
        if not score:
            testcaseResult.status = const.WRONG_ANSWER
            judgeResult.append(testcaseResult)
            if callbackTestcase:
                callbackTestcase(testcaseResult, 'Done')
            continue
        testcaseResult.status = const.ACCEPTED if score == testcase.score else const.PARTLY_ACCEPTED
        testcaseResult.score = testcase.score
        judgeResult.append(testcaseResult)
        if callbackTestcase:
            callbackTestcase(testcaseResult, 'Done')

    clean()
    return judgeResult

