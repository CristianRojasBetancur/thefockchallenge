# frozen_string_literal: true

require_relative 'data_dictionaries'

module Seeds
  class TweetsSeeder
    def self.seed!(tweets_per_user_range: 3..10)
      Rails.logger.info "Seeding Tweets..."
      tweets_templates = Seeds::DataDictionaries::TWEETS
      
      User.find_each do |user|
        num_tweets = rand(tweets_per_user_range)
        
        num_tweets.times do
          created_at = rand(30.days).seconds.ago
          content = tweets_templates.sample
          
          user.tweets.create!(
            content: content,
            created_at: created_at,
            updated_at: created_at
          )
        end
      end
      
      Rails.logger.info "Seeded #{Tweet.count} tweets."
    end
  end
end
