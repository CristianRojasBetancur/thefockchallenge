# frozen_string_literal: true

class JsonWebToken
  ALGORITHM  = "HS256"
  EXPIRATION = 24.hours

  class << self
    def encode(payload, exp: EXPIRATION)
      claims = payload.merge(
        exp: exp.from_now.to_i,
        iat: Time.current.to_i
      )
      JWT.encode(claims, secret_key, ALGORITHM)
    end

    def decode(token)
      decoded = JWT.decode(token, secret_key, true, { algorithm: ALGORITHM })
      HashWithIndifferentAccess.new(decoded.first)
    rescue JWT::ExpiredSignature
      raise Authentication::Errors::TokenExpired
    rescue JWT::DecodeError => e
      raise Authentication::Errors::InvalidToken, e.message
    end

    private

    def secret_key
      Rails.application.secret_key_base
    end
  end
end
