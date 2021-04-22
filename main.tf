provider "google" {

  credentials = file(var.credentials_file)

  project = var.project
  region  = var.region
  zone    = var.zone
}


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
