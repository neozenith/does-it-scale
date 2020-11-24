# Hello Fargate


## Install Dependencies

```
brew install awscli aws-iam-authenticator eksctl telepresence
```

## Test Clusters

### Managed Nodes Clusters

```bash
# Creating a cluster typically takes 20 minutes
eksctl create cluster -f eks/cluster-managed.yml
# Modify existing cluster by adding new nodegroup
eksctl create nodegroup -f eks/cluster-managed2.yml

kubectl apply -f k8s/cloud/

# Find loadbalancer public endpoint

kubectl delete -f k8s/cloud/

# Remove the nodegroup first and approve the action
eksctl delete nodegroup -f eks/cluster-managed2.yml --wait --approve
# Tearing down a cluster can take 5-7 minutes
eksctl delete cluster -f eks/cluster-managed.yml --wait
```

### Fargate Cluster

```bash
# Creating a cluster typically takes 20 minutes
eksctl create cluster -f eks/cluster-fargate.yml

kubectl apply -f k8s/api-cloud.yml

# Find loadbalancer public endpoint

kubectl delete -f k8s/api-cloud.yml

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
