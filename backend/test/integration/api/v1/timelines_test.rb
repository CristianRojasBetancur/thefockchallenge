require "test_helper"

module Api
  module V1
    class TimelinesTest < ActionDispatch::IntegrationTest
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
        @stranger = User.create!(
          email: "stranger_#{SecureRandom.hex}@example.com",
          username: "user3_#{SecureRandom.hex(4)}",
          password: "password123",
          password_confirmation: "password123"
        )

        @user.tweets.create!(content: "My own tweet", created_at: 1.day.ago)
        @followed_user.tweets.create!(content: "Followed tweet", created_at: 2.days.ago)
        @stranger.tweets.create!(content: "Stranger tweet", created_at: 3.days.ago)

        Follow.create!(follower: @user, followed: @followed_user)
        post auth_login_path, params: { session: { email: @user.email, password: "password123" } }, as: :json
      end

      test "fetches timeline tweets" do
        get api_v1_timeline_url, as: :json

        assert_response :success
        response_json = JSON.parse(response.body)

        assert_equal 2, response_json.length
        assert_equal "My own tweet", response_json[0]["content"]
        assert_equal "Followed tweet", response_json[1]["content"]
      end
    end
  end
end
