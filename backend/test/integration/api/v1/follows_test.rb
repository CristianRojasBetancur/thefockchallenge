require "test_helper"

module Api
  module V1
    class FollowsTest < ActionDispatch::IntegrationTest
      setup do
        @user = User.create!(
          email: "user_1_#{SecureRandom.hex}@example.com",
          username: "user1_#{SecureRandom.hex(4)}",
          password: "password123",
          password_confirmation: "password123"
        )
        @followed_user = User.create!(
          email: "user_2_#{SecureRandom.hex}@example.com",
          username: "user2_#{SecureRandom.hex(4)}",
          password: "password123",
          password_confirmation: "password123"
        )
        @other_user = User.create!(
          email: "user_3_#{SecureRandom.hex}@example.com",
          username: "user3_#{SecureRandom.hex(4)}",
          password: "password123",
          password_confirmation: "password123"
        )

        post auth_login_path, params: { session: { email: @user.email, password: "password123" } }, as: :json
      end

      test "follows a user" do
        assert_difference("Follow.count", 1) do
          post api_v1_user_follow_url(@followed_user.id), as: :json
        end
        assert_response :created
      end

      test "fails to follow self" do
        assert_no_difference("Follow.count") do
          post api_v1_user_follow_url(@user.id), as: :json
        end
        assert_response :unprocessable_entity
      end

      test "unfollows a user" do
        Follow.create!(follower: @user, followed: @followed_user)

        assert_difference("Follow.count", -1) do
          delete api_v1_user_follow_url(@followed_user.id), as: :json
        end
        assert_response :no_content
      end

      test "unfollows gracefully when not following" do
        assert_no_difference("Follow.count") do
          delete api_v1_user_follow_url(@followed_user.id), as: :json
        end
        assert_response :no_content
      end

      test "gets followers list" do
        Follow.create!(follower: @user, followed: @followed_user)
        Follow.create!(follower: @other_user, followed: @followed_user)

        get api_v1_user_followers_url(@followed_user.id), as: :json
        assert_response :success

        response_json = JSON.parse(response.body)
        assert_equal 2, response_json.length
        # Default order is recent first
        assert_equal @other_user.username, response_json[0]["username"]
        assert_equal @user.username, response_json[1]["username"]
      end

      test "gets following list" do
        Follow.create!(follower: @user, followed: @followed_user)
        Follow.create!(follower: @user, followed: @other_user)

        get api_v1_user_following_url(@user.id), as: :json
        assert_response :success

        response_json = JSON.parse(response.body)
        assert_equal 2, response_json.length
        assert_equal @other_user.username, response_json[0]["username"]
        assert_equal @followed_user.username, response_json[1]["username"]
      end
    end
  end
end
