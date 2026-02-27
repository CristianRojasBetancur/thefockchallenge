require "test_helper"

class BaseErrorTest < ActiveSupport::TestCase
  test "stores message and code, and inherits from StandardError" do
    error = BaseError.new(message: "Custom error", code: "40001")
    
    assert_kind_of StandardError, error
    assert_equal "Custom error", error.message
    assert_equal "40001", error.code
  end
end
