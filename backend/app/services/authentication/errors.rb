# frozen_string_literal: true

module Authentication
  module Errors
    class Base < StandardError; end

    class InvalidToken < Base
      def initialize(msg = "Invalid authentication token")
        super
      end
    end

    class TokenExpired < Base
      def initialize(msg = "Authentication token has expired")
        super
      end
    end

    class UserNotFound < Base
      def initialize(msg = "Authenticated user not found")
        super
      end
    end
  end
end
