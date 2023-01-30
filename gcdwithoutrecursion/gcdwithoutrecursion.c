#include<stdio.h>
int gcd(int a,int b);
int main()
{
int n1,n2,a,b;
printf("enter the values of positive integers");
scanf("%5d%5d",&n1,&n2);
int result=gcd(n1,n2);
printf(" gcd of %d and %d = %d",n1,n2,result);
return 0;
}
int gcd(int a,int b)
{
int hcf;
for (int i=1;i<a&&i<b;i++)
{
if (a%i==0&&b%i==0)
{
hcf=i;
}}

return hcf;
}


