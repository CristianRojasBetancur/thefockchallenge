# frozen_string_literal: true

module Authorization
  module Tweets
    class ForbiddenError < Authorization::BaseAuthorizationError
      PATH = "domain.errors.tweets.forbidden"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details:)
        super(**attrs)
      end
    end
  end
end
