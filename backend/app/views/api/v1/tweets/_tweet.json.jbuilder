json.extract! tweet, :id, :content, :created_at, :likes_count

if defined?(current_user) && current_user
  json.liked_by_current_user tweet.likes.loaded? ? tweet.likes.any? { |l| l.user_id == current_user.id } : tweet.likes.exists?(user_id: current_user.id)
end

json.user do
  json.partial! "api/v1/users/user", user: tweet.user
end
