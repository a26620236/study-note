PRODUCT_NAME = LumiTure
LOWER_CASE_PRODUCT_NAME = lumiture
ROLE = frontend
APPLICATION = $(PRODUCT_NAME)-${ROLE}

GCP_PROJECT_ID = tw-rd-app-finops-dev
REGION = asia-east1
ZONE = asia-east1-a
GKE_CLUSTER_NAME = $(LOWER_CASE_PRODUCT_NAME)-dev
K8S_ROOT = deploy/lumiture-ai/helm

GAR_DOMAIN = asia-east1-docker.pkg.dev
IMAGE_NAME = $(LOWER_CASE_PRODUCT_NAME)-$(ROLE)
GAR_IMAGE = $(GAR_DOMAIN)/${GCP_PROJECT_ID}/$(LOWER_CASE_PRODUCT_NAME)-dev/$(IMAGE_NAME)
TAG = dev  # TODO
GAR_DEV_IMAGE = $(GAR_IMAGE):$(TAG)

GCLOUD_CONFIG_FILE = $(LOWER_CASE_PRODUCT_NAME)-$(ROLE)
SEARCH_CONFIG := $(shell gcloud config configurations list | awk '$$1 ~ /$(GCLOUD_CONFIG_FILE)/' | wc -l)

help:
	@sed -ne '/@sed/!s/## //p' $(MAKEFILE_LIST)

build:  ## build image
	docker build --progress=plain -f ./deploy/lumiture-ai/dockerfiles/Dockerfile -t $(IMAGE_NAME):$(TAG) .

config-gcloud:
	@if [ $(SEARCH_CONFIG) = 0 ]; then\
		gcloud config configurations create $(GCLOUD_CONFIG_FILE);\
		gcloud config set project $(GCP_PROJECT_ID);\
		gcloud config set compute/region $(REGION);\
		gcloud config set compute/zone $(ZONE);\
	else\
	  gcloud config configurations activate $(GCLOUD_CONFIG_FILE);\
	fi

config-env:
	make config-cluster
	make config-docker

# Manual deploy: step 1
build-dev-image:
	docker buildx build --platform linux/amd64 --no-cache -f ./deploy/lumiture-ai/dockerfiles/Dockerfile -t $(GAR_DEV_IMAGE) .

# Manual deploy: step 2
push-dev-image:
	docker push $(GAR_DEV_IMAGE)

# Manual deploy step 3
deploy-dev:
	helm upgrade $(LOWER_CASE_PRODUCT_NAME)-${ROLE} -f $(K8S_ROOT)/values.dev.yaml $(K8S_ROOT)
# --dry-run --debug

test-init-helm-release:
	helm install $(LOWER_CASE_PRODUCT_NAME)-${ROLE} -f $(K8S_ROOT)/values.dev.yaml $(K8S_ROOT)
