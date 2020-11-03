# Hello Fargate


## Install Dependencies

```
brew install awscli aws-iam-authenticator eksctl
```

## Test Clusters

### Managed Nodes Clusters

```bash
# Creating a cluster typically takes 20 minutes
eksctl create cluster -f eks/cluster-managed.yml
# Deploy stuff here...
# Tearing down a cluster can take 5-7 minutes
eksctl delete cluster -f eks/cluster-managed.yml --wait
```

### Fargate Cluster

```bash
# Creating a cluster typically takes 20 minutes
eksctl create cluster -f eks/cluster-fargate.yml
# Deploy stuff here...
# Tearing down a cluster can take 5-7 minutes
eksctl delete cluster -f eks/cluster-fargate.yml --wait
```

----

## Troubleshooting

### Adding cluster to kubeconfig
```
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
