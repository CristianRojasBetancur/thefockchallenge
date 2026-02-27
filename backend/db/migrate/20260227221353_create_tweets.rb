class CreateTweets < ActiveRecord::Migration[8.1]
  def change
    create_table :tweets do |t|
      t.references :user, null: false, foreign_key: true
      t.string :content, limit: 280, null: false

      t.timestamps
    end
    add_index :tweets, [ :user_id, :created_at ]
  end
end
