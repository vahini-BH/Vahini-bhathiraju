#include<stdio.h>
int gcd(int n1,int n2);
int main()
{
int n1,n2;
printf("enter the values of positive integers");
scanf("%5d%5d",&n1,&n2);
printf(" gcd of %d and %d is %d",n1,n2,gcd(n1,n2));
return 0;
}
int gcd(int x,int y)
{
if (y!=0)
return gcd(y,x%y);
else 
return x;
}


