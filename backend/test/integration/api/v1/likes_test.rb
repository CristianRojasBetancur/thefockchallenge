require "test_helper"

module Api
  module V1
    class LikesTest < ActionDispatch::IntegrationTest
      setup do
        @user = User.create!(
          email: "test_#{SecureRandom.hex}@example.com",
          username: "user_#{SecureRandom.hex(4)}",
          password: "password123",
          password_confirmation: "password123"
        )
        post auth_login_path, params: { session: { email: @user.email, password: "password123" } }, as: :json

        @tweet = @user.tweets.create!(content: "My awesome tweet")
      end

      test "likes a tweet" do
        assert_difference("Like.count", 1) do
          post api_v1_tweet_like_url(@tweet.id), as: :json
        end
        assert_response :created

        @tweet.reload
        assert_equal 1, @tweet.likes_count
      end

      test "liking a tweet twice is idempotent" do
        post api_v1_tweet_like_url(@tweet.id), as: :json
        assert_response :created

        assert_no_difference("Like.count") do
          post api_v1_tweet_like_url(@tweet.id), as: :json
        end
        assert_response :ok
      end

      test "unlikes a tweet" do
        post api_v1_tweet_like_url(@tweet.id), as: :json
        
        assert_difference("Like.count", -1) do
          delete api_v1_tweet_like_url(@tweet.id), as: :json
        end
        assert_response :ok

        @tweet.reload
        assert_equal 0, @tweet.likes_count
      end

      test "unliking an unliked tweet is idempotent" do
        assert_no_difference("Like.count") do
          delete api_v1_tweet_like_url(@tweet.id), as: :json
        end
        assert_response :ok
      end
    end
  end
end
