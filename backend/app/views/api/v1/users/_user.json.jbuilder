json.extract! user, :id, :username, :name, :handle, :bio, :location, :website, :date_of_birth, :verified, :followers_count, :following_count, :tweets_count, :created_at

if user.avatar.attached?
  opts = Rails.application.config.action_mailer.default_url_options || { host: "localhost", port: 3000 }
  json.avatar_url Rails.application.routes.url_helpers.rails_storage_proxy_url(user.avatar, **opts)
else
  json.avatar_url nil
end

if user.banner.attached?
  opts = Rails.application.config.action_mailer.default_url_options || { host: "localhost", port: 3000 }
  json.banner_url Rails.application.routes.url_helpers.rails_storage_proxy_url(user.banner, **opts)
else
  json.banner_url nil
end

if defined?(@current_user) && @current_user && @current_user.id != user.id
  json.is_following @current_user.active_follows.exists?(followed_id: user.id)
else
  json.is_following false
end
