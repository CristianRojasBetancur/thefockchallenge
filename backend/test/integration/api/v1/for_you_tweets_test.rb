require "test_helper"

module Api
  module V1
    class ForYouTweetsTest < ActionDispatch::IntegrationTest
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
          password: "password123",
          password_confirmation: "password123"
        )
        
        @other_user.tweets.create!(content: "Other tweet")
        @user.tweets.create!(content: "My tweet")
      end

      test "gets for you feed with all tweets" do
        get for_you_api_v1_tweets_url, as: :json
        
        assert_response :ok
        response_body = JSON.parse(response.body)
        
        assert_equal 2, response_body.length
        # Sorted by created_at desc (latest first)
        assert_equal "My tweet", response_body[0]["content"]
        assert_equal "Other tweet", response_body[1]["content"]
      end
    end
  end
end
