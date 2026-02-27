# frozen_string_literal: true

module Authentication
  class CookieStore
    COOKIE_KEY = :auth_token

    def initialize(cookies)
      @cookies = cookies
    end

    def write(token)
      @cookies.encrypted[COOKIE_KEY] = {
        value:     token,
        httponly:  true,
        same_site: :lax,
        secure:    Rails.env.production?,
        expires:   JsonWebToken::EXPIRATION.from_now
      }
    end

    def read
      @cookies.encrypted[COOKIE_KEY]
    end

    def delete
      @cookies.delete(COOKIE_KEY)
    end
  end
end
