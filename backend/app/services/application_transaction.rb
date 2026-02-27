# frozen_string_literal: true

require "dry/transaction"
require "dry/monads"

class ApplicationTransaction
  include Dry::Transaction
  include Dry::Monads[:result]

  class << self
    def call(...)
      new.call(...)
    end
  end
end
