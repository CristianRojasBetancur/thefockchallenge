# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  bio             :string(160)
#  date_of_birth   :date
#  email           :string           default(""), not null
#  followers_count :integer          default(0), not null
#  following_count :integer          default(0), not null
#  handle          :string           default(""), not null
#  location        :string(100)
#  name            :string
#  password_digest :string           default(""), not null
#  tweets_count    :integer          default(0), not null
#  username        :string           default(""), not null
#  verified        :boolean          default(FALSE), not null
#  website         :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email     (email) UNIQUE
#  index_users_on_handle    (handle) UNIQUE
#  index_users_on_username  (username) UNIQUE
#
class UserSerializer
  def initialize(user)
    @user = user
  end

  def as_json
    {
      id:               @user.id,
      email:            @user.email,
      username:         @user.username,
      handle:           @user.handle,
      name:             @user.name,
      bio:              @user.bio,
      location:         @user.location,
      website:          @user.website,
      date_of_birth:    @user.date_of_birth,
      verified:         @user.verified,
      followers_count:  @user.followers_count,
      following_count:  @user.following_count,
      tweets_count:     @user.tweets_count,
      avatar_url:       attachment_url(@user.avatar),
      banner_url:       attachment_url(@user.banner),
      created_at:       @user.created_at,
      is_following:     false
    }
  end

  private

  def attachment_url(attachment)
    return nil unless attachment.attached?

    options = Rails.application.config.action_mailer.default_url_options || { host: "localhost:3000" }

    Rails.application.routes.url_helpers.rails_storage_proxy_url(attachment, **options)
  end
end
