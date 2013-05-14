import os

# LocalOrz
VERSION = '0.1 dev'
CORE_ERROR = 'Core Error'
JUDGE_CLIENT_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'judge_client')

# Problem Status
UNKNOWN = 'Unknown'
NORMAL = 'Normal'
COMPILATION_ERROR = 'Compilation Error'
NO_ADDITION_FILE = 'No Addition File'
PROBLEM_STATUS = (CORE_ERROR, UNKNOWN, NORMAL, COMPILATION_ERROR, NO_ADDITION_FILE)

# Testcase Status
ACCEPTED = 'Accepted'
WRONG_ANSWER = 'Wrong Answer'
PARTLY_ACCEPTED = 'Partly Accepted'
CANNOT_EXECUTE = 'Cannot Execute'
TIME_LIMIT_EXCEEDED = 'Time Limit Exceeded'
MEMORY_LIMIT_EXCEEDED = 'Memory Limit Exceeded'
RUNTIME_ERROR = 'Runtime Error'
PROGRAM_NO_OUTPUT = 'Program No Output'
NO_SOURCE_FILE = 'No Source File'
NO_STANDARD_INPUT = 'No Standard Input'
NO_STANDARD_OUTPUT = 'No Standard Output'
CHECKER_ERROR = 'Checker Error'
TESTCASE_STATUS = (ACCEPTED, WRONG_ANSWER, PARTLY_ACCEPTED, CANNOT_EXECUTE, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, RUNTIME_ERROR, PROGRAM_NO_OUTPUT, NO_SOURCE_FILE, NO_STANDARD_INPUT, NO_STANDARD_OUTPUT, CHECKER_ERROR, COMPILATION_ERROR, CORE_ERROR)

# Checker
NORMAL_JUDGE = 'Normal Judge'
FLOAT_JUDGE = 'Float Judge'
SPECIAL_JUDGE = 'Special Judge'
NORMAL_JUDGE_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'normal_judge')
FLOAT_JUDGE_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'float_judge')
CHECKER = [NORMAL_JUDGE, FLOAT_JUDGE, SPECIAL_JUDGE]
