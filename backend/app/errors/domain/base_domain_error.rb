# frozen_string_literal: true

module Domain
  # Abstract parent for all business-logic / domain exceptions.
  #
  # Subclasses should call +super+ with the translated message and code
  # obtained from ErrorMessageBuilder:
  #
  #   class MyDomainError < Domain::BaseDomainError
  #     PATH = "domain.errors.some_context.my_error"
  #
  #     def initialize(details = {})
  #       attrs = ErrorMessageBuilder.build(path: PATH, details:)
  #       super(**attrs)
  #     end
  #   end
  class BaseDomainError < BaseError; end
end
