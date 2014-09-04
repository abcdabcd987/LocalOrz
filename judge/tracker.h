#define RES_NL ("normal")
#define RES_CR ("cannot execute")
#define RES_RE ("runtime error")
#define RES_TL ("time limit exceeded")
#define RES_ML ("memory limit exceeded")

const char* sig2str(int sig)
{
    /*
        How to print signal names(not descr) in linux
        http://stackoverflow.com/questions/13510326/how-to-print-signal-namesnot-descr-in-linux
    */
    switch (sig) {
        case SIGHUP    : return "SIGHUP";
        case SIGINT    : return "SIGINT";
        case SIGQUIT   : return "SIGQUIT";
        case SIGILL    : return "SIGILL";
        case SIGTRAP   : return "SIGTRAP";
        case SIGABRT   : return "SIGABRT";
        case SIGEMT    : return "SIGEMT";
        case SIGFPE    : return "SIGFPE";
        case SIGKILL   : return "SIGKILL";
        case SIGBUS    : return "SIGBUS";
        case SIGSEGV   : return "SIGSEGV";
        case SIGSYS    : return "SIGSYS";
        case SIGPIPE   : return "SIGPIPE";
        case SIGALRM   : return "SIGALRM";
        case SIGTERM   : return "SIGTERM";
        case SIGURG    : return "SIGURG";
        case SIGSTOP   : return "SIGSTOP";
        case SIGTSTP   : return "SIGTSTP";
        case SIGCONT   : return "SIGCONT";
        case SIGCHLD   : return "SIGCHLD";
        case SIGTTIN   : return "SIGTTIN";
        case SIGTTOU   : return "SIGTTOU";
        case SIGIO     : return "SIGIO";
        case SIGXCPU   : return "SIGXCPU";
        case SIGXFSZ   : return "SIGXFSZ";
        case SIGVTALRM : return "SIGVTALRM";
        case SIGPROF   : return "SIGPROF";
        case SIGWINCH  : return "SIGWINCH";
        case SIGINFO   : return "SIGINFO";
        case SIGUSR1   : return "SIGUSR1";
        case SIGUSR2   : return "SIGUSR2";
        case SIGSTKSZ  : return "SIGSTKSZ";
        default        : return "UNKNOWN!";
    }
}
