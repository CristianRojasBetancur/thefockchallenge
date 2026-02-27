# frozen_string_literal: true

class BaseError < StandardError
    attr_reader :code

    # @param message [String] already-translated human-readable description
    # @param code    [String] error code whose first 3 chars are the HTTP status
    def initialize(message:, code:)
      super(message)
      @code = code.to_s
    end
  end

