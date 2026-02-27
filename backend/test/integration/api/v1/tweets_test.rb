require "test_helper"

module Api
  module V1
    class TweetsTest < ActionDispatch::IntegrationTest
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
      end

      test "creates a tweet" do
        assert_difference("Tweet.count", 1) do
          post api_v1_tweets_url, params: { tweet: { content: "Hello world" } }, as: :json
        end
        assert_response :created
        assert_equal "Hello world", JSON.parse(response.body)["content"]
      end

      test "fails to create tweet with invalid content" do
        assert_no_difference("Tweet.count") do
          post api_v1_tweets_url, params: { tweet: { content: "" } }, as: :json
        end
        assert_response :unprocessable_entity
      end

      test "deletes a tweet" do
        tweet = @user.tweets.create!(content: "To be deleted")

        assert_difference("Tweet.count", -1) do
          delete api_v1_tweet_url(tweet.id), as: :json
        end
        assert_response :no_content
      end

      test "fails to delete unauthorized tweet" do
        tweet = @other_user.tweets.create!(content: "Not mine")

        assert_no_difference("Tweet.count") do
          delete api_v1_tweet_url(tweet.id), as: :json
        end
        assert_response :forbidden
      end

      test "fails to delete non-existent tweet" do
        delete api_v1_tweet_url(9999), as: :json
        assert_response :not_found
      end
    end
  end
end
