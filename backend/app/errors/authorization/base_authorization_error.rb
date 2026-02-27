# frozen_string_literal: true

module Authorization
  # Abstract parent for all authentication / authorization exceptions.
  #
  # Subclasses should call +super+ with the translated message and code
  # obtained from ErrorMessageBuilder:
  #
  #   class MyAuthError < Authorization::BaseAuthorizationError
  #     PATH = "domain.errors.authentication.my_error"
  #
  #     def initialize(details = {})
  #       attrs = ErrorMessageBuilder.build(path: PATH, details:)
  #       super(**attrs)
  #     end
  #   end
  class BaseAuthorizationError < BaseError; end
end
