/*
 * Program by cxjyxx_me
 * Modified by abcdabcd987
 */
#include <string>
#include <fstream>
#include <iostream>
#include <algorithm>
#include <cmath>
#include <cstdlib>
using std::string;
using std::ifstream;
using std::ofstream;
using std::min;
using std::cout;
using std::endl;

string s1, s2;
const string::size_type ten = 10;
int fsco;

void score(const int point)
{
  ofstream out("__score.txt");
  out << point;
  out.close();
  exit(0);
}
int main(int argc, char* argv[])
{
  fsco = atoi(argv[1]);
  ifstream std(argv[2]);
  ifstream out(argv[3]);
  int h = 0;
  while (std && out)
  {
    bool flag = getline(std, s1);
    flag = getline(out, s2) && flag;
    if (!flag)
      break;
    h++;
    int k = s1.length();
    while (k && (s1[k - 1] == ' ' || s1[k - 1] == '\r' || s1[k - 1] == '\n')) k--;
    s1 = s1.substr(0, k);
    
    k = s2.length();
    while (k && (s2[k - 1] == ' ' || s2[k - 1] == '\r' || s2[k - 1] == '\n')) k--;
    s2 = s2.substr(0, k);
    
    if (s1 != s2)
    {
      string::size_type k = 0;
      while (k < s1.length() && k < s2.length() && s1[k] == s2[k]) k++;
      cout << "WA on (" << h << ", " << k + 1 << ")" << endl;
      if (k == s1.length())
      {
        cout << " Standard   output : ...<empty>" << endl;
        cout << " Competitor output : ..." + s2.substr(k, min(ten, s2.length() - k));
        score(0);
      }
      if (k == s2.length())
      {
        cout << " Standard   output : ..." + s1.substr(k, min(ten, s1.length() - k)) << endl;
        cout << " Competitor output : ...<empty>";
        score(0);
      }
      
      cout << " Standard   output : ..." + s1.substr(k, min(ten, s1.length() - k)) << endl;
      cout << " Competitor output : ..." + s2.substr(k, min(ten, s2.length() - k));
      score(0);
    }
  }    
  
  while (std)
  {
    int k = s1.length();
    while (k && s1[k - 1] == ' ') k--;
    s1 = s1.substr(0, k);
    if (s1 != "")
    {
      cout << "Standard output is longer than competitor output.";
      score(0);
    }
    getline(std, s1);
  }
  while (out)
  {
    int k = s2.length();
    while (k && s2[k - 1] == ' ') k--;
    s2 = s2.substr(0, k);
    if (s2 != "")
    {
      cout << "Competitor output is longer than standard output.";
      score(0);
    }
    getline(out, s2);
  }

  score(fsco);
}  
