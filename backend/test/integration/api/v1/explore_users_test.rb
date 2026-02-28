require "test_helper"

module Api
  module V1
    class ExploreUsersTest < ActionDispatch::IntegrationTest
      setup do
        @user = User.create!(
          email: "test_#{SecureRandom.hex}@example.com",
          username: "user_#{SecureRandom.hex(4)}",
          password: "password123",
          password_confirmation: "password123"
        )
        post auth_login_path, params: { session: { email: @user.email, password: "password123" } }, as: :json

        @other_user = User.create!(
          email: "test_#{SecureRandom.hex}@example.com",
          username: "user_#{SecureRandom.hex(4)}",
          name: "Other Dude",
          password: "password123",
          password_confirmation: "password123"
        )
      end

      test "gets explore users list excluding current user" do
        get explore_api_v1_users_url, as: :json
        
        assert_response :ok
        response_body = JSON.parse(response.body)
        
        assert_equal 1, response_body.length
        assert_equal @other_user.username, response_body[0]["username"]
      end
    end
  end
end
