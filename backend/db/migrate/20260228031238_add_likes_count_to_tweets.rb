class AddLikesCountToTweets < ActiveRecord::Migration[8.1]
  def change
    add_column :tweets, :likes_count, :integer, default: 0, null: false
    add_check_constraint :tweets, "likes_count >= 0", name: "tweets_likes_count_check"
  end
end
