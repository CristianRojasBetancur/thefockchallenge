require "test_helper"

module Api
  module V1
    class UserTweetsTest < ActionDispatch::IntegrationTest
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
          username: "user_other_#{SecureRandom.hex(4)}",
          password: "password123",
          password_confirmation: "password123"
        )
        
        @other_user.tweets.create!(content: "Other tweet 1")
        @other_user.tweets.create!(content: "Other tweet 2")
        @user.tweets.create!(content: "My tweet 1")
        @user.tweets.create!(content: "My tweet 2")
      end

      test "gets user tweets by username" do
        get tweets_api_v1_user_url(@other_user.username), as: :json
        
        assert_response :ok
        response_body = JSON.parse(response.body)
        
        assert_equal 2, response_body.length
        # Sorted by created_at desc (latest first)
        assert_equal "Other tweet 2", response_body[0]["content"]
        assert_equal "Other tweet 1", response_body[1]["content"]
      end

      test "gets user tweets by id" do
        get tweets_api_v1_user_url(@user.id), as: :json
        
        assert_response :ok
        response_body = JSON.parse(response.body)
        
        assert_equal 2, response_body.length
        assert_equal "My tweet 2", response_body[0]["content"]
        assert_equal "My tweet 1", response_body[1]["content"]
      end

      test "returns 404 for non-existent user" do
        get tweets_api_v1_user_url("unknown_user"), as: :json
        
        assert_response :not_found
        response_body = JSON.parse(response.body)
        assert_equal "User not found", response_body["errors"][0]["message"]
      end
    end
  end
end
