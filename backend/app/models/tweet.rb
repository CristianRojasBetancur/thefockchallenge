# == Schema Information
#
# Table name: tweets
#
#  id          :bigint           not null, primary key
#  content     :string(280)      not null
#  likes_count :integer          default(0), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_tweets_on_user_id                 (user_id)
#  index_tweets_on_user_id_and_created_at  (user_id,created_at)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Tweet < ApplicationRecord
  belongs_to :user, counter_cache: true

  has_many :likes, dependent: :destroy
  has_many :liking_users, through: :likes, source: :user

  validates :content, presence: true, length: { maximum: 280 }
end
