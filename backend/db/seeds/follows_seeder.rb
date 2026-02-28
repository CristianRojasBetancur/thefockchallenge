# frozen_string_literal: true

module Seeds
  class FollowsSeeder
    def self.seed!(follows_per_user_range: 10..20)
      Rails.logger.info "Seeding Follows..."
      
      user_ids = User.pluck(:id)
      
      user_ids.each do |follower_id|
        num_follows = rand(follows_per_user_range)
        followed_ids = (user_ids - [follower_id]).sample(num_follows)
        
        followed_ids.each do |followed_id|
          Follow.create(follower_id: follower_id, followed_id: followed_id)
        end
      end
      
      Rails.logger.info "Seeded #{Follow.count} follows."
    end
  end
end
