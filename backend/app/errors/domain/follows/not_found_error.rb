# frozen_string_literal: true

module Domain
  module Follows
    class NotFoundError < Domain::BaseDomainError
      PATH = "domain.errors.follows.not_found"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details: details)
        super(**attrs)
      end
    end
  end
end
