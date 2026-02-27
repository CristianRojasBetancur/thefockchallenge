json.extract! tweet, :id, :content, :created_at

json.user do
  json.partial! "api/v1/users/user", user: tweet.user
end
