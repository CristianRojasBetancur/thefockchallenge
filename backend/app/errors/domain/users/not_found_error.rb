# frozen_string_literal: true

module Domain
  module Users
    class NotFoundError < Domain::BaseDomainError
      PATH = "domain.errors.users.not_found"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details: details)
        super(**attrs)
      end
    end
  end
end
