require "test_helper"

class Api::V1::ProfilesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create!(
      email:                 "profile@example.com",
      username:              "profileuser",
      handle:                "profileuser",
      password:              "securepassword",
      password_confirmation: "securepassword"
    )

    set_auth_cookie_for(@user)
  end

  test "GET /api/v1/profile returns current user" do
    get api_v1_profile_path, as: :json
    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal @user.email, body["email"]
  end

  test "PATCH /api/v1/profile updates profile fields" do
    patch api_v1_profile_path,
          params: { user: { name: "New Name", bio: "Hello world" } },
          as:     :json

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal "New Name",  body["name"]
    assert_equal "Hello world", body["bio"]
  end

  test "GET /api/v1/profile 401 without auth cookie" do
    new_session = open_session
    new_session.get api_v1_profile_path, as: :json
    assert_equal 401, new_session.response.status
  end

  private

  def set_auth_cookie_for(user)
    post auth_login_path,
         params: { session: { email: user.email, password: "securepassword" } },
         as:     :json
    assert_response :ok
  end
end
