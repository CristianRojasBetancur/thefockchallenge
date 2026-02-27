# frozen_string_literal: true

require "test_helper"

class DocsTest < ActionDispatch::IntegrationTest
  test "GET /docs returns success" do
    get "/docs"
    assert_response :success
  end
end
