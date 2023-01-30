#include<stdio.h>
int fact(int);int f=1;
int main()
{
int n,f,res;
printf("enter the value of n");
scanf("%d",&n);
f=2;
res=fact(n);
printf("%d",res);
return 0;
}int fact(int n)
{
int i;
for (i=1;i<=n;i++)
{
f=f*i;
printf("fact is %d\n",f);
}
return f;
}

