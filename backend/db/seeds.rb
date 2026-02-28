require_relative 'seeds/users_seeder'
require_relative 'seeds/tweets_seeder'
require_relative 'seeds/follows_seeder'
require_relative 'seeds/likes_seeder'

puts "Cleaning up old seed data..."
User.where("email LIKE 'user%@example.com'").destroy_all

ActiveRecord::Base.transaction do
  puts "Starting Seed Generation..."

  Seeds::UsersSeeder.seed!(num_users: 20)
  Seeds::TweetsSeeder.seed!(tweets_per_user_range: 2..5)
  Seeds::FollowsSeeder.seed!(follows_per_user_range: 5..15)
  Seeds::LikesSeeder.seed!(max_likes_per_user: 20)

  puts "Seed Generation Complete!"
end
