# frozen_string_literal: true

require "test_helper"

class FollowTest < ActiveSupport::TestCase
  setup do
    @follower = User.create!(
      email: "follower1@example.com",
      username: "follower1",
      handle: "follower1",
      password: "password",
      password_confirmation: "password"
    )
    @followed = User.create!(
      email: "followed1@example.com",
      username: "followed1",
      handle: "followed1",
      password: "password",
      password_confirmation: "password"
    )
  end

  test "can follow another user" do
    follow = Follow.new(follower: @follower, followed: @followed)
    assert follow.valid?
    assert_difference("Follow.count", 1) do
      follow.save!
    end
  end

  test "cannot follow self" do
    follow = Follow.new(follower: @follower, followed: @follower)
    assert_not follow.valid?
    assert_includes follow.errors[:base], "no puedes seguirte a ti mismo"
  end

  test "cannot follow the same user twice" do
    Follow.create!(follower: @follower, followed: @followed)

    duplicate_follow = Follow.new(follower: @follower, followed: @followed)
    assert_not duplicate_follow.valid?
    assert_includes duplicate_follow.errors[:follower_id], "ya sigues a este usuario"
  end

  test "following updates counter caches" do
    assert_difference -> { @follower.reload.following_count }, 1 do
      assert_difference -> { @followed.reload.followers_count }, 1 do
        Follow.create!(follower: @follower, followed: @followed)
      end
    end
  end
end
