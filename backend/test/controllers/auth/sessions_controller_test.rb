require "test_helper"

class Auth::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create!(
      email:                 "user@example.com",
      username:              "loginuser",
      handle:                "loginuser",
      password:              "securepassword",
      password_confirmation: "securepassword"
    )
  end

  test "POST /auth/login 200 with correct credentials" do
    post auth_login_path,
         params: { session: { email: @user.email, password: "securepassword" } },
         as:     :json

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal @user.email, body["email"]
  end

  test "POST /auth/login 401 with wrong password" do
    post auth_login_path,
         params: { session: { email: @user.email, password: "wrongpassword" } },
         as:     :json

    assert_response :unauthorized
  end

  test "POST /auth/login 401 with unknown email" do
    post auth_login_path,
         params: { session: { email: "nobody@example.com", password: "whatever" } },
         as:     :json

    assert_response :unauthorized
  end

  test "DELETE /auth/logout 200 clears the session" do
    post auth_login_path,
         params: { session: { email: @user.email, password: "securepassword" } },
         as:     :json
    assert_response :ok

    delete auth_logout_path, as: :json
    assert_response :ok
    assert_equal "Logged out successfully", JSON.parse(response.body)["message"]
  end
end
