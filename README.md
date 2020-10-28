# Hello Fargate

```
brew install awscli aws-iam-authenticator eksctl
aws sts get-caller-identity

{
    "UserId": "AKIA999999999999999",
    "Account": "111111111111",
    "Arn": "arn:aws:iam::111111111111:user/my_service_account_user
}

aws eks list-clusters --region us-west-2
{
    "clusters": [
        "mycluster"
    "
}

aws eks --region us-west-2 update-kubeconfig --name mycluster
```
