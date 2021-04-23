provider "google" {

  credentials = file(var.credentials_file)

  project = var.project
  region  = var.region
  zone    = var.zone
}


# resource "google_cloudbuild_trigger" "build-trigger" {

#   github {
#     name  = var.github_repository
#     owner = var.github_owner
#     push {
#       branch = var.github_branch
#     }
#   }

#   build {
#     step {
#       name = var.docker-nodejs-image

#       args    = []
#       timeout = "120s"
#     }


#     artifacts {
#       images = [var.docker-nodejs-image]
#     }
#   }
# }

# Enables the Cloud Run API
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_service
resource "google_project_service" "run_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = true
}

# Create the Cloud Run service
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_service
resource "google_cloud_run_service" "api_centric_nodejs" {
  name     = "api-centric--nodejs"
  location = var.region

  template {
    spec {
      containers {
        image = var.docker-nodejs-image
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Waits for the Cloud Run API to be enabled
  # depends_on = [google_project_service.run_api, google_cloudbuild_trigger.build-trigger]
  depends_on = [google_project_service.run_api]
}

# Allow unauthenticated users to invoke the service
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_service_iam
resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.api_centric_nodejs.name
  location = google_cloud_run_service.api_centric_nodejs.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Display the service URL
# https://www.terraform.io/docs/language/values/outputs.html
output "service_url" {
  value = google_cloud_run_service.api_centric_nodejs.status[0].url
}

resource "google_cloud_scheduler_job" "api-centric-generate-tweet-analyze" {
  name             = "api-centric-generate-tweet-analyze"
  description      = "test http job"
  schedule         = "0 0 * * *"
  time_zone        = "Europe/Paris"
  attempt_deadline = "320s"

  depends_on = [google_cloud_run_service.api_centric_nodejs]

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "POST"
    uri         = "https://${google_cloud_run_service.api_centric_nodejs.name}/tweet/generateTweetAnalize"
  }
}