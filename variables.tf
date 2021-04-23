variable "environment" {
  type    = string
  default = "dev"
}

variable "machine_types" {
  type = map(any)
  default = {
    dev     = "f1-micro"
    staging = "f1-micro"
    prod    = "f1-micro"
  }
}

variable "project" {
  default = "api-centric-v3"
}

variable "credentials_file" {
  default = "./keys/googleCloudKey.json"
}

variable "region" {
  default = "europe-west1"
}

variable "zone" {
  default = "europe-west1-c"
}

variable "docker-nodejs-image" {
  default = "eu.gcr.io/api-centric-v3/api-centric-node:latest"
}

variable "github_repository" {
  default = "API-CENTRIC_BACK"
}

variable "github_owner" {
  default = "SP-Sumampow"
}

variable "github_branch" {
  default = "^master$"
}
