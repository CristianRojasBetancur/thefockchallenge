require "test_helper"

class Auth::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  def valid_payload
    {
      user: {
        email:                 "new@example.com",
        username:              "newuser",
        handle:                "newuser",
        password:              "securepassword",
        password_confirmation: "securepassword"
      }
    }
  end

  test "POST /auth/register 201 with valid attributes" do
    post auth_register_path, params: valid_payload, as: :json

    assert_response :created
    body = JSON.parse(response.body)
    assert_equal "new@example.com", body["email"]
    refute body.key?("password_digest"), "password_digest must never be exposed"
  end

  test "POST /auth/register 422 with invalid attributes" do
    post auth_register_path,
         params: { user: valid_payload[:user].merge(email: "bad") },
         as:     :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body["errors"].present?
  end
end
