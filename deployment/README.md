# Deployment

## Start Docker Container
To start the docker container run:  
`sh ./docker-shell.sh`

## API's to enbale in GCP
* Compute Engine API
* Service Usage API
* Cloud Resource Manager API
* Google Container Registry API

## SSH Setup
#### Configuring OS Login for service account
```
gcloud compute project-info add-metadata --project mlproject01-207413 --metadata enable-oslogin=TRUE
```

#### Create SSH key for service account
```
cd /secrets
ssh-keygen -f ssh-key-deployment
cd /app
```

#### Providing public SSH keys to instances
```
gcloud compute os-login ssh-keys add --key-file=/secrets/ssh-key-deployment.pub
```
From the output of the above command keep note of the username. Here is a snippet of the output 
```
- accountId: mlproject01-207413
    gid: '2516264398'
    homeDirectory: /home/sa_118104661568955160800
    name: users/deployment@mlproject01-207413.iam.gserviceaccount.com/projects/mlproject01-207413
    operatingSystemType: LINUX
    primary: true
    uid: '2516264398'
    username: sa_118104661568955160800
```
The username is `sa_118104661568955160800`


## Deployment Setup
* GCP project details in docker-shell.sh file
* GCP project details in inventory.yml file
* GCP Compute instance details in inventory.yml file

## Deployment
#### Create Server in GCP
```
ansible-playbook deploy-gcp-setup.yml -i inventory.yml

ansible-playbook deploy-create-instance.yml -i inventory.yml --extra-vars cluster_state=present

ansible-playbook deploy-create-instance.yml -i inventory.yml --extra-vars cluster_state=absent

```
Once the command runs successfully get the IP address of the compute instance from GCP and update the appserver>hosts in inventory.yml

#### Provision Dev Server in GCP
```
ansible-playbook deploy-provision-instance.yml -i inventory.yml
```

#### Build and Push Docker Containers to GCR
```
ansible-playbook deploy-docker-images.yml -i inventory.yml
```

#### Setup Database
```
gcloud sql instances list

gcloud sql instances create dev-using-db-01 \
--database-version=POSTGRES_13 \
--cpu=2 \
--memory=7680MB \
--region=us-central

gcloud sql users set-password postgres \
--instance=dev-using-db-01 \
--password=welcome123

gcloud beta sql instances patch dev-using-db-01 \
--project=mlproject01-207413 \
--network=projects/mlproject01-207413/global/networks/default \
--no-assign-ip

gcloud sql instances delete dev-using-db-01

```

#### Deploy Docker Containers to Server
```
ansible-playbook deploy-setup-containers.yml -i inventory.yml
```

#### Setup Webserver on Dev Server in GCP
```
ansible-playbook deploy-setup-webserver.yml -i inventory.yml
```


Once the command runs you can go to `http://<YOUR INSTANCE IP ADDRESS>/` and you should see the default page. 

You can SSH into the server from the GCP console and see status of containers
```
sudo docker container ls
sudo docker container logs api-service -f
```

## Deployment to Kubernetes Cluster

### Create & Deploy Cluster
```
ansible-playbook deploy-k8s-cluster.yml -i inventory.yml --extra-vars cluster_state=present
```

### Try some kubectl commands
```
kubectl get all
kubectl get all --all-namespaces
kubectl get pods --all-namespaces
```

```
kubectl get componentstatuses
kubectl get nodes
```

### If you want to shell into a container in a Pod
```
kubectl get pods --namespace=mushroom-app-cluster-namespace
kubectl get pod api-5d4878c545-47754 --namespace=mushroom-app-cluster-namespace
kubectl exec --stdin --tty api-5d4878c545-47754 --namespace=mushroom-app-cluster-namespace  -- /bin/bash
```

### View the App
* Copy the `nginx_ingress_ip` from the terminal from the create cluster command
* Go to `http://<YOUR INGRESS IP>.sslip.io`

### Delete Cluster
```
ansible-playbook deploy-k8s-cluster.yml -i inventory.yml --extra-vars cluster_state=absent
```