# frozen_string_literal: true

module Seeds
  class LikesSeeder
    def self.seed!(max_likes_per_user: 50)
      Rails.logger.info "Seeding Likes..."
      
      user_ids = User.pluck(:id)
      tweet_ids = Tweet.pluck(:id)
      
      user_ids.each do |user_id|
        num_likes = rand(10..max_likes_per_user)
        liked_tweet_ids = tweet_ids.sample(num_likes)
        
        liked_tweet_ids.each do |tweet_id|
          Like.create(user_id: user_id, tweet_id: tweet_id)
        end
      end
      
      Rails.logger.info "Seeded #{Like.count} likes."
    end
  end
end
