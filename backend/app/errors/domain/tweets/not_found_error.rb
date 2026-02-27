# frozen_string_literal: true

module Domain
  module Tweets
    class NotFoundError < Domain::BaseDomainError
      PATH = "domain.errors.tweets.not_found"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details:)
        super(**attrs)
      end
    end
  end
end
