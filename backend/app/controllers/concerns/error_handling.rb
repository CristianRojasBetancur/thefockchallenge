# frozen_string_literal: true

# Centralizes exception handling for all controllers.
#
# Rescue order (most to least specific):
#   1. Errors::Base subclasses (authorization, domain)
#   2. ActiveRecord::RecordInvalid (AR validation failures)
#   3. StandardError (catch-all for unmapped exceptions)
module ErrorHandling
  extend ActiveSupport::Concern

  included do
    rescue_from StandardError,              with: :handle_standard_error
    rescue_from BaseError,                  with: :handle_application_error
    rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid
  end

  private

  # Renders a single Errors::Base (domain / authorization) as the JSON envelope.
  # HTTP status is derived from the first 3 characters of the error code.
  def handle_application_error(exception)
    status = http_status_from_code(exception.code)
    render_errors(
      [ { message: exception.message, code: exception.code } ],
      status:
    )
  end

  # Converts every ActiveRecord validation error into one envelope entry.
  # Each entry gets code "422XX" where XX is a 0-based index.
  def handle_record_invalid(exception)
    errors = exception.record.errors.map.with_index do |error, index|
      {
        message: error.full_message,
        code:    format("422%02d", index)
      }
    end

    render_errors(errors, status: :unprocessable_entity)
  end

  # Catch-all for any unmapped StandardError.
  # Logs the exception and returns a generic 500 response.
  def handle_standard_error(exception)
    binding.break
    Rails.logger.error("[ErrorHandling] Unmapped exception: #{exception.class} — #{exception.message}")
    Rails.logger.error(exception.backtrace&.first(10)&.join("\n"))

    attrs = ErrorMessageBuilder.build(path: "domain.errors.generic.internal_server_error")
    render_errors([ attrs ], status: :internal_server_error)
  end

  # Renders @errors via the shared jbuilder template.
  def render_errors(errors_array, status:)
    @errors = errors_array
    render "errors/error", formats: [ :json ], status:
  end

  # Extracts the HTTP status integer from the first 3 chars of a code string.
  # Falls back to 500 for unexpected formats.
  def http_status_from_code(code)
    Rack::Utils.status_code(code.to_s[0..2].to_i) rescue :internal_server_error
  end
end
