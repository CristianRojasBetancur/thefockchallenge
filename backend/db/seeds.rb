require_relative 'seeds/users_seeder'
require_relative 'seeds/tweets_seeder'
require_relative 'seeds/follows_seeder'
require_relative 'seeds/likes_seeder'

puts "Cleaning up old seed data..."
User.where("email LIKE 'user%@example.com'").destroy_all

ActiveRecord::Base.transaction do
  puts "Starting Seed Generation..."

  Seeds::UsersSeeder.seed!(num_users: 100)
  Seeds::TweetsSeeder.seed!(tweets_per_user_range: 3..10)
  Seeds::FollowsSeeder.seed!(follows_per_user_range: 10..20)
  Seeds::LikesSeeder.seed!(max_likes_per_user: 50)

  puts "Seed Generation Complete!"
end
