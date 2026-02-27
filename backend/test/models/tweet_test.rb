require "test_helper"

class TweetTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "test_#{SecureRandom.hex}@example.com",
      username: "user_#{SecureRandom.hex(4)}",
      password: "password123",
      password_confirmation: "password123"
    )
  end

  test "validates presence of content" do
    tweet = @user.tweets.build(content: "")
    assert_not tweet.valid?
    assert tweet.errors[:content].any?
  end

  test "validates maximum length of content" do
    tweet = @user.tweets.build(content: "a" * 281)
    assert_not tweet.valid?
    assert tweet.errors[:content].any?
  end

  test "belongs to user" do
    tweet = Tweet.new(content: "Valid tweet")
    assert_not tweet.valid?
    assert tweet.errors[:user].any?
  end

  test "is valid with valid attributes" do
    tweet = @user.tweets.build(content: "Valid tweet")
    assert tweet.valid?
  end
end
