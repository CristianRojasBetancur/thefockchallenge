# frozen_string_literal: true

module Authentication
  module Errors
    # Convenience alias so existing references still resolve.
    Base = Authorization::BaseAuthorizationError

    class InvalidCredentials < Base
      PATH = "domain.errors.authentication.invalid_credentials"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details:)
        super(**attrs)
      end
    end

    class InvalidToken < Base
      PATH = "domain.errors.authentication.invalid_token"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details:)
        super(**attrs)
      end
    end

    class TokenExpired < Base
      PATH = "domain.errors.authentication.token_expired"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details:)
        super(**attrs)
      end
    end

    class UserNotFound < Base
      PATH = "domain.errors.authentication.user_not_found"

      def initialize(details = {})
        attrs = ErrorMessageBuilder.build(path: PATH, details:)
        super(**attrs)
      end
    end
  end
end
