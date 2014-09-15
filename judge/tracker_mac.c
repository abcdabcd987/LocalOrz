#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

#include "tracker.h"
#define BUFSIZE (1024)

static pid_t pid;
static int status;
static int exitcode;
static int time_used;
static int time_limit;
static int memory_used;
static int memory_limit;
static int kill_signal;
static struct rusage ruse;
static char executable[BUFSIZE];

void dochild(void)
{
  struct rlimit LIM;
  LIM.rlim_cur = time_limit/1000+1;
  LIM.rlim_max = LIM.rlim_cur;
  setrlimit(RLIMIT_CPU, &LIM);

  fclose(stdin);
  fclose(stdout);

  execl(executable, executable, (char *)0);
  exit(100);
}

void done(char* result)
{
  printf("%d\n%d\n%d\n%s\n%s", time_used, memory_used, exitcode, result, sig2str(kill_signal));
  exit(0);
}

void doparent(void)
{
  if (wait4(pid, &status, 0, &ruse) == -1) done(RES_CR);
  time_used   = ruse.ru_utime.tv_sec * 1000 + ruse.ru_utime.tv_usec / 1000;
  memory_used = ruse.ru_maxrss / 1024;
  exitcode    = WEXITSTATUS(status);

  if (WIFSIGNALED(status)) {
    if (WTERMSIG(status) == 100) done(RES_CR);
    kill_signal = WTERMSIG(status);
    if (memory_used > memory_limit) done(RES_ML);
    if (kill_signal == SIGXCPU) done(RES_TL);
    done(RES_RE);
  }
  if (memory_used > memory_limit) done(RES_ML);
  if (WIFEXITED(status)) done(RES_NL);

  // it's weird to be here.
  exit(-1);
}

int main(int argc, char* argv[])
{
  // argv[1]: executable file
  // argv[2]: time limit (ms)
  // argv[3]: memory limit (kb)
  if (argc != 4) exit(1);

  sprintf(executable, "%s", argv[1]);
  sscanf(argv[2], "%d", &time_limit);
  sscanf(argv[3], "%d", &memory_limit);
  if ((pid = fork()) != 0) {
    doparent();
  } else {
    dochild();
  }

  exit(0);
}

