json.extract! user, :id, :username, :name, :handle, :bio, :location, :website, :date_of_birth, :verified, :followers_count, :following_count, :tweets_count, :created_at

if user.avatar.attached?
  json.avatar_url Rails.application.routes.url_helpers.rails_blob_url(
    user.avatar, host: Rails.application.config.action_mailer.default_url_options&.dig(:host) || "localhost:3000"
  )
else
  json.avatar_url nil
end

if user.banner.attached?
  json.banner_url Rails.application.routes.url_helpers.rails_blob_url(
    user.banner, host: Rails.application.config.action_mailer.default_url_options&.dig(:host) || "localhost:3000"
  )
else
  json.banner_url nil
end
