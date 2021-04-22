#!/bin/bash
gcloud builds submit --tag eu.gcr.io/api-centric-web2/api-centric-node
terraform apply
exit