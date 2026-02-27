require "test_helper"

class UserTest < ActiveSupport::TestCase
  def valid_attributes
    {
      email:                 "test@example.com",
      username:              "testuser",
      handle:                "testuser",
      password:              "securepassword",
      password_confirmation: "securepassword"
    }
  end

  test "is valid with all required attributes" do
    user = User.new(valid_attributes)
    assert user.valid?
  end

  test "requires email" do
    user = User.new(valid_attributes.merge(email: ""))
    refute user.valid?
    assert_includes user.errors[:email], "no puede estar en blanco"
  end

  test "rejects malformed email" do
    user = User.new(valid_attributes.merge(email: "not-an-email"))
    refute user.valid?
    assert user.errors[:email].any?
  end

  test "requires unique email (case-insensitive)" do
    User.create!(valid_attributes)
    duplicate = User.new(valid_attributes.merge(email: "TEST@EXAMPLE.COM"))
    refute duplicate.valid?
    assert user_exists_with_email?("test@example.com")
  end

  test "requires username" do
    user = User.new(valid_attributes.merge(username: ""))
    refute user.valid?
  end

  test "requires password of at least 8 characters" do
    user = User.new(valid_attributes.merge(password: "short", password_confirmation: "short"))
    refute user.valid?
    assert user.errors[:password].any?
  end

  test "generate_jwt returns a non-blank string" do
    user = User.create!(valid_attributes)
    token = user.generate_jwt
    assert token.is_a?(String)
    assert token.present?
  end

  test "from_jwt round-trips back to the same user" do
    user  = User.create!(valid_attributes)
    token = user.generate_jwt
    found = User.from_jwt(token)
    assert_equal user.id, found.id
  end

  test "from_jwt raises InvalidToken for garbage input" do
    assert_raises Authentication::Errors::InvalidToken do
      User.from_jwt("not.a.jwt")
    end
  end

  private

  def user_exists_with_email?(email)
    User.exists?(email: email)
  end
end
